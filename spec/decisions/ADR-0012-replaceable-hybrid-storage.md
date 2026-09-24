# ADR-0012: Define replaceable hybrid storage responsibilities

**Decision status:** Accepted

**Implementation status:** Planned

**Evidence maturity:** Planned

**Validation plan:** EXP-003 / EVAL-003

**Validation plan:** EXP-004 / EVAL-003

## Context

Relationship intelligence needs transactional state, relationship traversal,
semantic retrieval, temporal analysis, and durable evidence. One physical store
may serve an early prototype, but a single storage technology must not become a
semantic invariant.

## Decision

LAYER-05 defines logical ports for operational state, graph traversal, semantic
retrieval, analytical/time-series projections, evidence and audit retention,
and governed memory. Implementations may use one store or several. Replicas,
indexes, embeddings, and materialized views are derived and rebuildable unless
an explicit ownership rule states otherwise. Every projection retains a path to
source evidence and canonical identity.

Specific products and database categories are reference options, not mandatory
architecture. Storage substitution is demonstrated by preserving canonical
answers and disclosed mapping differences across implementations.

## Consequences

- v0.1 can use simple reference stores while preserving future responsibilities.
- Consistency, freshness, retention, deletion, and recovery contracts must be
  explicit per port.
- Polyglot persistence is permitted but not required.
