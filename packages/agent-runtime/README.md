# Bounded agent runtime

`IMP-006 - Status: Implemented`

This package implements the single `RelationshipBriefAgent` reference path used by EXP-001. It validates AgentDefinition, AuthorityGrant, Trigger, Goal, Plan, PlanStep, AgentRun, Handoff, PolicyDecision, ContextSnapshot, Outcome, LearningSignal, and AuditEvent contracts.

It supports conversational and scheduled triggers through the same run contract. Policy is checked before identity or context retrieval, and the only permitted operation is `read`. Feedback is recorded as an immutable outcome/learning signal; it cannot mutate prompts, policy, mappings, configuration, or source data.

This is not a general multi-agent runtime and does not claim to implement the entire canonical agency model.
