# Canonical semantic requirements

**Status:** Proposed

The [canonical specification](../canonical/NeoCRM-v0.1-Canonical-Specification.md) defines NeoCRM meaning. The current [CAP-001 exchange schema](../contracts/capabilities/cap-001.schema.json) is normative only for that capability's request, evidence, context-plan, and response envelopes.

## Invariants

- Party is Person, Company, or Household; Agent is an Actor and is not a Party by default.
- Roles are contextual and temporal. Customer is a Role any Party may hold.
- Relationships express typed, contextual, temporal, evidenced connections.
- Offer/Product/Service are distinct from Opportunity/Deal/Contract.
- Activity, Message, and Conversation are distinct; channels are implementations.
- Time is a domain; Calendar is a view.
- Fact, Observation, Interpretation, Hypothesis, Unknown, and Conflict are epistemic/response categories. Recommendation is a decision object.
- Source authority, freshness, confidence, completeness, and epistemic category are independent.
- Actor, AgentDefinition, Agent, AuthorityGrant/Delegation, AgentCapability/ToolGrant, Trigger, Intent, Goal, Plan/PlanStep, WorkItem, AgentRun/AgentStep, Handoff, CollaborationSession, ContextRequest/Snapshot, MemoryItem, Policy/PolicyDecision, Approval, Action, Outcome, LearningSignal, EvaluationRun, AuditEvent/EventEnvelope, Consent, and Preference are first-class.
- Journey, ServiceCase, Campaign, Audience, Insight, Signal, and CustomerNeed are P1 canonical extensions over shared semantics, not new silos.
- View-specific models are projections and cannot silently redefine canonical meaning.

Every material object carries stable/versioned identity, temporal validity, provenance, classification, lifecycle, and links as applicable. Physical persistence and source-native vocabularies remain replaceable.
