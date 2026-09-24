# ADR-0010: Define RIL responsibilities across explicit layer boundaries

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Demonstrated

**Validation plan:** EXP-005 / EVAL-003

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

Treating the Relationship Intelligence Layer as one undifferentiated component hides agency, business orchestration, context access, persistence, policy, and integration responsibilities. Treating it only as retrieval erases the agent-native product intent.

## Decision

NeoCRM uses seven logical layers exactly once in its responsibility model:

1. **LAYER-01 — Presentation:** relationship workspaces, collaboration, conversation, insight, and other task views.
2. **LAYER-02 — Agent:** Agent identity/version, Delegation, Goals, Plans, Runs, budgets, collaboration, and Handoffs.
3. **LAYER-03 — Business Logic / Relationship Orchestration:** workflows, people/Agent coordination, policy gates, WorkItems, Action lifecycle, and Outcomes.
4. **LAYER-04 — Data Access / Context:** identity resolution, minimum-context planning, retrieval, normalization, reconciliation, and evidence assembly.
5. **LAYER-05 — Hybrid Data Storage:** replaceable operational, analytical, graph, semantic, memory, event, and audit persistence roles.
6. **LAYER-06 — Integration / Ecosystem:** bounded source, model, event, tool, and action gateways.
7. **LAYER-07 — Infrastructure / Resilience:** identity substrate, secrets, isolation, observability, scheduling, budgets, scaling, and recovery.

The RIL is the product-defining intelligence plane spanning LAYER-02 through LAYER-04. It is not a monolith: each layer exposes typed contracts and may be deployed together initially. Canonical Semantics and Governance / Control are cross-cutting planes across all seven layers.

Contract scopes are **CONTRACT-001 Agency**, **CONTRACT-002 Orchestration**, **CONTRACT-003 Context**, **CONTRACT-004 Semantic**, **CONTRACT-005 Governance**, **CONTRACT-006 Action**, **CONTRACT-007 Integration**, and **CONTRACT-008 Event and Outcome**.

## Consequences

- Runtime composition can begin in one process without erasing logical/trust boundaries.
- Conversation, events, schedules, and Signals enter the same orchestration path.
- Each contract can be tested without claiming the full architecture is implemented.
- The origin's logical responsibilities remain stable while technologies and deployments stay replaceable.
