# WF-MKT-007 — Assignment Exposure and Holdout Audit

[Workflow catalogue](../../README.md) / [Marketing workflows](../README.md)

**Status:** Proposed / NotStarted / Unassessed / P1

**For:** Marketer or growth leader

**Result mode:** read-only; none ([plain-language meaning](../../README.md#how-to-read-result-mode))

**Runtime boundary:** Definition scaffolding only; no workflow router, live write, send, schedule, or connection-registration runtime is claimed.

## Job

Help an authorized marketer or growth leader complete assignment exposure and holdout audit from relationship evidence while keeping source gaps, uncertainty and authority visible.

## Use when

- An authorized marketer or growth leader asks for assignment exposure and holdout audit.
- A relevant event or signal suggests that assignment exposure and holdout audit may be useful, subject to human review.

## Produces

- Assignment Exposure and Holdout Audit result
- Evidence, uncertainty and source-gap summary
- Recommended next decision

## Flow at a glance

Each step completes only when its typed result, supporting evidence and material gaps are recorded. The machine definition holds the detailed dependencies, branch conditions and completion criteria.

1. **Bind principal, purpose, Intent and Goal**
2. **Resolve identity and tenant scope**
3. **Retrieve minimum-necessary evidence**
4. **Assess evidence sufficiency and conflicts**
5. **Synthesize assignment exposure and holdout audit**
6. **Escalate insufficient or conflicting evidence**
7. **Review result and next decision**

## Sources and fallback

Capability intents: `source.analytics.read`, `source.consent.read`, `source.engagement.read`, `source.identity.read`.

Sources are selected by adapter capability intent and provide evidence; vendor products and schemas do not define NeoCRM canonical meaning. Fallback inputs reduce freshness, completeness, verification and automation; show those limits beside the result.

Zero-connector modes: pasted-text, uploaded-document, csv, user-owned-local-source, manual-entry.

## Authority and stops

Mode: **read-only**. Reads are principal-bound, purpose-bound and minimum necessary. A WriteGrant authorizes only registered, scoped, time-bounded non-destructive actions; it never authorizes deletion. Every deletion effect requires fresh exact human DeletionAuthorization bound to an immutable target list.

- Identity or tenant scope is ambiguous or conflicts with the request.
- A required source is denied or failed and the disclosed fallback is insufficient.
- Evidence is too incomplete, stale or conflicting for a safe recommendation.
- The requested material effect is outside authority, or any deletion lacks fresh exact human authorization.

## Evidence and status

The definition is mapped to planned experiments and evaluation plans; no workflow-specific runtime or outcome evidence is claimed.

Evaluation: **NotStarted**. A workflow-specific fixture, adversarial cases, human review and outcome evidence must be created and run before any demonstration claim.

Specification status, implementation status, evidence maturity and delivery horizon are independent. [See how to read the four axes](../../README.md#how-to-read-status).

## Example and fixture plan

Example request: “Help me with assignment exposure and holdout audit and show the evidence, gaps and decisions I need to make.”

Planned fixtures: `PLANNED-FIXTURE-WF-MKT-007`. They are placeholders, not executed evidence.

Planned evaluation checks:

- Routes only when the declared job, principal and source capability intents match.
- Discloses missing, denied, stale and conflicting evidence without treating missing as zero.
- Stops action execution without the required policy decision, authority, verification and receipt path.
- Returns a readable result that exposes evidence, counterevidence, unknowns, uncertainty, degradation and the next human decision.

Traceability: `FR-MKTEXP-001`, `SAFE-ATTRIB-001`, `EXP-020`.

## Related artifacts

- [Machine definition](workflow.json)
- [WorkflowDefinition schema](../../../spec/contracts/workflow-definition.schema.json)
- [Adapter capability catalogue](../../../adapters/_catalog/README.md)
- [FR-MKTEXP-001](../../../spec/requirements/approved-portfolio.md)
- [EXP-020](../../../experiments/EXP-020-marketing-treatment-journey-and-inbound/spec.md)

