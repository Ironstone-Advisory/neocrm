# RES-002: EXP-001 fixture preflight record

**Status:** Recorded

## Scope

EVAL-002 records deterministic implementation evidence for the read-only EXP-001 reference path: bounded agent-run contracts, policy-before-retrieval, identity-before-private-read, production-shaped Zoho and Obsidian adapters, fixture Conditions B/C, and content-free preflight. It does not test the live product hypothesis.

## Automated evidence

| Evidence ID | Command | Outcome | Scope |
| --- | --- | --- | --- |
| CHECK-EXP001-TESTS | `node --test test/agent-runtime.test.mjs test/zoho-adapter.test.mjs test/obsidian-adapter.test.mjs test/exp001-cli.test.mjs` | Passed | Deterministic runtime, adapter, boundary, CLI, and fixture tests. |
| CHECK-EXP001-PREFLIGHT | `node apps/experiment-cli/src/cli.mjs --preflight --mode fixture --condition C` | Passed | Content-free fixture readiness report. |
| CHECK-EXP001-FIXTURE-C | `node apps/experiment-cli/src/cli.mjs --mode fixture --condition C --query "What do I need to know before I speak with Alex Rivera?"` | Passed | Synthetic Zoho plus Obsidian path through the shared contracts. |

## Evidence boundary

Human evaluation is pending. No live Zoho tenant, private Obsidian vault, permissioned customer scenario, Condition A timing, paired B/C usefulness score, business Outcome, production security, or production readiness has been demonstrated. EXP-001 therefore remains **Planned** and its preregistered success thresholds remain unevaluated.
