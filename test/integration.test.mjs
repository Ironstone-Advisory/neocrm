import test from "node:test";
import assert from "node:assert/strict";
import { createTestSystem, relationshipQuestion } from "./helpers.mjs";

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

