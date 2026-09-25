# NeoCRM workflow catalogue

This is the human entry point to NeoCRM's 57 workflow definitions. It organizes customer-relationship jobs without turning prompts, vendor schemas or connections into the product architecture. Every workflow folder contains a strict [WorkflowDefinition](../spec/contracts/workflow-definition.schema.json) and a generated guide.

> The [specification directory](../spec/README.md) is the sole product authority. This catalogue is generated navigation and governance scaffolding—not 57 running automations.

## Start here

- **Trying the current Zoho + Obsidian slice?** Follow the [first experiment path](FIRST-EXPERIMENT.md).
- **Looking for a business job?** Choose Sales, Marketing or Service below.
- **Building or auditing the system?** Use Meta for product coordination and Shared for internal controls.

| Entry point | Count | Use it for | Open |
| --- | ---: | --- | --- |
| Sales | 14 | Preparing, qualifying, coordinating, updating, pipeline and forecasting work | [Browse Sales](sales/README.md) |
| Marketing | 14 | Audience, campaign, content, journey, inbound, follow and measurement work | [Browse Marketing](marketing/README.md) |
| Service | 16 | Intake, response, commitments, resolution, success, renewal and education work | [Browse Service](service/README.md) |
| Meta | 4 | Onboarding, conversational routing, operations pulse and safe workflow simulation | [Browse Meta](_meta/README.md) |
| Shared controls | 9 | Identity, evidence, consent, time, handoff, action verification and learning controls | [Browse Shared controls](_shared/README.md) |

The count is **57 total = 14 Sales + 14 Marketing + 16 Service + 4 Meta + 9 Shared controls**. The 44 business definitions and four Meta definitions are **48 routable definitions**. The nine Shared controls are **internal and non-routable**; registered parent workflows call them within the parent's principal, purpose and authority.

## Find by outcome

| I need to… | Start with |
| --- | --- |
| Prepare for a sales conversation | [WF-SAL-001 — Relationship Brief and Meeting Prep](sales/WF-SAL-001-relationship-brief-and-meeting-prep/GUIDE.md) |
| Understand an account or buying group | [WF-SAL-002 — Account Research and Buying Group](sales/WF-SAL-002-account-research-and-buying-group/GUIDE.md) |
| Qualify a lead or opportunity | [WF-SAL-003 — Lead Triage and Call Plan](sales/WF-SAL-003-lead-triage-and-call-plan/GUIDE.md) or [WF-SAL-005 — Opportunity Qualification and Next Step](sales/WF-SAL-005-opportunity-qualification-and-next-step/GUIDE.md) |
| Review pipeline or forecast scenarios | [WF-SAL-006 — Pipeline Review and Hygiene](sales/WF-SAL-006-pipeline-review-and-hygiene/GUIDE.md) or [WF-SAL-013 — Forecast and Scenario Review](sales/WF-SAL-013-forecast-and-scenario-review/GUIDE.md) |
| Plan a campaign or eligible audience | [WF-MKT-002 — Campaign Brief and Goal Plan](marketing/WF-MKT-002-campaign-brief-and-goal-plan/GUIDE.md) or [WF-MKT-001 — Audience and Contact Eligibility](marketing/WF-MKT-001-audience-and-contact-eligibility/GUIDE.md) |
| Create and review marketing content | [WF-MKT-003 — Content Strategy and Key Messages](marketing/WF-MKT-003-content-strategy-and-key-messages/GUIDE.md), [WF-MKT-004 — Content and Asset Variant Drafting](marketing/WF-MKT-004-content-and-asset-variant-drafting/GUIDE.md) and [WF-MKT-005 — Brand Rights and Claims Review](marketing/WF-MKT-005-brand-rights-and-claims-review/GUIDE.md) |
| Adapt a journey or intelligent follow | [WF-MKT-008 — Adaptive Journey Recommendation](marketing/WF-MKT-008-adaptive-journey-recommendation/GUIDE.md) or [WF-MKT-011 — Intelligent Marketing Follow](marketing/WF-MKT-011-intelligent-marketing-follow/GUIDE.md) |
| Triage and respond to a service case | [WF-SRV-003 — Case Triage and Priority](service/WF-SRV-003-case-triage-and-priority/GUIDE.md) or [WF-SRV-004 — Response Draft and Deflection](service/WF-SRV-004-response-draft-and-deflection/GUIDE.md) |
| Protect an SLA, handoff or resolution | [WF-SRV-005 — SLA and Commitment Monitor](service/WF-SRV-005-sla-and-commitment-monitor/GUIDE.md), [WF-SRV-006 — Service Handoff and Escalation](service/WF-SRV-006-service-handoff-and-escalation/GUIDE.md) or [WF-SRV-007 — Resolution Verification and Closure](service/WF-SRV-007-resolution-verification-and-closure/GUIDE.md) |
| Review customer health, renewal or success | [WF-SRV-009 — Customer Health Review](service/WF-SRV-009-customer-health-review/GUIDE.md), [WF-SRV-013 — Renewal Readiness and Churn Risk](service/WF-SRV-013-renewal-readiness-and-churn-risk/GUIDE.md) or [WF-SRV-010 — Success Plan and Outcome Review](service/WF-SRV-010-success-plan-and-outcome-review/GUIDE.md) |
| Set up sources or choose the right workflow | [WF-META-001 — Guided Onboarding and Source Readiness](_meta/WF-META-001-guided-onboarding-and-source-readiness/GUIDE.md) then [WF-META-002 — Conversational Intent Router](_meta/WF-META-002-conversational-intent-router/GUIDE.md) |

