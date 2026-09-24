# ADR-0003: Separate Party types from business roles

**Status:** Provisional

**Validation plan:** EXP-004 / EVAL-001

**Demonstration evidence:** EXP-006 / EVAL-001

## Decision

Party is the root participant abstraction. Person, Company, and Household are first-class Party types. Customer, Prospect, Partner, Supplier, Employee, Decision Maker, and Contract Party are context-dependent roles.

## Consequences

- Any Party can be a Customer.
- A Party can hold several roles simultaneously without contradictory type fields.
- Organizational structure and commercial relationships are represented explicitly rather than through contact-category shortcuts.
