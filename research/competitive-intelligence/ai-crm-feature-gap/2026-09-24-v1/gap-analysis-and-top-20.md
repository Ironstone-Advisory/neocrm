# NeoCRM gap analysis and ranked top 20

**Decision status:** Proposal only; no canonical specification changes are made here.  
**Product boundary:** General SMB and mid-market B2B; Zoho + Obsidian first experiment.  
**Scoring:** Value and effort use separate one-to-five-star scales. Release status never reduces capability value.

## Finding

The competitive research supports a broad future portfolio, but it does not justify turning v0.1 into a complete sales, marketing, service, commerce, or analytics suite.

The current architecture is directionally correct. NeoCRM already defines the relationship, context, evidence, policy, action, outcome, and learning primitives that incumbents are now assembling inside proprietary platforms. Its weakness is the operational layer between those abstractions and a usable business motion. Generic Goal, Plan, Signal, Insight, Action, and AuditEvent objects are not by themselves a sequence, forecast, archive, experiment, success plan, or agent-value ledger.

The first product proof should therefore remain narrow:

> Can an advanced assistant assemble a more useful and trustworthy relationship understanding from Zoho and permissioned Obsidian context, explain what changed, recommend the next action, preview a safe follow-up, and leave a durable human-readable record without making either source the semantic owner?

## Ranked recommendation

