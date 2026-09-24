# ADR-0003: Separate Party types from business roles

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Demonstrated

**Validation plan:** EXP-002 / EVAL-003

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

Contact and account categories commonly mix what an entity is with how it
participates in a relationship. That prevents one entity from holding several
roles, produces contradictory lifecycle fields, and loses role scope and time.

## Decision

Party is the root participant abstraction. Person, Company, and Household are
first-class Party types. Customer, Prospect, Partner, Supplier, Employee,
Decision Maker, and Contract Party are contextual, scoped, and temporal roles.
Organizational structure and interpersonal or commercial relationships are
represented explicitly.

## Consequences

- Any Party can be a Customer.
- A Party can hold several roles simultaneously without changing type.
- Role assertions carry provenance, validity, and scope.
- Adapter mappings cannot infer Customer merely from a native module name.
