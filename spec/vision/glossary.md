# Glossary

This glossary is descriptive; normative object rules live in the [canonical specification](../canonical/NeoCRM-v0.1-Canonical-Specification.md) and domain model.

| Term | Meaning |
| --- | --- |
| Action | A durable or external effect represented through proposal, preview, policy, approval, execution, verification, audit, and compensation where applicable. |
| Actor | An accountable human, Agent, or service that performs work. |
| Adapter | A bounded integration component translating source capabilities and vocabulary to or from canonical semantics. |
| Agent / AgentDefinition | A runtime specialist identity / the versioned purpose, capabilities, tools, model configuration, limits, owner, and lifecycle from which it is created. |
| AgentRun / AgentStep | An auditable execution of an AgentDefinition toward a Goal / one bounded unit within that run. |
| Approval | An authorized decision over a specific action preview, version, scope, risk, and expiry. |
| Audience | A purpose- and time-specific, consent-constrained set of Parties. |
| AuthorityGrant / Delegation | A scoped, time-bounded grant defining data, actions, autonomy, budget, and escalation. |
| Campaign | A governed initiative directed at a consented Audience toward a Goal. |
| Canonical semantics | NeoCRM's vendor-independent meanings, invariants, relationships, temporal rules, and provenance contracts. |
| CollaborationSession | A bounded episode in which people and Agents share a Goal, Plan, context, work, and decisions. |
| Commitment | A promise or obligation with responsible Actor, beneficiary, time expectation, status, and evidence. |
| Consent / Preference | An attributable, purpose/channel-specific temporal permission or restriction / an attributable Party choice. |
| ContextRequest / ContextSnapshot | A request for minimum-necessary authorized evidence / the versioned evidence actually provided to a run. |
| Conversation | A coherent interaction episode grouping related Activities or Messages, potentially across channels. |
| CustomerNeed | A Party's evidenced problem, desired outcome, constraint, or job; it is not inferred into fact without evidence. |
| Epistemic category | Fact, Observation, Interpretation, Hypothesis, Unknown, or Conflict; independent of authority, freshness, confidence, and completeness. |
| EventEnvelope / AuditEvent | A versioned integration wrapper with identity, causation, classification, and payload reference / an immutable record of a material event. |
| Goal | A desired customer, relationship, service, commercial, ethical, or operational result with owner, measures, horizon, and constraints. |
| Handoff | A typed transfer of work with accepted scope, minimum context, evidence, authority, budget, and escalation rule. |
| Insight / Signal | A reviewable synthesis of evidence and reasoning / a detected change, pattern, threshold, or anomaly requiring interpretation. |
| Journey | Planned and observed relationship progression across stages, episodes, functions, and channels. |
| LearningSignal | Attributed performance or outcome evidence that may support a governed change proposal but cannot mutate production directly. |
| MemoryItem | Purpose-scoped, attributable, classified, temporal information admitted under explicit retention policy. |
| Outcome | An intended or observed result linked to Goals, work, Actions, Actors, Parties, evidence, measures, and unintended effects. |
| Party | A Person, Company, or Household participating in relationships. An AI Agent is not a Party by default. |
| Plan / PlanStep | A versioned approach to a Goal / a bounded dependency-aware unit assigned to Actors and policy gates. |
| Policy / PolicyDecision | A versioned control rule / its recorded permit, deny, require-approval, or escalate evaluation. |
| Recommendation | A decision-oriented suggestion grounded in evidence and reasoning; not an epistemic state and never execution. |
| Relationship Intelligence Layer | The intelligence plane spanning Agent, Relationship Orchestration, and Context/Data Access while preserving their boundaries. |
| Role | Contextual, temporal business meaning held by a Party, such as Customer, Prospect, Partner, or Contract Party. |
| ServiceCase | A service request, issue, incident, or need with owner, entitlement, SLA, work, resolution, and Outcome. |
| ToolGrant | The authorization for an Agent to use a declared capability under a Delegation; capability alone grants nothing. |
| Trigger / Intent | A request, event, schedule, signal, or outcome gap / its typed interpretation with ambiguity and constraints. |
| View | A task-specific projection over canonical semantics, never a separate source of domain truth. |
| WorkItem | A bounded unit of human or Agent work, distinct from a Commitment and from an Action effect. |
