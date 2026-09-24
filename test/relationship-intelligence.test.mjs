import test from "node:test";
import assert from "node:assert/strict";
import { createMockAdapters } from "../adapters/mock/src/index.mjs";
import {
  buildRelationshipBrief,
  toModelSafeContext
} from "../packages/relationship-intelligence/src/index.mjs";
import { createTestSystem, loadFixture, relationshipQuestion } from "./helpers.mjs";

test("minimum-source planning does not query a redundant adapter", async () => {
  const fixture = await loadFixture();
  const redundant = structuredClone(fixture.sources[0]);
  redundant.capability.adapterId = "z-redundant-crm";
  redundant.capability.sourceId = "redundant-crm";
  fixture.sources.push(redundant);

  const { assistant, metrics } = await createTestSystem({ fixture });
  const { structured } = await assistant.respond(relationshipQuestion);

  assert.equal(structured.sourcePlan.steps.length, 4);
  assert.equal(metrics.privateReads, 4);
  assert.ok(!structured.sourcePlan.steps.some((step) => step.adapterId === "z-redundant-crm"));
});

test("capability authority constrains stronger native claim authority", async () => {
  const { assistant } = await createTestSystem();
  const { structured } = await assistant.respond(relationshipQuestion);
  const matter = structured.observations.find(
    (item) => item.predicate === "commercial.matter"
  );

  assert.ok(matter, "commercial matter should be downgraded to an observation");
  assert.ok(!structured.facts.some((item) => item.predicate === "commercial.matter"));
  const evidence = structured.evidence.find(
    (item) => item.evidenceId === matter.evidenceIds[0]
  );
  assert.equal(evidence.source.authority, "corroborating");
});

test("roles and relationships become provenance-backed typed assertions", async () => {
  const { assistant } = await createTestSystem();
  const { structured } = await assistant.respond(relationshipQuestion);
  const assertions = [...structured.facts, ...structured.observations];

  for (const predicate of [
    "role.prospect",
    "role.decision_maker",
    "relationship.employee_of",
    "relationship.member_of_household"
  ]) {
    const item = assertions.find((assertion) => assertion.predicate === predicate);
    assert.ok(item, `missing normalized ${predicate}`);
    assert.ok(item.evidenceIds.length > 0);
  }
});

test("opaque IDs and model-safe context do not expose adapter handles or source identifiers", async () => {
  const { identityResolver, adapters, fixture } = await createTestSystem();
  const structured = await buildRelationshipBrief({
    query: relationshipQuestion,
    identityResolver,
    adapters,
    now: fixture.clock
  });
  const serializedIds = JSON.stringify([
    ...structured.evidence.map((item) => item.evidenceId),
    ...structured.facts.map((item) => item.assertionId),
    ...structured.observations.map((item) => item.assertionId)
  ]);
  assert.doesNotMatch(serializedIds, /crm-contact-101|email-882|note-44/);

  const modelContext = toModelSafeContext(structured);
  const serializedContext = JSON.stringify(modelContext);
  assert.doesNotMatch(serializedContext, /adapterId|nativeId|authorization|scopes|credentials/i);
  assert.ok(adapters.every((adapter) => !Object.values(modelContext).includes(adapter)));
});

test("mock adapter rejects requests outside its validated capability contract", async () => {
  const fixture = await loadFixture();
  const { adapters } = createMockAdapters(fixture);

  await assert.rejects(
    () =>
      adapters[0].read({
        contractType: "adapter_request",
        adapterId: adapters[0].capability.adapterId,
        domains: ["party"],
        filters: { partyId: "party-alex-chen", effectiveAfter: "not-a-date" }
      }),
    (error) => error.code === "CONTRACT_VALIDATION_FAILED"
  );
});

test("planner does not call an unauthorized adapter and reports uncovered context", async () => {
  const fixture = await loadFixture();
  fixture.sources.find(
    (source) => source.capability.adapterId === "mock-notes"
  ).capability.authorization.status = "denied";
  const { assistant, metrics } = await createTestSystem({ fixture });
  const { structured } = await assistant.respond(relationshipQuestion);

  assert.equal(structured.status, "partial");
  assert.equal(metrics.readsByAdapter["mock-notes"], undefined);
  assert.ok(structured.unknowns.some((item) => item.predicate === "context.knowledge"));
});

test("stale adapter results fail closed and are not normalized as evidence", async () => {
  const { assistant } = await createTestSystem({ now: "2026-09-18T00:00:00.000Z" });
  const { structured } = await assistant.respond(relationshipQuestion);

  assert.equal(structured.status, "error");
  assert.equal(structured.evidence.length, 0);
  assert.ok(structured.sourcePlan.steps.every((step) => step.status === "skipped"));
  assert.ok(structured.sourcePlan.steps.every((step) => step.freshness === "stale"));
});

test("every recommendation names typed derivation inputs that exist in the brief", async () => {
  const { assistant } = await createTestSystem();
  const { structured } = await assistant.respond(relationshipQuestion);
  const assertions = new Set(
    [
      ...structured.facts,
      ...structured.observations,
      ...structured.interpretations,
      ...structured.hypotheses,
      ...structured.unknowns,
      ...structured.conflicts
    ].map((item) => item.assertionId)
  );

  assert.ok(structured.recommendations.length > 0);
  for (const recommendation of structured.recommendations) {
    assert.ok(recommendation.derivation.inputAssertionIds.length > 0);
    assert.ok(
      recommendation.derivation.inputAssertionIds.every((assertionId) =>
        assertions.has(assertionId)
      )
    );
  }
});
