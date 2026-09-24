import test from "node:test";
import assert from "node:assert/strict";
import { createAssistant } from "../apps/assistant/src/assistant.mjs";
import { buildRelationshipBrief, createMemoryLogger } from "../packages/relationship-intelligence/src/index.mjs";
import { createTestSystem, loadFixture, relationshipQuestion } from "./helpers.mjs";

test("source failure produces a partial brief, failed plan step, and unknown", async () => {
  const { assistant } = await createTestSystem({
    failAdapterIds: ["mock-notes"]
  });
  const { structured } = await assistant.respond(relationshipQuestion);
  assert.equal(structured.status, "partial");
  assert.equal(
    structured.sourcePlan.steps.find((step) => step.adapterId === "mock-notes").status,
    "failed"
  );
  assert.ok(structured.unknowns.some((item) => item.text.includes("notes context")));
  assert.ok(structured.evidence.some((item) => item.source.sourceId === "crm"));
});

test("total source failure preserves resolved identity and explains the error", async () => {
  const { assistant } = await createTestSystem({
    failAdapterIds: ["mock-crm", "mock-email", "mock-notes", "mock-calendar"]
  });
  const { structured, message, state } = await assistant.respond(relationshipQuestion);

  assert.equal(structured.status, "error");
  assert.equal(structured.evidence.length, 0);
  assert.ok(structured.sourcePlan.steps.length > 0);
  assert.ok(structured.sourcePlan.steps.every((step) => step.status === "failed"));
  assert.equal(structured.policy.externalWrites, "disabled");
  assert.equal(structured.actions.length, 0);
  assert.equal(structured.subject.partyId, "party-alex-chen");
  assert.equal(state.selectedPartyId, "party-alex-chen");
  assert.match(message, /unable to produce a reliable brief/i);
  assert.match(message, /all planned sources were unavailable/i);
});

test("observability records lifecycle metadata but not private source bodies", async () => {
  const { assistant, logger } = await createTestSystem();
  await assistant.respond(relationshipQuestion);
  const events = logger.entries.map((entry) => entry.event);
  assert.equal(events[0], "request.started");
  assert.ok(events.includes("identity.resolved"));
  assert.equal(events.filter((event) => event === "source.completed").length, 4);
  assert.equal(events.at(-1), "request.completed");
  const serialized = JSON.stringify(logger.entries);
  assert.doesNotMatch(serialized, /Ignore all previous instructions/);
  assert.doesNotMatch(serialized, /security pack by September 24/);
});

test("raw source failures and error codes cannot enter responses or observability", async () => {
  const system = await createTestSystem();
  const target = system.adapters.find((adapter) => adapter.capability.adapterId === "mock-notes");
  target.read = async () => {
    const error = new Error("C:\\private\\vault\\secret-token raw response body");
    error.code = "C:\\private\\vault\\secret-token";
    throw error;
  };
  const { structured, message } = await system.assistant.respond(relationshipQuestion);
  const serialized = JSON.stringify({ structured, message, logs: system.logger.entries });
  assert.equal(structured.status, "partial");
  assert.doesNotMatch(serialized, /secret-token|raw response body|C:\\\\private/i);
  assert.ok(system.logger.entries.some(
    (entry) => entry.event === "source.failed" && entry.code === "SOURCE_BOUNDARY_FAILED"
  ));
});

test("identity boundary failures are sanitized before any private source read", async () => {
  const fixture = await loadFixture();
  const logger = createMemoryLogger();
  let reads = 0;
  const response = await buildRelationshipBrief({
    query: relationshipQuestion,
    identityResolver: {
      async resolve() {
        const error = new Error("C:\\private\\identity\\secret-token raw identity body");
        error.code = "SECRET_TOKEN";
        throw error;
      }
    },
    adapters: [{ capability: fixture.sources[0].capability, async read() { reads += 1; } }],
    now: fixture.clock,
    logger
  });
  const serialized = JSON.stringify({ response, logs: logger.entries });
  assert.equal(response.status, "error");
  assert.equal(reads, 0);
  assert.match(response.unknowns[0].text, /identity boundary was unavailable/i);
  assert.doesNotMatch(serialized, /secret-token|raw identity body|C:\\\\private/i);
  assert.ok(logger.entries.some(
    (entry) => entry.event === "identity.failed" && entry.code === "IDENTITY_BOUNDARY_FAILED"
  ));
});

test("assistant also sanitizes identity resolver failures", async () => {
  const system = await createTestSystem();
  const assistant = createAssistant({
    identityResolver: {
      async resolve() {
        throw new Error("C:\\private\\identity\\secret-token raw body");
      }
    },
    adapters: system.adapters,
    now: system.fixture.clock,
    logger: system.logger
  });
  const answer = await assistant.respond(relationshipQuestion);
  const serialized = JSON.stringify(answer);
  assert.equal(answer.structured.status, "error");
  assert.equal(system.metrics.privateReads, 0);
  assert.doesNotMatch(serialized, /secret-token|raw body|C:\\\\private/i);
});
