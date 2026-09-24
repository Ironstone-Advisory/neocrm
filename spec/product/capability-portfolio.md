# Approved capability portfolio

**Status:** Accepted

The portfolio operationalizes Decisions D16-D35 without replacing NeoCRM's existing semantic foundation. Every capability uses shared Party, Role, Relationship, Time, Evidence, Consent, Policy, Action, Outcome, and Agent contracts.

| Portfolio capability | Canonical treatment | First experiment | Horizon |
| --- | --- | --- | --- |
| Trust Archive and readable history | RecordSnapshot, ArchiveManifest, retention/legal-hold/disposition lifecycle, readable receipts | EXP-017 | P1 |
| Identity and data quality | Resolution, duplicate, enrichment, reconciliation, sync, and issue lifecycle | EXP-017 | P1 |
| Conversation intelligence | Source-span evidence, speaker attribution, extraction proposals, commitment candidates | EXP-013 | P1 |
| Agent operations and value | Projection over AgentRun, Action, Outcome, usage, cost, and receipts | EXP-024 | P1 |
| Intelligent follow-up | Consent/purpose/frequency-aware recommendation and drafting; sending separately granted | EXP-014 | P1 |
| Buying groups | Party/Role/Relationship projection until lifecycle evidence warrants promotion | EXP-019 | P1 |
| Qualification and scoring | Versioned, expiring Insight with evidence, counter-evidence, uncertainty, use limits, disposition | EXP-018 | P1 |
| Metrics and cohorts | MetricDefinition, MetricObservation, CohortDefinition | EXP-018 | P1 |
| Playbooks and sequences | Plan specialization plus explicit enrollment, delivery, and stop lifecycle | EXP-019 | P1 |
| Forecasting | Definition, scenario, submission, snapshot, outcome, uncertainty, and override | EXP-018 | P1 |
| Marketing experimentation | Treatment, variant, assignment, exposure, holdout, guardrail, attribution | EXP-020 | P1 |
| Adaptive journeys | Governed progression; execution follows evidence and channel consent | EXP-020 | P2 |
| Intent activation | Scoped, decaying, evidence-bound signals; no unjustified person attribution | EXP-020 | P1 |
| Inbound qualification | Conversational intake, booking, routing, typed human/agent handoff | EXP-020 | P1 |
| Customer success | Subscription, entitlement, usage, success plan, renewal, adoption and health | EXP-021 | P1 |
| Content and brand | Assets, variants, messages, rights, approval, policy and performance evidence | EXP-022 | P1 |
| Account and mutual plans | Relationship-scoped Plan; external commitments; digital room projection | EXP-019 | P1 |
| Education and enablement | Skill, Competency, LearningPath, Simulation and Certification | EXP-023 | P2 |
| Territory and work balancing | Monitor and defer; no autonomous assignment in initial portfolio | Later evidence gate | Future |
| Bounded supervisor | Level 2 recommendation/escalation, then reversible Level 3 assignment | EXP-024 | P2 |

The detailed object definitions live in [`../domain/`](../domain/) and the experiment specifications in [`../../experiments/`](../../experiments/). Planned capability is not evidence of product value.
