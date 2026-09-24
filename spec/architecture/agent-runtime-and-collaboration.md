# Agent runtime and collaboration

**Status:** Proposed; not implemented by the current reference slice

## Runtime contract

An Agent is an accountable computational Actor instantiated from a versioned AgentDefinition. Every AgentRun must bind:

- an initiating Trigger, principal, purpose, Goal, and accountable owner;
- an AgentDefinition/model/prompt/tool version;
- Delegation, ToolGrants, autonomy level, data scope, and expiry;
- loop, time, model/token, tool, and financial budgets;
- a versioned Plan and AgentSteps;
- ContextRequests and immutable ContextSnapshots;
- Handoffs, PolicyDecisions, Approvals, proposed Actions, Outcomes, and audit events; and
- an explicit final state: completed, partial, escalated, denied, failed, cancelled, or expired.

An AgentRun cannot hold source credentials, broaden its own authority, approve its own consequential action, or execute a tool except through the isolated gateway and applicable PolicyDecision.

## Collaboration pattern

- A **Relationship Coordinator Agent** owns Goal framing, Plan coherence, and escalation—not unrestricted authority.
- **Context/Research**, **Sales**, **Service**, and **Engagement Agents** contribute bounded specialist work.
- A **Policy/Compliance Agent or service** may explain controls but the independent policy engine records the binding decision.
- An **Evaluator Agent** scores artifacts and outcomes but cannot deploy its proposed changes.
- Humans own relationship accountability, sensitive judgment, approvals, overrides, and redress.

Handoffs are typed: scope, acceptance, necessary context, evidence, open questions, authority, budget, expected output, deadline, and escalation. Free-form agent messages may accompany this contract but cannot replace it.

## Isolation rules

Agent outputs and retrieved content are untrusted data until validated. One Agent cannot grant another permissions; source text cannot rewrite a Plan or policy; hidden reasoning is neither logged nor treated as evidence; and shared context is minimized per WorkItem.
