# Seven-layer architecture

**Status:** Proposed architecture baseline

The seven logical layers below are normative responsibilities. They do not require seven services or any named vendor technology. Canonical Semantics and Governance / Control are cross-cutting planes.

| Layer | Responsibility | Principal contracts |
| --- | --- | --- |
| 1. Presentation | Relationship workspaces, collaboration, conversation, insight, graph, timeline, calendar, work, approvals, outcome, and administration views. | ViewModel, user intent, correction, approval, feedback. |
| 2. Agent | Versioned specialist Agents that frame Goals, create Plans, reason, collaborate, and produce recommendations/drafts/proposals under Delegation. | AgentDefinition, AgentRun, Goal, Plan, Handoff, ToolGrant. |
| 3. Business Logic / Relationship Orchestration | Coordinate Agents and humans; manage workflows, WorkItems, policy gates, approvals, actions, exceptions, and outcome capture. | Trigger, Intent, PolicyDecision, WorkItem, Approval, Action, Outcome. |
| 4. Data Access / Context | Resolve identity; plan minimum context; retrieve, normalize, reconcile, and assemble evidence graphs, timelines, and ContextSnapshots. | ContextRequest, ContextPlan, Evidence, Assertion, ContextSnapshot. |
| 5. Hybrid Data Storage | Supply replaceable operational, analytical, graph, semantic, memory, event, and audit persistence roles with lifecycle controls. | Repository/query ports, materialization policy, retention, versioning. |
| 6. Integration / Ecosystem | Connect source systems, event producers, model providers, and isolated action tools while preserving capability and ownership boundaries. | Adapter capabilities, mappings, EventEnvelope, tool/action gateway. |
| 7. Infrastructure / Resilience | Provide identity substrate, secrets, isolation, observability, budgets, scaling, availability, backup, recovery, and deployment controls. | Runtime policy, telemetry, health, budget, recovery objective. |

**PLANE-01 — Canonical Semantics** defines shared meaning, provenance, temporal and epistemic contracts across all layers. **PLANE-02 — Governance / Control** applies identity, delegation, purpose, consent, authorization, autonomy, approval, audit, evaluation, retention, and redress across all layers. The planes constrain every layer; neither is owned by Hybrid Data Storage, Relationship Orchestration, or any other single layer.

The Relationship Intelligence Layer spans Layers 2-4 as a product-defining plane. It is not a single component: Agent Runtime, Relationship Orchestration, and Context/Data Access have separate interfaces, tests, trust boundaries, and scaling concerns.

See [the layered diagram](diagrams/layered-architecture.mmd) and the documents that elaborate each responsibility.