| Rank | Inventory IDs | Capability gap | Coverage and current anchor | v0.1 value | Long-term value | Effort | Product status | Evidence confidence | Recommendation | Why it matters |
|---:|---|---|---|:---:|:---:|:---:|---|---|---|---|
| 1 | F-055–F-057 | **Trust Archive and human-readable history** | **Partially covered:** AuditEvent, action lifecycle, Agent Audit Console, retention controls | ★★★★★ | ★★★★★ | ★★★★☆ | GA/current | High | Add semantic object/contracts after Rob approval | A person needs one exportable account of what was known, inferred, recommended, approved, changed, verified, observed, and corrected. Immutable machine events and readable summaries must remain linked. |
| 2 | F-005, F-006, F-013 | **Identity, enrichment, and data-quality lifecycle** | **Partially covered:** BC-01, FR-CTX-001, SAFE-IDENT-001, Party source identities | ★★★★★ | ★★★★★ | ★★★★☆ | GA/current | High | Add semantic object/contracts after Rob approval | The Zoho/Obsidian experiment depends on conflict, staleness, duplicate, merge, and reversal handling. Enriched or inferred data must never silently become fact. |
| 3 | F-008–F-011 | **Conversation intelligence and commitment extraction** | **Partially covered:** Activity, Message, Conversation, Commitment, Insight, EXP-009 | ★★★★☆ | ★★★★★ | ★★★★☆ | GA/current | High | Clarify current spec | Meetings and messages should yield reviewable claims, commitments, stakeholder changes, and follow-ups linked to exact evidence—not automatic record mutation. |
| 4 | F-058, F-059 | **Agent observability, consumption, cost, and value ledger** | **Partially covered:** AgentRun/Step, budgets, AuditEvent, Outcome, Agent Audit Console | ★★★★☆ | ★★★★★ | ★★★☆☆ | GA/current | High | Clarify current spec | An advanced assistant must expose runs, sources, tools, handoffs, failures, approvals, usage, human correction, cost, and resulting value. Start with a projection over existing events and Outcomes. |
| 5 | F-018, F-020, F-036 | **Consent-aware intelligent follow-up** | **Partially covered:** BC-04, Consent, Preference, Campaign, Action, PolicyDecision | ★★★☆☆ | ★★★★★ | ★★★★☆ | GA/current | High | Add experiment | Recommend whether, why, when, and how to follow up; draft first; respect purpose, suppression, contact limits, service state, and reply/meeting stop conditions. |
| 6 | F-012 | **Buying-group and stakeholder orchestration** | **Partially covered:** Party, Role, Relationship, Graph and Relationship workspaces | ★★★★☆ | ★★★★★ | ★★★☆☆ | GA/current | High | Clarify current spec | B2B work needs decision makers, champions, blockers, influence, authority, missing roles, and group goals. Begin as a temporal projection; add BuyingGroup only if it has an independent lifecycle. |
| 7 | F-015, F-016, F-022 | **Explainable qualification and opportunity scoring** | **Partially covered:** Insight, Signal, Recommendation, FR-INSIGHT-001 | ★★★☆☆ | ★★★★★ | ★★★★☆ | Mixed: GA/current + beta | High | Clarify current spec | A qualification assessment needs method/version, evidence, counter-evidence, missingness, uncertainty, expiry, and human disposition. A score is never a customer fact or independent action authority. |
| 8 | F-050–F-054 | **Semantic metrics, conversational analytics, and anomaly detection** | **Partially covered:** Outcome, TimeSeries, Signal, EvaluationRun, Insight Explorer | ★★★☆☆ | ★★★★★ | ★★★★☆ | Mixed: GA/current + preview | High | Add semantic object/contracts after Rob approval | MetricDefinition makes natural-language analytics reproducible: owner, formula, grain, dimensions, lineage, version, permitted use, and causal limits. An anomaly remains a Signal. |
| 9 | F-017, F-029 | **Sales playbooks, sequences, cadences, and stop rules** | **Partially covered:** Goal, Plan, WorkItem, Activity, and Consent exist; no reusable run contract | ★★☆☆☆ | ★★★★★ | ★★★★☆ | GA/current | High | Add semantic object/contracts after Rob approval | Specialize Plan rather than create a competing workflow ontology. Include enrollment, waits, branches, channel rules, frequency limits, response exits, suppression, ownership, and handoff. |
| 10 | F-023, F-024 | **Forecast scenarios, submissions, and pipeline risk** | **Partially covered:** Opportunity, TimeSeries, Insight, and Outcome exist; no forecast lifecycle | ★★☆☆☆ | ★★★★☆ | ★★★★★ | GA/current | High | Add semantic object/contracts after Rob approval | Separate scenario, horizon, assumptions, contributor judgment, model estimate, uncertainty range, commit, override, history, and observed result. |
| 11 | F-039, F-040, F-054 | **Marketing experiments, variants, assignment, and attribution** | **Partially covered:** Campaign, Audience, Outcome, and EvaluationRun exist; no marketing-treatment contract | ★★☆☆☆ | ★★★★★ | ★★★★★ | GA/current | High | Add semantic object/contracts after Rob approval | Experiment, Variant, Assignment, and AttributionClaim must distinguish observed association from causal effect and retain holdout/limitation evidence. |
| 12 | F-033, F-034 | **Adaptive cross-channel relationship journeys** | **Partially covered:** Journey, Campaign, Audience, Goal, Signal, and Action | ★★☆☆☆ | ★★★★★ | ★★★★★ | Mixed: GA/current + preview | High | Add experiment | Test recommendations before execution. Optimize customer, service, ethical, and commercial Outcomes together; allow deliberate non-action. |
| 13 | F-032 | **Intent-signal subscription and account activation** | **Partially covered:** Signal, Insight, Research, Audience, and adapter subscriptions | ★★☆☆☆ | ★★★★★ | ★★★★☆ | GA/current | High | Add experiment | Keep provider, collection window, scope, decay, confidence, and activation decision separate. Company activity cannot be attributed to a named person without evidence. |
| 14 | F-038 | **Inbound conversational qualification and typed handoff** | **Partially covered:** Intent, Goal, Plan, Conversation, CustomerNeed, Opportunity, and Handoff | ★★☆☆☆ | ★★★★☆ | ★★★★☆ | GA/current | High | Add experiment | A disclosed agent may understand a need, answer bounded questions, book, or hand off while preserving evidence and declining unsupported conclusions. |
| 15 | F-045–F-047, F-066 | **Customer success, adoption, entitlement, and renewal intelligence** | **Partially covered:** Journey, ServiceCase entitlement, Product/Service, Event, Insight, and Outcome | ★★☆☆☆ | ★★★★★ | ★★★★☆ | GA/current | High | Add semantic object/contracts after Rob approval | Subscription/Entitlement, UsageObservation, SuccessPlan, and Renewal support lifecycle continuity. Health remains an expiring, explainable Insight. |
| 16 | F-035 | **Content, key-message, and brand intelligence** | **Missing:** Campaign and Knowledge are adjacent, but no content lifecycle is defined | ★★☆☆☆ | ★★★★☆ | ★★★★☆ | GA/current | High | Add semantic object/contracts after Rob approval | ContentAsset, ContentVariant, KeyMessage, and BrandPolicy need rights, sources, claims, audience, approval, version, and performance evidence. |
| 17 | F-026 | **Account plans, mutual action plans, and digital rooms** | **Partially covered:** Goal, Plan, WorkItem, Commitment, and Outcome | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | GA/current | Medium | Clarify current spec | An account plan is a relationship-scoped Plan projection. A mutual plan adds externally visible Commitments and access policy; a digital room is a view. |
| 18 | F-027, F-028, F-048 | **Education, coaching, role-play, and competency** | **Missing:** LearningSignal concerns system learning, not a human/customer capability model | ★☆☆☆☆ | ★★★★☆ | ★★★☆☆ | GA/current | High | Add semantic object/contracts after Rob approval | Skill, Competency, LearningPath, Simulation, Evidence, and Certification can serve employees and customers. Reject opaque employee surveillance. |
| 19 | F-025 | **Territory, quota, assignment, and work balancing** | **Partially covered:** Capacity, Workload, WorkItem, and queue exist | ★☆☆☆☆ | ★★★☆☆ | ★★★★☆ | GA/current | High | Monitor | Useful parity but not an initial differentiator. Later routing must expose rationale, fairness, conflicts, and relationship continuity. |
| 20 | F-060, F-062–F-064 | **Policy-bounded supervisor agent and active management** | **Partially covered:** agent/work/control objects exist and Levels 4–5 are deferred; the broad autonomous form would conflict with current principles | ★☆☆☆☆ | ★★★★★ | ★★★★★ | Mixed: GA/current + beta | Medium | Add experiment | Begin at Level 2: observe, detect exceptions, recommend redistribution, and escalate. Later Level 3 may test reversible assignments; broad autonomous management remains prohibited. |

