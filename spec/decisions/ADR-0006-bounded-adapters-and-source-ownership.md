# ADR-0006: Use bounded adapters and explicit source ownership

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Demonstrated

**Validation plan:** EXP-004 / EVAL-003

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

Naive full synchronization creates duplicate authority, hides conflicts, and
expands access beyond the task. Different sources own different facts and offer
different read, query, event, and write capabilities.

## Decision

Adapters declare bounded capabilities, identity and authorization requirements,
freshness, source authority, and supported operations. Context planning selects
the minimum adapters and fields needed for the current goal. Identity is
resolved before private reads. Native records are normalized with provenance;
conflicts are surfaced rather than resolved by last-write-wins. Writes, when
introduced, route only to an authoritative source under ADR-0005 and ADR-0014.

The integration contract includes **OBJ-054 AdapterCapability**,
**OBJ-055 AdapterRequest**, **OBJ-056 AdapterResult**, and
**OBJ-057 NativeClaim**.

## Consequences

- Partial capability and mapping loss are explicit.
- Adapter substitution is testable against shared contracts.
- Retrieval and write authority remain separate.
- A denied source is represented as unavailable without revealing protected
  record existence.
