# Specification authority

`spec/` is NeoCRM's authoritative design boundary. Code, prototypes, experiments, and research may implement or test it; they do not silently redefine the product.

## Precedence

Conflicts are resolved in this order:

1. The cleaned [origin](vision/origin.md) governs product purpose, human-agent operating model, seven logical layers, cross-functional scope, proactive work, experience philosophy, and outcome learning.
2. The [canonical specification](canonical/NeoCRM-v0.1-Canonical-Specification.md) reconciles that origin with the later semantic, temporal, provenance, adapter, governance, safety, CTS, and traceability design.
3. Safety, privacy, consent, identity, delegation, and governance requirements constrain how the vision is realized; they do not remove its agentic foundation.
4. Accepted ADRs define the adopted design baseline. Decision status is independent of implementation status and evidence maturity. The [forty-eight-decision register](product/decision-register.md) records the approved 2026-09-24 portfolio direction; ADR-0016 through ADR-0019 make its authority, deletion, semantic-portfolio, and product-value rules architectural.
5. System requirements and canonical object definitions govern product behavior and meaning.
6. Capability specifications and their exchange schemas govern only their declared slice. The current JSON Schema is normative for CAP-001 exchanges, not for the complete NeoCRM ontology.
7. Implementation, experiments, evaluations, and results supply scoped evidence and cannot broaden their own claims.

The four axioms, Party/Role/Relationship distinctions, source authority, consent, action boundaries, and other canonical invariants cannot be overridden by a narrower capability schema or fixture.

## Status dimensions

Traceability keeps three questions separate:

- **Decision status:** Draft, Proposed, Accepted, Superseded, or Rejected.
- **Implementation status:** NotStarted, Planned, Partial, Implemented, Verified, Retired, or NotApplicable.
- **Evidence maturity:** Unassessed, Planned, Demonstrated, Validated, Inconclusive, or Rejected.

An ADR may be Accepted while implementation is Partial and evidence is Demonstrated. “Accepted” means the decision is adopted, not empirically proven. Human evaluation state belongs to the scoped evaluation/result record rather than being overloaded into decision status.

## Contract authority

New portfolio objects, views, requirements, and experiment specifications are Accepted or Planned design as declared. They remain `Planned` in implementation and evidence unless a traceable implementation and result says otherwise.

Normative data exchanged by a capability uses its versioned JSON Schema. Generated TypeScript is a checked projection for developer ergonomics. If a projection disagrees with its declared schema, regenerate or correct the projection. Neither one may be described as the complete product ontology unless the canonical specification explicitly grants that scope.

## Required trace

Traceability links product goals, business capabilities, architecture responsibilities, canonical objects, views, requirements, decisions, experiments, evaluations, implementations, and results. Evidence links must be typed and scoped. Ordering edges such as `precedes` never count as validation.

Changes to product purpose, semantics, safety, externally visible contracts, or evidence claims require the affected ADR/requirement and traceability records to change together.
