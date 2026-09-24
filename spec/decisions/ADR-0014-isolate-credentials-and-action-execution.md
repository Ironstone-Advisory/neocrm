# ADR-0014: Isolate credentials and action execution from models and agents

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Demonstrated

**Validation plan:** EXP-001 / EVAL-002

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

Source text, model output, and agent plans are untrusted. Giving any of them
credentials or a direct execution handle lets prompt injection or reasoning
errors cross the policy boundary.

## Decision

Credentials remain in integration gateways or infrastructure secret services
and are never placed in prompts, model-visible context, logs, or agent memory.
Models and agents produce typed requests and ActionProposals only. Independent
identity, policy, approval, and action services validate scope and execute with
least-privilege grants. Tool results return as untrusted evidence. Source
instructions cannot alter policy, authority, or tool selection.

All writes fail closed, are idempotent where feasible, and record preview,
authorization, execution, verification, and audit references. CAP-001 exposes
no executable write handle.

## Consequences

- A model or agent compromise does not itself confer source credentials.
- Integration code must distinguish read, draft, propose, and execute grants.
- Denials and failures are observable without leaking secrets or protected
  record existence.