Each domain page groups every definition by outcome, so this task map is a quick entrance rather than an exhaustive second catalogue.

## First usable path

The intended path is **META-001 → META-002 → SAL-001 → SH-001 / SH-002 / SH-004**:

1. [WF-META-001 — Guided Onboarding and Source Readiness](_meta/WF-META-001-guided-onboarding-and-source-readiness/GUIDE.md) checks declared workspace and source readiness without retrieving customer records.
2. [WF-META-002 — Conversational Intent Router](_meta/WF-META-002-conversational-intent-router/GUIDE.md) identifies or clarifies the requested business job.
3. [WF-SAL-001 — Relationship Brief and Meeting Prep](sales/WF-SAL-001-relationship-brief-and-meeting-prep/GUIDE.md) defines the read-only relationship brief and meeting-preparation result.
4. [WF-SH-001 — Identity and Source Resolution](_shared/WF-SH-001-identity-and-source-resolution/GUIDE.md), [WF-SH-002 — Minimum Necessary Context and Evidence](_shared/WF-SH-002-minimum-necessary-context-and-evidence/GUIDE.md) and [WF-SH-004 — Evidence and Epistemic Review](_shared/WF-SH-004-evidence-and-epistemic-review/GUIDE.md) supply internal identity/source, minimum-necessary-context and evidence/epistemic controls.

Today this is an **operator-guided specification path**: META-001, META-002 and the Shared wrappers are not implemented runtimes. The executable slice is the narrower CAP-001 / EXP-001 read-only path described in the [first experiment guide](FIRST-EXPERIMENT.md).

## How to read status

Every guide shows four independent axes in this order:

| Axis | Question it answers | Current example |
| --- | --- | --- |
| Specification status | Has the definition itself been accepted as product direction? | Accepted or Proposed |
| Implementation status | Does the workflow wrapper and runtime exist? | NotStarted |
| Evidence maturity | Has this workflow been evaluated as a unit? | Unassessed |
| Delivery horizon | When is it intended relative to other work? | P1 or P2 |

Accepted does not mean implemented, and implemented would not by itself mean demonstrated. WF-SAL-001 is Accepted because it maps to the accepted CAP-001 direction, but its wrapper remains NotStarted / Unassessed. CAP-001 and EXP-001 demonstrate only a related bounded read-only dependency.

## How to read result mode

| Label in a definition | Plain-language meaning |
| --- | --- |
| read-only · none | Produce an evidence-linked result or recommendation; do not create an external effect. |
| read-and-propose · draft-only | Prepare content for a person to review and handle; do not execute it. |
| read-and-propose · governed-action-proposal | Show the exact proposed non-destructive effect. Execution is not enabled and would still require policy, scoped authority, verification and a receipt. |
| internal-routine | Run only inside a registered parent workflow's existing principal, purpose, context and authority; do not route it as another user-facing job. |

## Connections, local-only behavior and fallback

- A source capability intent describes the evidence a workflow may request. It never grants connection or read authority.
- **Zero-connector fallback** uses permitted pasted text, an uploaded document, CSV, a user-owned local source or manual entry. The result must show reduced freshness, completeness, verification and automation beside the output.
- **Local-only Meta behavior** means no customer-record capability intent is requested: the workflow uses the authenticated request, local workflow metadata and user-provided context. It is not an authorization bypass and does not claim a working router.
- A connection manifest is configuration, not authority. Every read remains principal-bound, purpose-bound and minimum necessary.

## Product coordination and machine indexes

- [Machine registry](registry.json) is the complete discovery index.
- [Routing fixtures](routing-fixtures.json) cover every routable definition plus explicit clarification cases; they do not claim a router runtime.
- [Adapter capability catalogue](../adapters/_catalog/README.md) defines host-neutral source intents.
- [Anthropic source note](_shared/ANTHROPIC-SOURCE-NOTE.md) records the public structural inspiration and its license.

## Safety and evidence boundary

Definitions grant no connection, read, write, send, schedule or deletion authority. Reads remain within the authenticated principal's authority and declared minimum-necessary context. Non-delete execution would require an explicit, scoped, revocable, time-bounded WriteGrant. Every deletion effect requires fresh exact human DeletionAuthorization bound to an immutable target list.
