# RES-001: EXP-006 demonstration record

**Status:** AutomatedPassHumanPending

## Scope of this result

EXP-006 is implemented as a deterministic, read-only demonstration. This
record reports automated structural checks only. It does **not** claim that the
experiment hypothesis, human usefulness threshold, or production readiness has
been validated.

## Automated structural demonstration

| Evidence ID | Command | Outcome | What it establishes |
| --- | --- | --- | --- |
| CHECK-TRACE | `node scripts/validate-spec.mjs` | Passed | The typed graph, lifecycle states, artifact declarations, and scoped evidence chains are internally consistent. |
| CHECK-TRACE-MUTATIONS | `node --test test/traceability-validator.test.mjs` | Passed | The validator rejects wrong edge types, false lifecycle promotion, and evidence scoped to the wrong experiment. |

Observed on 2026-09-21 against the working implementation represented by
IMP-001, IMP-002, IMP-003, and IMP-004. No code-commit identifier is claimed by
this record.

## Evidence boundary

EVAL-001 is implemented as an evaluation definition, but this result does not
record a completed experimental comparison. The separate EXP-001 through
EXP-005 controls remain Planned. A passing structural check cannot establish
comparative usefulness, answer quality, safety under realistic input, or causal
support for an ADR.

## Human result

Pending. CAP-001 and ADR-0001 through ADR-0005 remain Provisional. Promotion to
Accepted requires the planned experiment/evaluation evidence and a blinded
human usefulness score of at least 3/4 with no safety-gate failure.
