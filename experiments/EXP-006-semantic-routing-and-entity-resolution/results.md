# RES-001: EXP-006 structural demonstration

**Status:** AutomatedPassHumanPending

## Scope

The synthetic CAP-001 implementation demonstrates deterministic identity gating, declared capability planning, adapter failure handling, provenance-aware normalization, conversation continuity, and fail-closed action policy. It is evidence for a bounded subset of EXP-006, not a completed live comparison or validation of the full NeoCRM architecture.

## Automated evidence

| Evidence ID | Command | Outcome | Scope |
| --- | --- | --- | --- |
| CHECK-TRACE | `node scripts/validate-spec.mjs` | Passed | Typed trace/status/evidence consistency. |
| CHECK-TRACE-MUTATIONS | `node --test test/traceability-validator.test.mjs` | Passed | Invalid status, edge, and scope mutations are rejected. |
| EVAL-001 | `node evals/run-eval.mjs` | Previously recorded automated pass | Bounded synthetic CAP-001 questions and safety proxies; rerun in the final gate. |
| EVAL-001-MUTATIONS | `node --test test/eval-mutations.test.mjs` | Previously recorded pass | Evaluator catches selected epistemic, citation, identity, injection, and execution regressions. |

## Evidence boundary

Human evaluation is pending. No permissioned live Zoho/Obsidian behavior, production identity, truly goal-specific source minimization, general Agent runtime, or business Outcome is established. The earlier “unified brief” staging experiment is archived and treated as CAP-001 preflight, not canonical EXP-001 evidence.
