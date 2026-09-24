import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createMockAdapters } from "../adapters/mock/src/index.mjs";
import { createZohoAdapter } from "../adapters/zoho/src/index.mjs";
import { createZohoFixtureFetch } from "../adapters/zoho/src/fixture-fetch.mjs";
import {
  createReadOnlyGrant,
  recordHumanFeedback,
  runRelationshipBriefAgent
} from "../packages/agent-runtime/src/index.mjs";
import { createRelationshipContextBoundary } from "../packages/context-engine/src/index.mjs";
import { validateContract } from "../packages/contracts/src/runtime.mjs";
import { planMinimumSources, toModelSafeContext } from "../packages/relationship-intelligence/src/index.mjs";
import { createTestSystem, loadFixture, relationshipQuestion } from "./helpers.mjs";

function trigger(kind, now, query = relationshipQuestion) {
  return {
    contractType: "trigger",
    triggerId: `trigger-${kind}`,
    kind,
    receivedAt: now,
    query
  };
}

async function runtimeSystem() {
  const fixture = await loadFixture();
  const sources = createMockAdapters(fixture);
  const contextBoundary = createRelationshipContextBoundary({
    ...sources,
    now: fixture.clock,
    logger: { log() {} }
  });
  const grant = createReadOnlyGrant({
    expiresAt: new Date(Date.parse(fixture.clock) + 3600000).toISOString()
  });
  return { fixture, ...sources, contextBoundary, grant };
}

test("agent-run contracts validate the bounded Goal, Plan, policy, handoff, snapshot and audit", async () => {
  const system = await runtimeSystem();
  const auditEntries = [];
  const run = await runRelationshipBriefAgent({
    trigger: trigger("conversational", system.fixture.clock),
    authorityGrant: system.grant,
    contextBoundary: system.contextBoundary,
    now: system.fixture.clock,
    auditLogger: { log(entry) { auditEntries.push(entry); } }
  });
  assert.equal(validateContract("AgentRun", run).valid, true);
  for (const [name, value] of [
    ["AgentDefinition", run.agent],
    ["AuthorityGrant", run.grant],
    ["Trigger", run.trigger],
    ["Goal", run.goal],
    ["Plan", run.plan],
    ["PolicyDecision", run.policyDecision],
    ["ContextSnapshot", run.contextSnapshot],
    ["Handoff", run.handoff]
  ]) assert.equal(validateContract(name, value).valid, true, name);
  assert.ok(run.audit.every((event) => validateContract("AuditEvent", event).valid));
  assert.deepEqual(run.agent.allowedOperations, ["read"]);
  assert.equal(run.goal.constraints.externalWrites, false);
  const serializedAudit = JSON.stringify(auditEntries);
  assert.doesNotMatch(serializedAudit, /security pack by September 24|Ignore all previous|access[_-]?token|refresh[_-]?token/i);
});

test("conversational and scheduled triggers use the same run path and produce the same brief", async () => {
  const system = await runtimeSystem();
  const runs = await Promise.all(
    ["conversational", "scheduled"].map((kind) =>
      runRelationshipBriefAgent({
        trigger: trigger(kind, system.fixture.clock),
        authorityGrant: system.grant,
        contextBoundary: system.contextBoundary,
        now: system.fixture.clock
      })
    )
  );
  const briefs = runs.map((run) => ({ ...run.brief, traceId: "stable" }));
  assert.deepEqual(briefs[0], briefs[1]);
  assert.deepEqual(runs.map((run) => run.trigger.kind), ["conversational", "scheduled"]);
});

test("policy precheck denies an expired grant before identity or private retrieval", async () => {
  const system = await runtimeSystem();
  const expired = createReadOnlyGrant({ expiresAt: "2026-09-19T00:00:00.000Z" });
  let boundaryCalls = 0;
  const run = await runRelationshipBriefAgent({
    trigger: trigger("scheduled", system.fixture.clock),
    authorityGrant: expired,
    contextBoundary: { async resolve() { boundaryCalls += 1; } },
    now: system.fixture.clock
  });
  assert.equal(run.status, "denied");
  assert.equal(boundaryCalls, 0);
  assert.equal(system.metrics.identityResolutions, 0);
  assert.equal(system.metrics.privateReads, 0);
  assert.equal(run.plan.steps.find((step) => step.kind === "policy_precheck").status, "completed");
  assert.ok(run.plan.steps.filter((step) => step.kind !== "policy_precheck").every((step) => step.status === "blocked"));
});

