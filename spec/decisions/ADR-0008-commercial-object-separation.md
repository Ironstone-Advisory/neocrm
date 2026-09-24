# ADR-0008: Separate offers from opportunities, deals, and contracts

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Planned

**Validation plan:** EXP-001 / EVAL-002

## Decision

What can be sold, potential business, a transaction, and an agreement are
different concepts. **OBJ-009 Offer**, **OBJ-010 Product**, **OBJ-011 Service**,
**OBJ-012 Opportunity**, **OBJ-013 Deal**, and **OBJ-014 Contract** are distinct
canonical objects linked through typed relationships.

## Consequences

- An adapter module named `Deals` does not automatically map to canonical Deal;
  its business meaning determines whether it is an Opportunity or Deal.
- The system can distinguish bought, considered, declined, transacted, and
  contractually committed commercial states.
- Commercial history and current pipeline can be compared without collapsing
  their lifecycles.
