# Hybrid persistence

**Status:** Proposed logical architecture

NeoCRM requires replaceable persistence responsibilities, not a mandatory technology stack.

| Logical role | Responsibility | Possible implementation, not a mandate |
| --- | --- | --- |
| Operational state | Goals, Plans, WorkItems, current workflow and action state. | Relational/document store or source-owned records. |
| Relationship graph | Multi-hop Parties, roles, relationships, activities, work, and outcomes. | Graph engine, relational graph projection, or federated query. |
| Analytical history | Time series, portfolio measures, evaluations, costs, and trends. | Columnar/warehouse or append-only analytical projection. |
| Semantic retrieval | Permissioned similarity/search over approved content and metadata. | Vector index, full-text search, or external knowledge service. |
| Scoped memory | Explicitly admitted, attributable, temporal MemoryItems. | Encrypted store or source-owned knowledge. |
| Event state | Durable events, subscriptions, idempotency, causation, and replay boundaries. | Event log, queue, outbox, or transactional table. |
| Audit/evidence | Immutable policy, approval, action, verification, provenance, and evaluation records. | Append-only protected store. |

## Ports and policy

Each role is accessed through a versioned port with tenancy, classification, retention, deletion, export, provenance, consistency, and failure semantics. A single product may implement several ports. A source system may remain authoritative. Materialization requires an explicit purpose and lifecycle; read access is not permission to copy indefinitely.

GraphQL, REST, SQL, graph query languages, embeddings, PostgreSQL, vector databases, and columnar systems are deployment choices. Swapping them must not alter canonical meaning, governance, or user intent.
