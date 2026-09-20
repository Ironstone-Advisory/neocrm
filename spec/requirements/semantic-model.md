# Canonical semantic model

**Status:** Provisional

The normative exchanged-data definition is
[`domain/schemas/neocrm.schema.json`](../domain/schemas/neocrm.schema.json).
This document supplies meaning and invariants.

- A **Party** is a Person, Company, or Household. Those are types.
- A **Role** is contextual and time-bounded. Customer, Prospect, Partner,
  Supplier, Employee, Decision Maker, and Contract Party are roles, not types.
- A **Relationship** links two or more Parties with type, direction, context,
  validity, and provenance.
- An **Assertion** states a claim, its epistemic state, confidence, evidence,
  and derivation. Fact, observation, hypothesis, unknown, conflict, and
  recommendation are not interchangeable.
- A **Context Plan** records why each adapter is or is not queried.
- A **Response Envelope** preserves the epistemic categories and evidence
  required to audit a relationship brief.
- An **Action Proposal** is inert until explicit approval. CAP-001 permits
  proposal/preview only and disables execution.
- An **Adapter Capability** declares readable domains, supported filters,
  freshness, authority, and whether writes exist. A declared write capability
  never overrides policy.