test("context-boundary exceptions become a sanitized failed AgentRun", async () => {
  const fixture = await loadFixture();
  const audit = [];
  const run = await runRelationshipBriefAgent({
    trigger: trigger("conversational", fixture.clock),
    authorityGrant: createReadOnlyGrant({ expiresAt: "2026-09-21T00:00:00.000Z" }),
    contextBoundary: {
      async resolve() {
        throw new Error("C:\\private\\vault\\secret-token raw body");
      }
    },
    now: fixture.clock,
    auditLogger: { log(item) { audit.push(item); } }
  });
  const serialized = JSON.stringify({ run, audit });
  assert.equal(run.status, "failed");
  assert.equal(run.brief, null);
  assert.equal(run.contextSnapshot, null);
  assert.equal(run.plan.steps.find((step) => step.kind === "identity_resolution").status, "failed");
  assert.ok(run.plan.steps.filter((step) => ["context_retrieval", "synthesis"].includes(step.kind)).every((step) => step.status === "blocked"));
  assert.doesNotMatch(serialized, /secret-token|raw body|C:\\\\private/i);
  assert.ok(run.audit.some((item) => item.event === "run.failed" && item.safeMetadata.reasonCode === "CONTEXT_BOUNDARY_FAILED"));
});

test("agent runtime preserves identity-before-private-read for ambiguous candidates", async () => {
  const fixture = await loadFixture();
  fixture.parties.push({ ...structuredClone(fixture.parties[0]), partyId: "party-alex-duplicate" });
  const sources = createMockAdapters(fixture);
  const boundary = createRelationshipContextBoundary({ ...sources, now: fixture.clock });
  const run = await runRelationshipBriefAgent({
    trigger: trigger("conversational", fixture.clock),
    authorityGrant: createReadOnlyGrant({ expiresAt: "2026-09-21T00:00:00.000Z" }),
    contextBoundary: boundary,
    now: fixture.clock
  });
  assert.equal(run.status, "needs_disambiguation");
  assert.equal(sources.metrics.privateReads, 0);
  assert.equal(run.contextSnapshot, null);
});

test("feedback creates record-only Outcome and LearningSignal without self-modification", async () => {
  const system = await runtimeSystem();
  const run = await runRelationshipBriefAgent({
    trigger: trigger("conversational", system.fixture.clock),
    authorityGrant: system.grant,
    contextBoundary: system.contextBoundary,
    now: system.fixture.clock
  });
  const before = structuredClone(run);
  const sourceMetricsBefore = structuredClone(system.metrics);
  const feedback = recordHumanFeedback({ run, rating: 4, notes: "Useful synthetic run", now: system.fixture.clock });
  assert.equal(validateContract("Outcome", feedback.outcome).valid, true);
  assert.equal(validateContract("LearningSignal", feedback.learningSignal).valid, true);
  assert.equal(feedback.learningSignal.effect, "record_only");
  assert.deepEqual(feedback.learningSignal.prohibitedMutations.sort(), ["configuration", "mapping", "policy", "prompt", "source_data"]);
  assert.deepEqual(run, before);
  assert.deepEqual(system.metrics, sourceMetricsBefore);
});

test("recommendation cannot validate as an epistemic Assertion", () => {
  const recommendation = {
    recommendationId: "rec-1",
    decisionType: "verify",
    predicate: "recommendation.verify",
    text: "Verify it.",
    options: [{ optionId: "verify", label: "Verify" }],
    rationale: "Evidence conflicts.",
    evidenceIds: [],
    derivation: { transformationId: "test", extractor: "deterministic_rule", modelVersion: null, inputAssertionIds: ["a-1"] },
    status: "proposed"
  };
  assert.equal(validateContract("Recommendation", recommendation).valid, true);
  assert.equal(validateContract("Assertion", recommendation).valid, false);
});

test("source authority neither forces Fact nor creates numerical confidence", async () => {
  const fixture = await loadFixture();
  const title = fixture.sources[0].records[0].claims[0];
  title.authority = "authoritative";
  title.epistemicCategory = "observation";
  title.completeness = "known_partial";
  delete title.confidence;
  const { assistant } = await createTestSystem({ fixture });
  const { structured } = await assistant.respond(relationshipQuestion);
  const assertion = structured.observations.find((item) => item.predicate === "person.title");
  assert.ok(assertion);
  assert.equal(Object.hasOwn(assertion, "confidence"), false);
  assert.equal(structured.facts.some((item) => item.predicate === "person.title"), false);
  const evidence = structured.evidence.find((item) => item.evidenceId === assertion.evidenceIds[0]);
  assert.equal(evidence.source.authority, "authoritative");
  assert.equal(evidence.source.completeness, "known_partial");
});

