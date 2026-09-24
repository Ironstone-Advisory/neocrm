# ADR-0005: Govern material claims and consequential action

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Demonstrated

**Validation plan:** EXP-007 / EVAL-003

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

An agent can combine sourced material with inference and can propose changes in
external systems. Without explicit epistemic and action boundaries, fluent
language can conceal uncertainty or cause an unauthorized change.

## Decision

Every material assertion retains provenance, effective and retrieval time when
known, source authority, epistemic state, and derivation metadata. Fact,
Observation, Interpretation, Hypothesis, Unknown, and Conflict describe
knowledge state; Recommendation is a decision-oriented output and is not an
epistemic state. Source authority and confidence are separate dimensions.

Consequential action follows propose, preview, policy decision, approval where
required, execute, verify, and audit. Denial is fail-closed. User approval is
necessary where policy requires it but never overrides policy. CAP-001 disables
execution entirely.

The governance/action object set includes **OBJ-041 Policy**,
**OBJ-042 PolicyDecision**, **OBJ-043 ApprovalRequest**,
**OBJ-044 ApprovalDecision**, **OBJ-045 ActionProposal**,
**OBJ-046 ActionPreview**, **OBJ-047 ActionExecution**,
**OBJ-048 ActionVerification**, **OBJ-049 Compensation**, and
**OBJ-050 AuditEvent**.

Structured operational logs record lifecycle stages and outcomes but never
hidden chain-of-thought, credentials, or raw private source bodies.

## Consequences

- Inference cannot be presented as a sourced fact.
- Missing, denied, failed, or stale context remains explicit without disclosing
  a protected record's existence.
- Adapter write capability does not grant authority to an agent.
- Every permitted action is attributable, replay-safe where feasible, and
  verifiable.
