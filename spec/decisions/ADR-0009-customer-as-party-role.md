# ADR-0009: Model Customer as a contextual Party role

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Planned

**Validation plan:** EXP-001 / EVAL-002

**Validation plan:** EXP-002 / EVAL-003

## Decision

Customer is a Role held by a Party in a defined business context and time
interval. It is not a Party subtype, contact category, account flag, or
assumption derived from source placement. People, Companies, and Households can
all hold Customer and other simultaneous roles.

## Consequences

- Customer queries traverse role, scope, validity, and provenance.
- A Contact or Account record is not automatically a customer.
- Customer lifecycle changes do not mutate Party identity.
