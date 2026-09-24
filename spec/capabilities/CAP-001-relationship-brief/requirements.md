# CAP-001 requirements

**Status:** Provisional

- **FR-RES-001** — Resolve exactly one Party or return safe disambiguation before reading private context.
- **FR-CAPCTX-001** — Create a source plan from relationship-brief intent, Party, declared capabilities, policy, and freshness constraints.
- **FR-CAPCTX-002** — Represent unavailable, denied, failed, and stale sources as bounded gaps, not absence; denial must not disclose protected record existence.
- **FR-PROV-001** — Every material Fact and Observation cites known evidence with source reference, retrieval time, and effective time when known.
- **FR-EPI-001** — Keep Facts, Observations, Hypotheses, Unknowns, Conflicts, and Recommendations structurally distinct while recognizing Recommendation as decision-oriented.
- **FR-MEM-001** — Keep correction/session context separate from durable memory and perform no durable memory write.
- **FR-ACT-002** — Recommendations and inert proposals cause no external write; every execute attempt fails closed.
- **NFR-CAPDET-001** — Run against versioned synthetic fixtures and a fixed clock with deterministic output.
- **SAFE-CAPCONTENT-001** — Treat source text as untrusted evidence and exclude credentials/native handles from model-safe context.

CAP-001 is a bounded deterministic context probe. It does not satisfy the full system Agent, orchestration, persistence, integration, learning, or experience requirements.
