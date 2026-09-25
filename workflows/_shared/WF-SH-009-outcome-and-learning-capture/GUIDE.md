# WF-SH-009 — Outcome and Learning Capture

[Workflow catalogue](../../README.md) / [Shared controls](../README.md)

**Status:** Proposed / NotStarted / Unassessed / P2

**For:** Registered calling workflow

**Result mode:** internal-routine; none ([plain-language meaning](../../README.md#how-to-read-result-mode))

**Runtime boundary:** Definition scaffolding only; no workflow router, live write, send, schedule, or connection-registration runtime is claimed.

## Job

Give registered workflows a reusable, policy-bound outcome and learning capture routine without creating a second business-facing workflow.

## Use when

- A registered parent workflow requests the bounded outcome and learning capture routine.

## Produces

- Outcome and Learning Capture result
- Evidence, uncertainty and source-gap summary
- Recommended next decision

## Flow at a glance

Each step completes only when its typed result, supporting evidence and material gaps are recorded. The machine definition holds the detailed dependencies, branch conditions and completion criteria.

1. **Bind principal, purpose, Intent and Goal**
2. **Resolve identity and tenant scope**
3. **Retrieve minimum-necessary evidence**
4. **Assess evidence sufficiency and conflicts**
5. **Synthesize outcome and learning capture**
6. **Escalate insufficient or conflicting evidence**
7. **Review result and next decision**

## Sources and fallback

Capability intents: `source.analytics.read`.

Sources are selected by adapter capability intent and provide evidence; vendor products and schemas do not define NeoCRM canonical meaning. Fallback inputs reduce freshness, completeness, verification and automation; show those limits beside the result.

Zero-connector modes: pasted-text, uploaded-document, csv, user-owned-local-source, manual-entry.

## Authority and stops

Mode: **internal-routine**. Reads are principal-bound, purpose-bound and minimum necessary. A WriteGrant authorizes only registered, scoped, time-bounded non-destructive actions; it never authorizes deletion. Every deletion effect requires fresh exact human DeletionAuthorization bound to an immutable target list.

- Identity or tenant scope is ambiguous or conflicts with the request.
- A required source is denied or failed and the disclosed fallback is insufficient.
- Evidence is too incomplete, stale or conflicting for a safe recommendation.
- The requested material effect is outside authority, or any deletion lacks fresh exact human authorization.

## Shared control guidance

- Capture intended, observed, customer, service, commercial, ethical and unintended outcomes without allowing learning to expand policy or authority automatically.

Structural inspiration and licensing are recorded in the [Anthropic source note](../ANTHROPIC-SOURCE-NOTE.md).

## Evidence and status

The definition is mapped to planned experiments and evaluation plans; no workflow-specific runtime or outcome evidence is claimed.

Evaluation: **NotStarted**. A workflow-specific fixture, adversarial cases, human review and outcome evidence must be created and run before any demonstration claim.

Specification status, implementation status, evidence maturity and delivery horizon are independent. [See how to read the four axes](../../README.md#how-to-read-status).

## Example and fixture plan

Example request: “Call WF-SH-009 for outcome and learning capture within the parent workflow's scope.”

Planned fixtures: `PLANNED-FIXTURE-WF-SH-009`. They are placeholders, not executed evidence.

Planned evaluation checks:

- Routes only when the declared job, principal and source capability intents match.
- Discloses missing, denied, stale and conflicting evidence without treating missing as zero.
- Stops action execution without the required policy decision, authority, verification and receipt path.
- Returns a readable result that exposes evidence, counterevidence, unknowns, uncertainty, degradation and the next human decision.

Traceability: `FR-OUT-001`, `FR-LEARN-001`, `FR-AGENTVALUE-001`, `EXP-018`, `EXP-019`, `EXP-020`, `EXP-021`, `EXP-022`, `EXP-023`, `EXP-024`, `EXP-025`.

## Related artifacts

- [Machine definition](workflow.json)
- [WorkflowDefinition schema](../../../spec/contracts/workflow-definition.schema.json)
- [Adapter capability catalogue](../../../adapters/_catalog/README.md)
- [FR-OUT-001](../../../spec/requirements/functional.md)
- [FR-AGENTVALUE-001](../../../spec/requirements/approved-portfolio.md)
- [EXP-018](../../../experiments/EXP-018-qualification-metrics-and-forecast/spec.md)
- [EXP-019](../../../experiments/EXP-019-sales-playbooks-buying-groups-and-account-plans/spec.md)
- [EXP-020](../../../experiments/EXP-020-marketing-treatment-journey-and-inbound/spec.md)
- [EXP-021](../../../experiments/EXP-021-customer-success-and-service-guard/spec.md)
- [EXP-022](../../../experiments/EXP-022-content-and-brand-intelligence/spec.md)
- [EXP-023](../../../experiments/EXP-023-education-and-enablement/spec.md)
- [EXP-024](../../../experiments/EXP-024-bounded-supervisor-agent/spec.md)
- [EXP-025](../../../experiments/EXP-025-packaging-metering-and-outcome-pricing/spec.md)