The ranked capabilities are deliberate composites of the linked inventory rows. Their stars score the proposed capability package rather than averaging vendor or component scores. Product lifecycle and evidence confidence remain separate fields and neither changes the value score.

## What changes conceptually—and what does not

### Preserve without redesign

- Party, contextual Role, and typed Relationship remain the semantic core.
- Customer remains a Role that any Party may hold.
- Product and Service remain distinct from Offer, Opportunity, Deal, and Contract.
- Activity, Message, Conversation, Time, Event, Commitment, and Outcome remain distinct.
- NeoCRM owns the semantic model, not the storage model.
- Persistence is replaceable. Intelligence is not.
- Calendar = View; Time = Domain.
- Context remains federated and minimum-necessary; NeoCRM does not create an indiscriminate global customer master.
- The action lifecycle remains propose → preview → policy → approval when required → execute → verify → audit → Outcome → compensation where applicable.
- v0.1 remains Levels 0–2; Level 3 is experiment-only and reversible; Levels 4–5 remain deferred.

### Clarify after review

- A relationship brief must answer “what changed?” and “what evidence would change this assessment?”
- Conversation-derived claims and commitments have source spans, epistemic state, reviewer/disposition, and temporal validity.
- Buying groups initially remain a projection over Party/Role/Relationship unless an independent lifecycle is proven.
- Agent audit has both structured events and a human-readable projection; it must not expose hidden chain-of-thought.
- Cost, usage, acceptance, correction, execution, and observed value are visible together.
- Scores are versioned Insights, not durable Party facts or permissions.

### Candidate semantic extensions

Names below are working proposals, not adopted object names.

