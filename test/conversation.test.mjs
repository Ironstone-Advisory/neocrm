import test from "node:test";
import assert from "node:assert/strict";
import { createTestSystem, relationshipQuestion } from "./helpers.mjs";

test("relationship brief renders distinct epistemic sections", async () => {
  const { assistant } = await createTestSystem();
  const response = await assistant.respond(relationshipQuestion);

  assert.equal(response.structured.status, "complete");
  assert.equal(response.structured.subject.displayName, "Alex Chen");
  assert.match(response.message, /Known facts/);
  assert.match(response.message, /Recent observations/);
  assert.match(response.message, /Conflicts/);
  assert.match(response.message, /Hypotheses/);
  assert.match(response.message, /Unknowns/);
  assert.match(response.message, /Recommended conversation focus/);
  assert.ok(response.structured.facts.length >= 5);
  assert.ok(response.structured.observations.length >= 5);
  assert.equal(response.structured.conflicts[0].evidenceIds.length, 2);
});

test("session use is explicit and durable memory remains untouched", async () => {
  const { assistant } = await createTestSystem();
  const response = await assistant.respond(relationshipQuestion, {
    traceId: "trace-session-1",
    selectedPartyId: "party-alex-chen"
  });
  assert.equal(response.structured.traceId, "trace-session-1");
  assert.equal(response.structured.memory.sessionContextUsed, true);
  assert.equal(response.structured.memory.durableMemoryWritten, false);
});

