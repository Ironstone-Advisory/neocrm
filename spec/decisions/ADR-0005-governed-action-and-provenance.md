# ADR-0005: Governed action and provenance

**Status:** Provisional

**Validation plan:** EXP-005 / EVAL-001

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

An assistant can combine sourced material with inference and can reach external
systems. Without explicit epistemic and action boundaries, a fluent response
can conceal uncertainty or cause an unauthorized change.

## Decision

NeoCRM retains provenance and epistemic state for every material assertion.
Consequential actions follow propose, preview, approve, execute, verify, and
audit. Policy is enforced below the conversational model. CAP-001 disables
execution entirely.

Structured operational logs record stages and outcomes but never hidden
chain-of-thought or raw source bodies.

## Consequences

- Inference cannot be presented as a source fact.
- User approval is necessary but not sufficient; policy also authorizes.
- Adapter write capability does not grant permission to the assistant.
- Failed or denied sources are represented as explicit unknowns.