| Family | Candidate objects/contracts | Why existing primitives are insufficient |
|---|---|---|
| Trust archive | RecordSnapshot, ArchiveManifest, RetentionSchedule, LegalHold, DispositionEvent, HumanReadableReceipt | AuditEvent alone does not define records retention, export, hold, disposition, or a business-readable narrative. |
| Identity/data quality | IdentityResolutionDecision, DuplicateCandidate, EnrichmentProposal, ReconciliationDecision, SyncReceipt | Party/source identity does not fully express candidate review, merge rationale, reversal, and write-back verification. |
| Conversation evidence | RecordingConsent, TranscriptSegment, SpeakerAttribution, ExtractionProposal, CommitmentCandidate | Conversation and Evidence lack media-specific consent and exact-span extraction/disposition semantics. |
| Sales execution | PlaybookDefinition, SequenceRun, SequenceStep, Enrollment, StopCondition, DeliveryAttempt | Plan/WorkItem describe work, but not reusable contact logic, response exits, contact throttling, and delivery outcomes. |
| Qualification | QualificationDefinition, QualificationAssessment, ScoreDefinition, ScoreObservation | Insight can carry a result, but reusable criteria, calibration, expiry, and comparison require explicit contracts. |
| Revenue planning | ForecastDefinition, ForecastScenario, ForecastSubmission, ForecastSnapshot, ForecastOutcome | Opportunity and TimeSeries do not represent accountable judgment, scenarios, rollups, or back-testing. |
| Marketing learning | Experiment, Variant, Assignment, Exposure, AttributionClaim | EvaluationRun evaluates systems; it should not be overloaded with customer treatment assignment and causal claims. |
| Analytics | MetricDefinition, MetricObservation, CohortDefinition | Outcome measures lack reusable calculation, grain, lineage, access, and version semantics. |
| Customer lifecycle | Subscription, Entitlement, UsageObservation, SuccessPlan, Renewal | Contract/ServiceCase references are not a full post-sale lifecycle model. |
| Content and education | ContentAsset, ContentVariant, KeyMessage, BrandPolicy, Skill, Competency, LearningPath, Simulation, Certification | Knowledge and LearningSignal do not cover governed content production or human/customer capability development. |
| Agent economics | UsageEntry, CostEntry, ValueObservation, BudgetDecision | Budgets and cost Outcomes exist, but a comparable, attributable action/value ledger is not defined. |

## Experiment program: usable, bounded slices

The current slice is EXP-001 as already specified. The later jobs below are a sequence of separate experiment proposals, not additions to EXP-001 or claims about the current implementation.

### User

A founder-seller or small B2B account team preparing for and following up on real relationship work.

### Systems

- **Zoho CRM** — operational records and, only after a later approval-gated phase, a target for exact field updates.
- **Obsidian** — permissioned, human-owned notes, briefs, decisions, and knowledge artifacts under vault-root confinement; read-only for EXP-001.
- **NeoCRM** — semantic reconciliation, evidence, policy, conversational reasoning, recommendation, approval, and experiment measurement.

### Current EXP-001 assistant jobs

1. “What do I need to know before I speak with this person?”
2. “What changed since the last interaction?”
3. “Which claims are facts, interpretations, conflicts, or unknowns?”
4. “Who matters in this buying relationship, and what roles are missing or uncertain?”
5. “What commitments exist, who owns them, and what is due?”
6. “What should I ask or discuss next, why, and what are the alternatives?”

### Later, separately approved assistant jobs

7. “Draft the follow-up, but do not send it.”
8. “Preview exactly what would change in Zoho and what note could be written to Obsidian.”
9. “After approval in a write-enabled experiment, verify the effect and give me a readable receipt.”

### Current EXP-001 acceptance evidence

- identity ambiguity stops private retrieval;
- every material claim has provenance, authority, freshness, confidence, completeness, and epistemic treatment;
- partial/denied sources remain visible;
- only explicitly approved Zoho and Obsidian context is read;
- no external write or durable memory occurs in the current CAP-001 boundary;
- experiment-owned feedback and Outcome records remain distinct from CRM facts and durable conversational memory;
- no transcript, email, note, or retrieved page can change tools, policy, authority, or plan state through embedded instructions.

### Later-gate acceptance evidence

