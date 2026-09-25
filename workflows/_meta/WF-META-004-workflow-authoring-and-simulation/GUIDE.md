# WF-META-004 — Workflow Authoring and Simulation

[Workflow catalogue](../../README.md) / [Meta workflows](../README.md)

**Status:** Proposed / NotStarted / Unassessed / P2

**For:** Workspace operator

**Result mode:** read-and-propose; draft-only ([plain-language meaning](../../README.md#how-to-read-result-mode))

**Runtime boundary:** Definition scaffolding only; no workflow router, live write, send, schedule, or connection-registration runtime is claimed.

## Job

Help an authorized workspace operator complete workflow authoring and simulation from relationship evidence while keeping source gaps, uncertainty and authority visible.

## Use when

- An authorized workspace operator asks for workflow authoring and simulation.
- A relevant event or signal suggests that workflow authoring and simulation may be useful, subject to human review.

## Produces

- Workflow Authoring and Simulation result
- Evidence, uncertainty and source-gap summary
- Draft or governed action proposal; never silent execution

## Flow at a glance

Each step completes only when its typed result, supporting evidence and material gaps are recorded. The machine definition holds the detailed dependencies, branch conditions and completion criteria.

1. **Bind principal, purpose, Intent and Goal**
2. **Confirm workspace and request scope without customer-record retrieval**
3. **Use only local workflow metadata and user-provided context**
4. **Assess declared-context sufficiency and ambiguity**
5. **Synthesize workflow authoring and simulation**
6. **Escalate insufficient or conflicting evidence**
7. **Review result and next decision**

## Sources and fallback

Capability intents: none. This workflow uses the authenticated request, local workflow metadata, and user-provided context without retrieving customer records.

Sources are selected by adapter capability intent and provide evidence; vendor products and schemas do not define NeoCRM canonical meaning. Fallback inputs reduce freshness, completeness, verification and automation; show those limits beside the result.

Zero-connector modes: pasted-text, uploaded-document, csv, user-owned-local-source, manual-entry.

## Authority and stops

Mode: **read-and-propose**. Reads are principal-bound, purpose-bound and minimum necessary. A WriteGrant authorizes only registered, scoped, time-bounded non-destructive actions; it never authorizes deletion. Every deletion effect requires fresh exact human DeletionAuthorization bound to an immutable target list.

- Identity or tenant scope is ambiguous or conflicts with the request.
- A required source is denied or failed and the disclosed fallback is insufficient.
- Evidence is too incomplete, stale or conflicting for a safe recommendation.
- The requested material effect is outside authority, or any deletion lacks fresh exact human authorization.

## Evidence and status

The definition is mapped to planned experiments and evaluation plans; no workflow-specific runtime or outcome evidence is claimed.

Evaluation: **NotStarted**. A workflow-specific fixture, adversarial cases, human review and outcome evidence must be created and run before any demonstration claim.

Specification status, implementation status, evidence maturity and delivery horizon are independent. [See how to read the four axes](../../README.md#how-to-read-status).

## Example and fixture plan

Example request: “Help me with workflow authoring and simulation and show the evidence, gaps and decisions I need to make.”

Planned fixtures: `PLANNED-FIXTURE-WF-META-004`. They are placeholders, not executed evidence.

Planned evaluation checks:

- Routes only when the declared job, principal and source capability intents match.
- Discloses missing, denied, stale and conflicting evidence without treating missing as zero.
- Stops action execution without the required policy decision, authority, verification and receipt path.
- Returns a readable result that exposes evidence, counterevidence, unknowns, uncertainty, degradation and the next human decision.

Traceability: `FR-PLAN-001`, `FR-LEARN-001`, `EXP-023`, `EXP-024`, `D04`.

## Related artifacts

- [Machine definition](workflow.json)
- [WorkflowDefinition schema](../../../spec/contracts/workflow-definition.schema.json)
- [Adapter capability catalogue](../../../adapters/_catalog/README.md)
- [FR-PLAN-001](../../../spec/requirements/functional.md)
- [EXP-023](../../../experiments/EXP-023-education-and-enablement/spec.md)
- [EXP-024](../../../experiments/EXP-024-bounded-supervisor-agent/spec.md)
- [Portfolio decisions D04](../../../spec/product/decision-register.md)

