# ADR-0002: Canonical semantics over storage schemas

**Status:** Provisional

**Validation:** EXP-004 / EVAL-001

## Decision

NeoCRM owns a canonical semantic model independent of its initial sources of persistence. Adapters map native structures to and from this model while retaining source identifiers and provenance.

## Consequences

- Zoho, spreadsheets, Markdown repositories, and future stores remain replaceable.
- The model must tolerate partial capability and imperfect mapping.
- Source-specific information that has no canonical equivalent must remain visible rather than being silently discarded.
