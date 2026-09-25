# WF-SRV-015 — Customer Education and Enablement

[Workflow catalogue](../../README.md) / [Service workflows](../README.md)

**Status:** Proposed / NotStarted / Unassessed / P2

**For:** Service or customer-success teammate

**Result mode:** read-and-propose; draft-only ([plain-language meaning](../../README.md#how-to-read-result-mode))

**Runtime boundary:** Definition scaffolding only; no workflow router, live write, send, schedule, or connection-registration runtime is claimed.

## Job

Help an authorized service or customer-success teammate complete customer education and enablement from relationship evidence while keeping source gaps, uncertainty and authority visible.

## Use when

- An authorized service or customer-success teammate asks for customer education and enablement.
- A relevant event or signal suggests that customer education and enablement may be useful, subject to human review.

## Produces

- Customer Education and Enablement result
- Evidence, uncertainty and source-gap summary
- Draft or governed action proposal; never silent execution

## Flow at a glance

Each step completes only when its typed result, supporting evidence and material gaps are recorded. The machine definition holds the detailed dependencies, branch conditions and completion criteria.

1. **Bind principal, purpose, Intent and Goal**
2. **Resolve identity and tenant scope**
3. **Retrieve minimum-necessary evidence**
4. **Assess evidence sufficiency and conflicts**
5. **Synthesize customer education and enablement**
6. **Escalate insufficient or conflicting evidence**
7. **Review result and next decision**

## Sources and fallback

Capability intents: `source.activity.read`, `source.content.read`, `source.entitlement.read`, `source.identity.read`, `source.knowledge.read`, `source.relationship.read`, `source.service.read`.

Sources are selected by adapter capability intent and provide evidence; vendor products and schemas do not define NeoCRM canonical meaning. Fallback inputs reduce freshness, completeness, verification and automation; show those limits beside the result.

Zero-connector modes: pasted-text, uploaded-document, csv, user-owned-local-source, manual-entry.

## Authority and stops

Mode: **read-and-propose**. Reads are principal-bound, purpose-bound and minimum necessary. A WriteGrant authorizes only registered, scoped, time-bounded non-destructive actions; it never authorizes deletion. Every deletion effect requires fresh exact human DeletionAuthorization bound to an immutable target list.

- Identity or tenant scope is ambiguous or conflicts with the request.
- A required source is denied or failed and the disclosed fallback is insufficient.
- Evidence is too incomplete, stale or conflicting for a safe recommendation.
- The requested material effect is outside authority, or any deletion lacks fresh exact human authorization.
- Consent, suppression, frequency-cap, quiet-hours or contact-purpose checks fail or are unavailable.
- A current service issue, complaint, vulnerable-customer signal or other service conflict makes contact unsafe.

## Evidence and status

The definition is mapped to planned experiments and evaluation plans; no workflow-specific runtime or outcome evidence is claimed.

Evaluation: **NotStarted**. A workflow-specific fixture, adversarial cases, human review and outcome evidence must be created and run before any demonstration claim.

Specification status, implementation status, evidence maturity and delivery horizon are independent. [See how to read the four axes](../../README.md#how-to-read-status).

## Example and fixture plan

Example request: “Help me with customer education and enablement and show the evidence, gaps and decisions I need to make.”

Planned fixtures: `PLANNED-FIXTURE-WF-SRV-015`. They are placeholders, not executed evidence.

Planned evaluation checks:

- Routes only when the declared job, principal and source capability intents match.
- Discloses missing, denied, stale and conflicting evidence without treating missing as zero.
- Stops action execution without the required policy decision, authority, verification and receipt path.
- Returns a readable result that exposes evidence, counterevidence, unknowns, uncertainty, degradation and the next human decision.
- Blocks contact when consent, suppression, frequency, quiet-hours or service-conflict controls are not satisfied.

Traceability: `FR-EDU-001`, `SAFE-SURVEIL-001`, `EXP-023`.

## Related artifacts

- [Machine definition](workflow.json)
- [WorkflowDefinition schema](../../../spec/contracts/workflow-definition.schema.json)
- [Adapter capability catalogue](../../../adapters/_catalog/README.md)
- [FR-EDU-001](../../../spec/requirements/approved-portfolio.md)
- [EXP-023](../../../experiments/EXP-023-education-and-enablement/spec.md)

