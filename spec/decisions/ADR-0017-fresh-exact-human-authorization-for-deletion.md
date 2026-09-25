# ADR-0017: Require fresh exact human authorization for every deletion

**Decision status:** Accepted

**Implementation status:** Planned

**Evidence maturity:** Planned

**Validation plan:** EXP-015 / EVAL-004

**Validation plan:** EXP-016 / EVAL-004

## Context

Deletion is materially different from an update: it may destroy evidence, violate retention or legal-hold obligations, remove customer history, and be difficult or impossible to compensate. A timed general write grant is therefore insufficient.

## Decision

Every delete requires a fresh DeletionAuthorization issued by an authorized human for the exact immutable target list. The person must see the operation, system, object type, record identifier, version/etag where available, purpose, material consequences, and preview. Authorization expires, is single-use, and is invalid if any target changes.

Classification follows the material effect, not the API verb. A workflow cannot use update, transition, unlink, overwrite, redaction, retention, disposition, or another nominally non-delete operation to evade this rule. Destruction, purge, erasure, destructive field clearing, and any equivalent irreversible removal require DeletionAuthorization; reversible archive or suppression must remain visibly distinct from deletion.

An immutable, fully enumerated batch may be approved once as one authorization. Dynamic queries, later-selected records, wildcards, or “all matching” targets are prohibited. General approvals, workflow enrollment, earlier similar approvals, and WriteGrants never authorize deletion.

Policy must check retention, legal hold, consent, and authority immediately before execution. Execution, read-back or absence verification, and a human-readable receipt are mandatory. An uncertain result must be resolved before any retry; a retry is never inferred to be authorized by an expired or consumed decision.

## Consequences

- `delete` is structurally absent from WriteGrant operations.
- Automation may prepare a deletion preview, but it cannot approve it.
- Correction and retention workflows must distinguish deletion, archive, suppression, redaction, and source-system disposition.
