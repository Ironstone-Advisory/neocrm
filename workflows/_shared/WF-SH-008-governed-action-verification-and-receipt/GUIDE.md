# WF-SH-008 — Governed Action Verification and Receipt

[Workflow catalogue](../../README.md) / [Shared controls](../README.md)

**Status:** Proposed / NotStarted / Unassessed / P1

**For:** Registered calling workflow

**Result mode:** internal-routine; governed-action-proposal ([plain-language meaning](../../README.md#how-to-read-result-mode))

**Runtime boundary:** Definition scaffolding only; no workflow router, live write, send, schedule, or connection-registration runtime is claimed.

## Job

Give registered workflows a reusable, policy-bound governed action verification and receipt routine without creating a second business-facing workflow.

## Use when

- A registered parent workflow requests the bounded governed action verification and receipt routine.

## Produces

- Governed Action Verification and Receipt result
- Evidence, uncertainty and source-gap summary
- Draft or governed action proposal; never silent execution

## Flow at a glance

Each step completes only when its typed result, supporting evidence and material gaps are recorded. The machine definition holds the detailed dependencies, branch conditions and completion criteria.

1. **Bind principal, purpose, Intent and Goal**
2. **Resolve identity and tenant scope**
3. **Retrieve minimum-necessary evidence**
4. **Assess evidence sufficiency and conflicts**
5. **Synthesize governed action verification and receipt**
6. **Form a non-destructive action proposal**
7. **Render exact targets, fields, effect and cost preview**
8. **Classify material effect and obtain policy decision**
9. **Verify human approval and scoped authority**
10. **Execute through isolated action gateway when implemented**
11. **Verify target state and detect partial or uncertain outcome**
12. **Issue human-readable action receipt**
13. **Capture outcome gap without self-expanding policy**
14. **Escalate insufficient or conflicting evidence**

## Sources and fallback

Capability intents: `source.data-quality.read`.

Sources are selected by adapter capability intent and provide evidence; vendor products and schemas do not define NeoCRM canonical meaning. Fallback inputs reduce freshness, completeness, verification and automation; show those limits beside the result.

Zero-connector modes: pasted-text, uploaded-document, csv, user-owned-local-source, manual-entry.

## Authority and stops

Mode: **internal-routine**. Reads are principal-bound, purpose-bound and minimum necessary. A WriteGrant authorizes only registered, scoped, time-bounded non-destructive actions; it never authorizes deletion. Every deletion effect requires fresh exact human DeletionAuthorization bound to an immutable target list.

- Identity or tenant scope is ambiguous or conflicts with the request.
- A required source is denied or failed and the disclosed fallback is insufficient.
- Evidence is too incomplete, stale or conflicting for a safe recommendation.
- The requested material effect is outside authority, or any deletion lacks fresh exact human authorization.

## Shared control guidance

- Classify the material effect before selecting authority; operation names cannot disguise deletion or destructive clearing.
- For any external effect, bind exact targets and preview, execute idempotently where possible, verify target state and issue a human-readable receipt.

Structural inspiration and licensing are recorded in the [Anthropic source note](../ANTHROPIC-SOURCE-NOTE.md).

## Evidence and status

The definition is mapped to planned experiments and evaluation plans; no workflow-specific runtime or outcome evidence is claimed.

Evaluation: **NotStarted**. A workflow-specific fixture, adversarial cases, human review and outcome evidence must be created and run before any demonstration claim.

Specification status, implementation status, evidence maturity and delivery horizon are independent. [See how to read the four axes](../../README.md#how-to-read-status).

## Example and fixture plan

Example request: “Call WF-SH-008 for governed action verification and receipt within the parent workflow's scope.”

Planned fixtures: `PLANNED-FIXTURE-WF-SH-008`. They are placeholders, not executed evidence.

Planned evaluation checks:

- Routes only when the declared job, principal and source capability intents match.
- Discloses missing, denied, stale and conflicting evidence without treating missing as zero.
- Stops action execution without the required policy decision, authority, verification and receipt path.
- Returns a readable result that exposes evidence, counterevidence, unknowns, uncertainty, degradation and the next human decision.

Traceability: `FR-ACT-001`, `FR-GRANT-001`, `FR-DELETE-001`, `SAFE-DELETE-001`, `EXP-015`, `EXP-016`.

## Related artifacts

- [Machine definition](workflow.json)
- [WorkflowDefinition schema](../../../spec/contracts/workflow-definition.schema.json)
- [Adapter capability catalogue](../../../adapters/_catalog/README.md)
- [FR-ACT-001](../../../spec/requirements/functional.md)
- [FR-GRANT-001](../../../spec/requirements/experimental-authority.md)
- [EXP-015](../../../experiments/EXP-015-multi-workflow-zoho-write/spec.md)
- [EXP-016](../../../experiments/EXP-016-governed-obsidian-artifact-write/spec.md)

