# ADR-0016: Permit scoped time-bounded experimental write authority

**Decision status:** Accepted

**Implementation status:** Planned

**Evidence maturity:** Planned

**Validation plan:** EXP-015 / EVAL-004

**Validation plan:** EXP-016 / EVAL-004

## Context

Read-only experiments cannot test whether an agent can complete useful relationship work. Unrestricted write access, however, collapses authentication, authorization, workflow scope, and risk into one unsafe permission.

## Decision

An experiment may read within the authenticated user's authority only as narrowed by its registered purpose, sources, subjects, and minimum-necessary context plan. Writes require an explicit, revocable, time-bounded WriteGrant. The grant names versioned registered workflow definitions and declares the system, object/record-set/field scope, non-delete operations, risk ceiling, purpose, start and expiry, volume/frequency/financial limits, approval mode, verification, human-readable receipts, and reversal or compensation behavior.

A grant cannot exceed its human principal, self-expand, self-renew, or imply credentials for a model. The action gateway independently enforces it. `delete` is not a permitted WriteGrant operation and uses ADR-0017.

CAP-001 and EXP-001 retain their existing read-only authority. Acceptance of this ADR is not evidence that a write gateway exists.

## Consequences

- EXP-015 may test many registered Zoho workflows without granting unrestricted Zoho access.
- Grants can last for a declared duration and authorize repeated eligible actions within explicit limits.
- Each execution is still policy-checked, idempotent where possible, verified, receipted, and auditable.
- Ambiguous identity, stale/revoked authority, scope drift, or failed verification stops execution.
