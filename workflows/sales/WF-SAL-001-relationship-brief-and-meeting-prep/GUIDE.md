# WF-SAL-001 — Relationship Brief and Meeting Prep

[Workflow catalogue](../../README.md) / [Sales workflows](../README.md)

**Status:** Accepted / NotStarted / Unassessed / P1

**For:** Seller or revenue leader

**Result mode:** read-only; none ([plain-language meaning](../../README.md#how-to-read-result-mode))

**Runtime boundary:** Definition scaffolding only; no workflow router, live write, send, schedule, or connection-registration runtime is claimed.

## Job

Help an authorized seller or revenue leader complete relationship brief and meeting prep from relationship evidence while keeping source gaps, uncertainty and authority visible.

## Use when

- An authorized seller or revenue leader asks for relationship brief and meeting prep.
- A relevant event or signal suggests that relationship brief and meeting prep may be useful, subject to human review.

## Produces

- Relationship Brief and Meeting Prep result
- Evidence, uncertainty and source-gap summary
- Recommended next decision

## Flow at a glance

Each step completes only when its typed result, supporting evidence and material gaps are recorded. The machine definition holds the detailed dependencies, branch conditions and completion criteria.

1. **Bind principal, purpose, Intent and Goal**
2. **Resolve identity and tenant scope**
3. **Retrieve minimum-necessary evidence**
4. **Assess evidence sufficiency and conflicts**
5. **Synthesize relationship brief and meeting prep**
6. **Escalate insufficient or conflicting evidence**
7. **Review result and next decision**

## Sources and fallback

Capability intents: `source.activity.read`, `source.commercial.read`, `source.identity.read`, `source.knowledge.read`, `source.relationship.read`, `source.time.read`.

Sources are selected by adapter capability intent and provide evidence; vendor products and schemas do not define NeoCRM canonical meaning. Fallback inputs reduce freshness, completeness, verification and automation; show those limits beside the result.

Zero-connector modes: pasted-text, uploaded-document, csv, user-owned-local-source, manual-entry.

## Authority and stops

Mode: **read-only**. Reads are principal-bound, purpose-bound and minimum necessary. A WriteGrant authorizes only registered, scoped, time-bounded non-destructive actions; it never authorizes deletion. Every deletion effect requires fresh exact human DeletionAuthorization bound to an immutable target list.

- Identity or tenant scope is ambiguous or conflicts with the request.
- A required source is denied or failed and the disclosed fallback is insufficient.
- Evidence is too incomplete, stale or conflicting for a safe recommendation.
- The requested material effect is outside authority, or any deletion lacks fresh exact human authorization.

## Evidence and status

CAP-001 and EXP-001 demonstrate a related bounded read-only relationship-brief dependency, not this WorkflowDefinition wrapper, its routing, or its meeting-prep breadth.

Evaluation: **NotStarted**. A wrapper-level fixture must prove routing into CAP-001 and the complete meeting-prep contract before this workflow can claim implementation or demonstrated evidence.

Specification status, implementation status, evidence maturity and delivery horizon are independent. [See how to read the four axes](../../README.md#how-to-read-status).

## Example and fixture plan

Example request: “Help me with relationship brief and meeting prep and show the evidence, gaps and decisions I need to make.”

Planned fixtures: `PLANNED-FIXTURE-WF-SAL-001`. They are placeholders, not executed evidence.

Planned evaluation checks:

- Routes only when the declared job, principal and source capability intents match.
- Discloses missing, denied, stale and conflicting evidence without treating missing as zero.
- Stops action execution without the required policy decision, authority, verification and receipt path.
- Returns a readable result that exposes evidence, counterevidence, unknowns, uncertainty, degradation and the next human decision.

Traceability: `CAP-001`, `FR-CTX-001`, `EXP-001`.

## Related artifacts

- [Machine definition](workflow.json)
- [WorkflowDefinition schema](../../../spec/contracts/workflow-definition.schema.json)
- [Adapter capability catalogue](../../../adapters/_catalog/README.md)
- [CAP-001](../../../spec/capabilities/CAP-001-relationship-brief/spec.md)
- [FR-CTX-001](../../../spec/requirements/functional.md)
- [EXP-001](../../../experiments/EXP-001-zoho-obsidian-relationship-brief/spec.md)

