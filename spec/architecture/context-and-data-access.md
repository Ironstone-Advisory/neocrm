# Context and data access

**Status:** Proposed; CAP-001 implements a bounded deterministic subset

The Context boundary converts a Goal and authorized principal into the minimum evidence necessary for the current PlanStep. It does not decide the Goal, action authority, or customer strategy.

## Pipeline

1. Accept a typed ContextRequest with purpose, principal, subject hints, domains, freshness, classification, and budget.
2. Resolve the subject to one safe identity or return safe disambiguation before private reads.
3. Select the minimum adapter capabilities required by the specific Intent/Goal—not a fixed all-source fan-out.
4. Apply authorization, consent, purpose, field/record allowlists, freshness, and source-cost limits.
5. Retrieve through bounded adapters; record unavailable/denied/failed state without disclosing protected record existence.
6. Normalize to canonical objects while retaining native references behind policy.
7. Reconcile without conflating authority, freshness, confidence, completeness, or epistemic category.
8. Assemble a versioned ContextSnapshot, evidence graph, timeline, conflicts, and Unknowns.

An experiment may begin with the authenticated user's existing source permissions, but that is only the outer authority boundary. Its protocol and ContextRequest still narrow actual retrieval to the necessary purpose, source, subject, field, classification, freshness, and budget. Possession of read authority is never a request to ingest everything.

## Trust rules

- Source bodies and Agent/model outputs are untrusted data, never policy or tool instructions.
- Authoritative does not mean confident, fresh, complete, or true for all time.
- A note is not Fact by location; its content is classified from evidence and applicable domain authority rules.
- Native credentials, execute handles, unrestricted paths, and hidden source bodies are excluded from model-safe context.
- Durable MemoryItems require purpose, provenance, classification, retention, and correction/deletion rules.

CAP-001 currently proves deterministic identity gating, declared adapter planning, normalization, reconciliation, provenance, partial failure, and structured response for synthetic fixtures. It does not prove production identity or live source security.
