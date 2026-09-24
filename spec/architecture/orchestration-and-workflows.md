# Relationship orchestration and workflows

**Status:** Proposed

Relationship Orchestration coordinates Goals, people, Agents, WorkItems, policies, and Outcomes. It is business logic, not prompt folklore.

## Standard lifecycle

```text
Trigger and principal
  -> Intent and Goal
  -> Plan, Delegation, budgets, and policy precheck
  -> identity resolution
  -> minimum-necessary ContextRequest and ContextSnapshot
  -> specialist work and typed Handoffs
  -> Recommendation, draft, or ActionProposal
  -> PolicyDecision
  -> Approval when required
  -> isolated execution
  -> verification, compensation if needed, and audit
  -> Outcome and LearningSignal
  -> governed evaluation/change process
```

## Workflow invariants

- Human, event, scheduled, and signal-driven triggers enter the same typed orchestration boundary.
- Identity is resolved before private relationship context is read.
- Plans declare dependencies, completion rules, failure paths, and budgets.
- Partial work remains explicit; absence is never inferred from a failed or denied source.
- Approval binds to the exact action preview/version and expires; it does not authorize plan drift.
- Action execution is idempotent where possible and must be verified against the target system.
- Compensation is a new governed Action, not an unaudited rollback shortcut.
- Outcome capture distinguishes intended, observed, customer, service, commercial, ethical, and unintended results.

Current CAP-001 stops before external execution and keeps every write disabled.
