import test from "node:test";
import assert from "node:assert/strict";
import { createTestSystem, relationshipQuestion } from "./helpers.mjs";
import { evaluateRelationshipBrief } from "../evals/run-eval.mjs";

test("EVAL-001 passes the complete deterministic relationship brief", async () => {
  const { assistant } = await createTestSystem();
  const first = await assistant.respond(relationshipQuestion);
  const second = await assistant.respond(relationshipQuestion);
  assert.deepEqual(first, second);

  const evaluation = evaluateRelationshipBrief(first.structured);
  assert.equal(evaluation.evaluationId, "EVAL-001");
  assert.equal(evaluation.score, 100);
  assert.equal(evaluation.passed, true);
  assert.ok(evaluation.criteria.every((criterion) => criterion.passed));
});

