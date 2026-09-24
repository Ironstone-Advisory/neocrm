# System functional requirements

**Status:** Proposed

These requirements define NeoCRM as a product. [CAP-001 requirements](../capabilities/CAP-001-relationship-brief/requirements.md) define the narrower current implementation.

The Accepted portfolio extensions are defined separately in [experimental authority](experimental-authority.md), [approved portfolio](approved-portfolio.md), and [product value](product-value.md). Their Accepted specification status does not imply implementation or evidence.

## P0 architecture and operating model

- **FR-AGT-001** — NeoCRM MUST represent AgentDefinition, Agent, AgentRun, AgentStep, AgentCapability, ToolGrant, and version information separately from Party.
- **FR-AUTH-001** — Every AgentRun MUST bind an accountable owner, principal, purpose, Delegation, autonomy level, data/action scope, expiry, and budgets.
- **FR-GOAL-001** — Relationship work MUST be framed by a Goal with beneficiaries, measures, horizon, constraints, and linked intended Outcomes.
- **FR-PLAN-001** — Agent/human work MUST use versioned Plans/PlanSteps and WorkItems with owners, dependencies, policy gates, budgets, completion, and escalation.
- **FR-HANDOFF-001** — Agent-Agent and Agent-human handoffs MUST be typed and carry accepted scope, minimum context, evidence, authority, budget, output, and escalation.
- **FR-TRIGGER-001** — Human, event, schedule, Signal, and outcome-gap triggers MUST enter one typed boundary and MUST NOT imply action authority.
- **FR-CTX-001** — Context access MUST resolve identity first, derive minimum-necessary evidence from Intent/Goal/PlanStep, and return a versioned ContextSnapshot with gaps and provenance.
- **FR-POL-001** — Retrieval, memory, handoff, recommendation, approval, Action, and learning changes MUST produce applicable independent PolicyDecisions.
- **FR-CONSENT-001** — Consent and Preference MUST be represented, attributed, temporal, purpose/channel specific, and evaluated at use.
- **FR-ACT-001** — A consequential Action MUST follow propose, preview, policy, approval when required, execute, verify, audit, Outcome, and compensation where applicable.
- **FR-OUT-001** — NeoCRM MUST distinguish intended and observed customer, relationship, service, commercial, ethical, operational, cost, and unintended Outcomes.
- **FR-LEARN-001** — Outcome learning MUST create attributed LearningSignals and governed change proposals; it MUST NOT silently change facts, policy, authority, Agents, prompts, models, mappings, or workflows.

## P1 unified relationship operations

- **FR-PERSPECTIVE-001** — Sales, service, and engagement views MUST use shared Party, Relationship, Goal, Activity, Time, Work, Policy, Consent, and Outcome semantics.
- **FR-JOURNEY-001** — Journey MUST represent planned and observed cross-functional progression without becoming a permanent Party status.
- **FR-SERVICE-001** — ServiceCase MUST support request/issue, entitlement, SLA, work, commitment, resolution, and customer Outcome.
- **FR-CAMPAIGN-001** — Campaign/Audience MUST enforce purpose, consent, suppression, current relationship/service state, and customer-harm constraints.
- **FR-INSIGHT-001** — Signal and Insight MUST expose method/version, evidence, missingness, expiry, uncertainty, and disposition.
- **FR-VIEW-001** — Presentation views MUST be projections over canonical semantics and MUST NOT create competing ontologies.

## Current implementation boundary

The current CAP-001 and EXP-001 reference slice MUST keep all external writes and durable memory disabled. Later registered experiments may use the authority model in FR-GRANT-001; that never broadens this slice. None of the P1 or portfolio requirements is claimed as implemented merely because it is specified.