- a write preview binds exact target, before/after value, source evidence, policy decision, approver, expiry, and idempotency key;
- an Obsidian artifact is human-readable, source-linked, correction/deletion-aware, and clearly marked as generated, proposed, or accepted;
- machine events remain linked to human-readable run and action receipts; and
- persistent history records usage/cost, failures, user corrections, accepted/rejected recommendations, and observed Outcomes.

## Evidence-gated sequence

### Gate A — finish EXP-001 as designed

- Preserve the A: Zoho, B: NeoCRM + Zoho, C: NeoCRM + Zoho + permissioned Obsidian comparison.
- Add only instrumentation and semantic clarifications necessary to measure trust, usefulness, source quality, time, error, and user correction.
- Keep all external writes disabled.

### Gate B — conversation and follow-up preview

- Run EXP-009 or a linked experiment for transcript/message ingestion, claim and commitment extraction, and reviewer disposition.
- Test next-best-action explanation and a consent-aware draft.
- Measure evidence accuracy, unsupported-claim rate, correction burden, draft acceptance, and unwanted-contact policy failures.

### Gate C — isolated reversible write

- Add one allowlisted Zoho action through the governed action gateway.
- Bind approval to an exact preview; execute idempotently; read back and verify; generate both machine event and human-readable receipt.
- No autonomous send, enrolment, pricing, contract, campaign, or multi-step action.

### Gate D — reusable sales and analytics contracts

- Decide sequence/playbook, qualification, MetricDefinition, and Trust Archive object proposals through ADRs and tests.
- Test relationship-aware scoring and signal decay without treating results as fact.
- Compare value and cost per completed user job.

### Gate E — later modules

- Forecasting and pipeline scenarios.
- Marketing experiments and adaptive journeys.
- Customer success, usage, renewal, and education.
- Territory/routing and bounded supervisor-agent experiments.
- Commercial operations only where adapters and business demand justify them.

## Attractive features deliberately excluded from v0.1

- autonomous outbound email, SMS, voice, advertising, or multichannel sequences;
- persistent AI-created customer profiles or conversational-residue memory;
- forecast commit, quota, territory, compensation, or employee-performance scoring;
- a new CDP, warehouse, data marketplace, or clone of a vendor-native object model;
- autonomous campaign launch, media spend, pricing, discounting, negotiation, contracting, ordering, invoicing, or billing;
- production voice agents or autonomous service resolution;
- digital sales rooms as a new customer/content ontology;
- hidden lead, health, intent, relationship, or employee scores treated as facts;
- silent agent, prompt, mapping, policy, authority, or schema mutation;
- a manager agent that expands its authority or changes other agents without an approved, evaluated release.

## Explicit guardrails for copied market patterns

| Market pattern | NeoCRM disposition |
|---|---|
| Direct natural-language mutation of prompts, schemas, policy, mappings, grants, or AgentDefinitions | **Reject.** Conversation may create a versioned change proposal; independent review, evaluation, and release are required. |
| Opaque lead, customer, relationship, or employee score presented as truth | **Reject.** Represent an expiring Insight with method, evidence, missingness, uncertainty, counter-evidence, and permitted use. |
| Behavioral outreach without purpose, consent, suppression, service state, and harm checks | **Reject.** Policy evaluation precedes recommendation, draft, and execution. |
| Indefinite “archive everything” | **Reject.** Archive must implement minimization, retention, legal hold, correction, export, deletion, and disposition. |
| Vendor custom field automatically becoming a NeoCRM object | **Reject.** Map it explicitly; semantic promotion requires a reviewed extension decision. |
| Third-party company intent attributed to a named person | **Reject.** Preserve subject scope, collection window, source, decay, and uncertainty. |
| Engagement or revenue optimization that ignores customer/service Outcomes | **Reject.** Balanced Outcomes and harm constraints are mandatory. |

## Review decisions requested from Rob

1. Approve, revise, or reject the ranked top 20.
2. Confirm whether Trust Archive and identity/data-quality objects should enter a specification-change proposal immediately or wait for EXP-001 evidence.
3. Confirm whether buying group should remain a projection initially.
4. Confirm that the first follow-up experiment is draft-only and that the first write experiment is a single allowlisted Zoho update.
5. Select which value-add packages deserve formal product hypotheses after the first experiment.