test("agent run IDs are replay-stable, concurrency-safe, and distinct across experiment conditions", async () => {
  const system = await runtimeSystem();
  const runInput = (condition) => ({
    trigger: {
      ...trigger("conversational", system.fixture.clock),
      triggerId: `trigger-fixture-${condition}`
    },
    authorityGrant: system.grant,
    contextBoundary: system.contextBoundary,
    now: system.fixture.clock
  });
  const [first, replay] = await Promise.all([
    runRelationshipBriefAgent(runInput("B")),
    runRelationshipBriefAgent(runInput("B"))
  ]);
  const conditionC = await runRelationshipBriefAgent(runInput("C"));
  assert.equal(first.runId, replay.runId);
  assert.deepEqual(first, replay);
  assert.notEqual(first.runId, conditionC.runId);
  assert.equal(new Set(first.audit.map((item) => item.eventId)).size, first.audit.length);
  assert.equal(new Set(conditionC.audit.map((item) => item.eventId)).size, conditionC.audit.length);
});

test("planner requires explicit Goal/Intent domains and model context has no control channel", async () => {
  const { adapters, assistant } = await createTestSystem();
  assert.throws(() => planMinimumSources({ adapters, subjectPartyId: "party-alex-chen" }), /explicit intent/);
  const knowledgeOnly = planMinimumSources({
    adapters,
    subjectPartyId: "party-alex-chen",
    intent: "relationship_brief",
    requiredDomains: ["knowledge"]
  });
  assert.equal(knowledgeOnly.plan.steps.length, 1);
  assert.deepEqual(knowledgeOnly.plan.steps[0].domains, ["knowledge"]);
  assert.deepEqual(knowledgeOnly.uncoveredDomains, []);
  const { structured } = await assistant.respond(relationshipQuestion);
  const modelContext = toModelSafeContext(structured);
  assert.ok(modelContext.assertions.every((item) => item.controlCapabilities.length === 0));
  assert.ok(modelContext.evidence.every((item) => item.controlCapabilities.length === 0));
  assert.ok(modelContext.evidence.some((item) => item.content.channel === "untrusted_data"));
});

test("denied sources disclose only requested domains, not protected source identity or errors", async () => {
  const { assistant } = await createTestSystem({ deniedAdapterIds: ["mock-notes"] });
  const { structured, message } = await assistant.respond(relationshipQuestion);
  const serialized = JSON.stringify({ structured, message });
  assert.ok(structured.unknowns.some((item) => item.predicate === "context.knowledge" && /access policy/i.test(item.text)));
  assert.doesNotMatch(serialized, /Access denied by fixture policy/i);
  assert.doesNotMatch(serialized, /source\.notes|notes context is unknown because the source was denied/i);
});

test("source credentials cannot enter agent runs, model context, preflight, or audit logs", async () => {
  const fixture = JSON.parse(
    await readFile(new URL("../experiments/fixtures/zoho-obsidian-parity.json", import.meta.url), "utf8")
  );
  const secret = "qa-source-token-never-expose";
  const transport = createZohoFixtureFetch(fixture);
  const zoho = createZohoAdapter(
    { region: "ca", accessToken: secret },
    { fetchImpl: transport.fetchImpl, now: () => fixture.clock }
  );
  const boundary = createRelationshipContextBoundary({
    identityResolver: zoho.identityResolver,
    adapters: [zoho.adapter],
    now: fixture.clock
  });
  const audit = [];
  const run = await runRelationshipBriefAgent({
    trigger: trigger("conversational", fixture.clock, "Brief me on Alex Rivera"),
    authorityGrant: createReadOnlyGrant({
      expiresAt: new Date(Date.parse(fixture.clock) + 3600000).toISOString()
    }),
    contextBoundary: boundary,
    now: fixture.clock,
    auditLogger: { log(item) { audit.push(item); } }
  });
  const modelContext = toModelSafeContext(run.brief);
  const serialized = JSON.stringify({ run, modelContext, preflight: zoho.preflight(), audit, transport: transport.calls });
  assert.doesNotMatch(serialized, new RegExp(secret, "i"));
  assert.doesNotMatch(serialized, /Zoho-oauthtoken|refresh_token=|client_secret=/i);
});
