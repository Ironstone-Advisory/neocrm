# Executable contracts

Generated TypeScript projections of [`spec/contracts/capabilities/cap-001.schema.json`](../../spec/contracts/capabilities/cap-001.schema.json) and the bounded [`spec/contracts/agent-runtime.schema.json`](../../spec/contracts/agent-runtime.schema.json).

The CAP-001 schema is normative only for relationship-brief exchanges. The agent-runtime schema validates the thin EXP-001 reference path, including AgentDefinition, AuthorityGrant, Trigger, Goal, Plan/PlanStep, AgentRun, Handoff, PolicyDecision, ContextSnapshot, Outcome, LearningSignal, and AuditEvent. Neither schema is the complete NeoCRM ontology or full production Agent layer.

Run `pnpm generate:contracts` after changing the schema; do not hand-edit the generated TypeScript.
