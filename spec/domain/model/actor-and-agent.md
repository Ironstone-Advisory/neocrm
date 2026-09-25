# Actor and Agent

**OBJ-059 Actor** is the root abstraction for an identified human, Agent, or service that performs accountable work. Actor is not Party: a Person may be linked to a human Actor, while an AI Agent is not a relationship Party by default.

**AgentDefinition** versions purpose, owner, instructions, model/configuration, declared AgentCapabilities, allowed tools, data classifications, default limits, evaluation requirements, and lifecycle. **Agent** is its runtime identity. **AgentRun** is one auditable execution toward a Goal, composed of AgentSteps.

**AuthorityGrant/Delegation** identifies grantor and grantee, purpose, tenant, subjects/data, operations, autonomy level, effective/expiry time, budgets, conditions, escalation, revocation, and provenance. **OBJ-060 AgentCapability** is a declared ability. **OBJ-061 ToolGrant** narrows that ability to a permitted operation under a Delegation. Capability never implies permission.

A WriteGrant is an experimental, action-specific form of delegated authority for named, versioned, registered non-delete workflows. It is explicit, scoped, revocable, time-bounded, risk-limited, independently enforced, verified, and receipted. It cannot contain `delete`. DeletionAuthorization is a separate fresh exact human decision and is never self-issued or inferred.

Agents cannot grant themselves authority, approve their own consequential Actions, hold credentials/native execute handles, or silently change their own definitions from Outcomes.
