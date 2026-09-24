# Approved product decision register

**Status:** Accepted

**Decision date:** 2026-09-24  
**Authority:** Product owner approval in the NeoCRM design review  
**Implementation note:** Acceptance records product intent. Unless an entry explicitly identifies existing evidence, implementation and evidence remain Planned.

This register records the complete forty-eight-decision review. It is normative product direction, but it does not convert a planned capability into implemented software or validated evidence.

| Decision | Accepted direction | Implementation / evidence |
| --- | --- | --- |
| D01 | Retain Party -> Role -> Relationship, contextual Customer roles, distinct activity/conversation/commercial objects, `Calendar = View; Time = Domain.`, semantic ownership, and replaceable sources. | Existing foundation; partial / demonstrated only where traced. |
| D02 | Retrieve minimum-necessary context from permissioned, federated sources; durable memory requires explicit purpose, provenance, policy, and retention. | Partial / demonstrated in CAP-001 only. |
| D03 | Consequential action follows propose, preview, policy, approval when required, execute, verify, audit, outcome, and compensation. Authority never self-expands. | Partial / demonstrated in fail-closed CAP-001; execution planned. |
| D04 | Agents may propose changes to prompts, mappings, schemas, policy, grants, and AgentDefinitions, but only versioned human-reviewed, evaluated, releasable changes may take effect. | Planned. |
| D05 | External data and model output remain evidence or proposed interpretation until explicitly reconciled and promoted. | Partial / demonstrated in CAP-001. |
| D06 | Pricing, discounts, negotiation, contracting, ordering, invoicing, payment, and billing remain external or exact-approval-bound. | Planned. |
| D07 | Retain EXP-001 conditions A: Zoho; B: NeoCRM + Zoho; C: NeoCRM + Zoho + permissioned Obsidian. | Planned; fixture preflight only. |
| D08 | Experiments may use the authenticated user's read authority, but retrieval remains minimum-necessary and protocol/source bounded. Writes require explicit, scoped, revocable, time-bounded grants with limits, verification, receipts, and reversal rules. Grants cannot exceed the user or self-expand. | Planned; CAP-001 and EXP-001 remain read-only. |
| D09 | EXP-001 primarily tests evidence-bound relationship understanding; write execution is a separate condition or linked experiment. | Planned. |
| D10 | EXP-001 success requires provenance, epistemic separation, visible gaps/failures, injection resistance, usefulness/trust/correction measures, and separately audited actions. | Planned; deterministic checks demonstrated, human evidence pending. |
| D11 | Run a separate evidence-linked meeting and conversation-intelligence experiment. | Planned as EXP-013. |
| D12 | Test consent-aware follow-up quality as a draft-only experiment before separately testing delivery. | Planned as EXP-014. |
| D13 | Test a broad registered portfolio of Zoho workflows, not one write. Each workflow declares objects, fields, operations, risk, limits, approval mode, verification, readable receipts, and correction/compensation. Every deletion still requires fresh exact human authorization. | Planned as EXP-015. |
| D14 | Test Obsidian artifact writes separately with preview, source links, generated/proposed/accepted labels, and correction/deletion behavior. | Planned as EXP-016. |
| D15 | Use evidence gates A-E: read understanding; draft/proposal; bounded reversible write; cross-functional workflows; only then broader active management. | Planned portfolio sequence. |
| D16 | Make Trust Archive and human-readable history first-class contracts. | Planned as EXP-017. |
| D17 | Add identity, enrichment, duplicate, reconciliation, synchronization, and data-quality lifecycles. | Planned as EXP-017. |
| D18 | Add conversation intelligence and evidence-linked commitment extraction. | Planned as EXP-013. |
| D19 | Project agent observability, usage, cost, and value from existing runs/actions/outcomes before adding more ledger objects. | Planned; evaluated across EXP-018 and EXP-024. |
| D20 | Add consent-aware intelligent follow-up to the roadmap. | Planned as EXP-014. |
| D21 | Initially represent buying groups as Party/Role/Relationship projections; promote a first-class object only after independent lifecycle evidence. | Planned as EXP-019. |
| D22 | Represent explainable qualification and scoring as expiring, versioned Insights with evidence, uncertainty, counter-evidence, permitted use, and human disposition. | Planned as EXP-018. |
| D23 | Add MetricDefinition, MetricObservation, and CohortDefinition. | Planned as EXP-018. |
| D24 | Model playbooks, sequences, cadence, enrollment, delivery, and stop rules as Plan specializations with explicit lifecycle objects. | Planned as EXP-019. |
| D25 | Add forecast definitions, scenarios, submissions, snapshots, uncertainty, overrides, and outcomes. | Planned as EXP-018. |
| D26 | Add marketing TreatmentExperiment, Variant, Assignment, Exposure, holdout, guardrail, and AttributionClaim. | Planned as EXP-020. |
| D27 | Test adaptive relationship journeys before permitting cross-channel execution. | Planned as EXP-020. |
| D28 | Test intent-signal account activation with scope, decay, confidence, and person-attribution safeguards. | Planned as EXP-020. |
| D29 | Test inbound conversational qualification, booking, routing, and typed handoff. | Planned as EXP-020. |
| D30 | Add subscription, entitlement, usage, success-plan, renewal, adoption, and customer-health semantics. | Planned as EXP-021. |
| D31 | Add governed content, variants, key messages, brand policy, approval, rights, and performance evidence. | Planned as EXP-022. |
| D32 | Model account plans as relationship-scoped Plans, mutual plans as externally visible Commitments, and digital rooms as views. | Planned as EXP-019. |
| D33 | Add Skill, Competency, LearningPath, Simulation, Evidence, and Certification while prohibiting opaque employee surveillance. | Planned as EXP-023. |
| D34 | Monitor and defer territory, quota, assignment, and work-balancing automation until stronger evidence exists. | Future; no execution authority granted. |
| D35 | Test a bounded supervisor agent at Level 2 recommendation/escalation first, with later reversible Level 3 assignment only under a write grant. | Planned as EXP-024. |
| D36 | Include the Relationship Control Plane in every plan: provenance, consent, policy, readable history, correction, portability, basic spend visibility, and autonomy Levels 0-2. | Core product boundary. |
| D37 | Treat Sales Intelligence & Follow-Through as a value hypothesis. | Planned module hypothesis. |
| D38 | Treat Intelligent Marketing Follow as a value hypothesis. | Planned module hypothesis. |
| D39 | Treat Revenue Analytics & Planning as a value hypothesis. | Planned module hypothesis. |
| D40 | Keep basic integrity in core; test Trust Archive & Advanced Compliance as additional value. | Planned module hypothesis. |
| D41 | Treat Education & Enablement as a value hypothesis. | Planned module hypothesis. |
| D42 | Treat Agent Operations & Active Management as a value hypothesis. | Planned module hypothesis. |
| D43 | Treat Data & Signal Fabric as a value hypothesis. | Planned module hypothesis. |
| D44 | Treat Customer Success & Service Guard as a value hypothesis. | Planned module hypothesis. |
| D45 | Keep Commercial Operations optional, later, and adapter-led. | Future module hypothesis. |
| D46 | Test a hybrid commercial structure: base organization, human seats, outcome modules, and only genuinely variable metered work. | Planned as EXP-025. |
| D47 | Make metering human-readable: estimate before, reconcile after, and link completion, failure, reversal, outcome, budgets, and hard stops. | Planned as EXP-025. |
| D48 | Permit outcome pricing only for predefined, inspectable, disputable, safely incentivized, attributable outcomes with disclosed limitations. | Planned as EXP-025. |

## Binding deletion rule

Every deletion requires a **fresh, exact, human authorization** for the specific immutable target list. A general or time-bounded WriteGrant never includes `delete`, cannot be interpreted to include it, and cannot pre-authorize later-selected targets. An enumerated batch is allowed only when the human sees and approves the complete immutable list as one single-use DeletionAuthorization. Expiry, identity, target version where available, policy decision, execution, verification, and a human-readable receipt are mandatory.

## Change control

Changing an Accepted entry requires a superseding product decision and affected ADR, requirement, experiment, evaluation, and traceability updates. Experiment results may reject a hypothesis without silently rewriting this record.
