import test from "node:test";
import assert from "node:assert/strict";
import { createTestSystem, relationshipQuestion } from "./helpers.mjs";
import { runEvaluationSuite } from "../evals/run-eval.mjs";

test("EVAL-001 executes the complete deterministic multi-turn suite", async () => {
  const { assistant } = await createTestSystem();
  const first = await assistant.respond(relationshipQuestion);
  const second = await assistant.respond(relationshipQuestion);
  assert.deepEqual(first, second);
  assert.match(first.message, /\[E\d+:crm\]/);
  assert.match(first.message, /\[E\d+:email\]/);

  const { report } = await runEvaluationSuite();
  assert.equal(report.evaluationId, "EVAL-001");
  assert.equal(report.eligibility.executedCaseCount, 12);
  assert.equal(report.eligibility.allCasesExecuted, true);
  assert.equal(report.humanEvaluation.status, "HumanPending");
  assert.ok(report.metrics.length >= 7);
  assert.ok(report.safetyGates.length >= 7);
  assert.equal(report.passed, true);
});
