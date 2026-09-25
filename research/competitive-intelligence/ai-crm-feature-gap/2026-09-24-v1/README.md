# AI CRM competitive feature-gap proposal

**Version:** 2026-09-24-v1  
**Research cutoff:** 2026-09-24  
**Decision status:** Forty-eight recommendations approved 2026-09-24; implementation and evidence remain Planned  
**Audience:** Product, business architecture, technical architecture, and experiment design  
**Market:** General SMB and mid-market B2B, with a North American and Canadian governance lens

## Decision notice

This package remains the dated research evidence and does not silently redefine NeoCRM. Rob subsequently approved all forty-eight recommendations, including modified read/write authority, a broad registered Zoho workflow experiment, and fresh exact human authorization for every deletion. The resulting canonical changes are traceable separately; research scores and vendor claims remain dated evidence rather than requirements.

Feature value is scored independently of release maturity. Beta, preview, announced, and unclear-current capabilities keep their full value score; lifecycle status and evidence confidence are recorded separately.

## Question

What capabilities now offered by AI CRM, revenue-intelligence, sales-engagement, marketing-automation, service, and customer-success products are not adequately covered by NeoCRM—and which should shape an agent-native CRM whose primary experience is an advanced conversational assistant?

The immediate product boundary is the first usable experiment with **Zoho as the transactional source** and **Obsidian as a human-owned knowledge surface**. The research also tests the longer-term product architecture.

## Artifacts

- [`market-comparison.md`](market-comparison.md) — competitor positioning, capability comparison, status, and public pricing anchors.
- [`feature-inventory.csv`](feature-inventory.csv) — normalized, machine-readable feature inventory and NeoCRM coverage assessment.
- [`gap-analysis-and-top-20.md`](gap-analysis-and-top-20.md) — recommended portfolio, scores, proposed objects/contracts, exclusions, and experiment sequence.
- [`value-models-and-pricing.md`](value-models-and-pricing.md) — separately packaged value models and a transparent commercial model for NeoCRM.
- [`source-register.md`](source-register.md) — dated first-party evidence register and Canadian governance sources.
- [`article-brief.md`](article-brief.md) — claim-safe article thesis and outline derived from the research.

## Executive conclusion

The approval and its limits are recorded in [`decision-outcome.md`](decision-outcome.md).

NeoCRM does not need to become a feature-for-feature copy of an incumbent suite. The current specification already contains the right architectural primitives—Party, Role, Relationship, evidence and epistemic states, Goal, Plan, Action, Policy, Consent, Outcome, Journey, Campaign, Signal, Insight, AgentRun, and AuditEvent. The principal gaps are the **operational semantic contracts between those primitives**:

1. a plain-language, durable evidence-and-action archive;
2. interaction-to-claim, commitment, stakeholder, and next-step reconciliation;
3. consent-aware follow-up, cadence, playbook, and stop-rule semantics;
4. evidence-backed qualification, health, risk, and next-best-relationship action;
5. agent observability, budgets, cost, outcome, and value accounting;
6. relationship-aware journeys and experiments with honest attribution;
7. buying-group, account-plan, forecast, education, customer-success, and content-governance extensions.

Competitors increasingly provide agents, workflow builders, conversational analytics, and AI credits. Their meaning normally remains coupled to proprietary records, profiles, or application silos. NeoCRM's strongest defensible position is therefore:

> A portable semantic relationship control plane in which an advanced assistant can explain, propose, simulate, execute within policy, verify, and learn—while every source, inference, permission, cost, action, and outcome remains inspectable by a person.

## Research coverage

The core comparison covers:

- integrated CRM suites: HubSpot, Zoho, Salesforce, Microsoft Dynamics 365, Creatio, Attio, Pipedrive, and Freshworks;
- revenue intelligence and sales execution: Gong, Apollo, Outreach, and Salesloft/Clari Forecast;
- account-based marketing and intent: 6sense and Demandbase;
- lifecycle marketing: Adobe Marketo Engage and Braze;
- adjacent pattern references: ActiveCampaign, Gainsight, Highspot, Clay, Intercom, and Salesloft.

The inventory emphasizes sales automation, intelligent marketing follow-up, intelligent objects, archives, analytics, education, customer success/service, and active automatic management. Commerce and quote-to-cash are assessed as secondary domains.

## Method

1. Normalize vendor terminology into customer jobs and semantic capabilities.
2. Use current first-party product, help, release, and pricing sources wherever available.
3. Record product status separately as GA/current, rolling out, beta/preview, announced, unclear-current, or not native.
4. Compare each normalized capability to current NeoCRM specification evidence.
5. Classify coverage as **Covered**, **Partially covered**, **Missing**, or **Conflicts with current principles**.
6. Score v0.1 customer value, long-term strategic value, and implementation effort independently on a one-to-five-star scale.
7. Recommend one disposition without changing the specification.

## Scoring

| Score | v0.1 customer value | Long-term strategic value | Implementation effort |
|---|---|---|---|
| ★☆☆☆☆ | Little relevance to the first experiment | Off-strategy | Documentation or configuration only |
| ★★☆☆☆ | Useful but safely postponable | Optional support | Bounded extension |
| ★★★☆☆ | Meaningful next step | Supporting capability | New objects, contracts, workflow, or adapter work |
| ★★★★☆ | Strong leverage | Important to the product | Complex data, model, interface, and control work |
| ★★★★★ | Essential to a credible and safe experiment | Core differentiator or necessary parity | Multi-system, high-risk, or longitudinal work |

Effort is not desirability: five stars means hardest, not best. There is no blended score. Ranking is a product judgment informed by all three measures.

## Coverage definitions

- **Covered** — the canonical specification already defines the capability at the required semantic and control level; implementation may still be absent.
- **Partially covered** — relevant primitives exist, but a usable object, lifecycle, policy contract, view, adapter behavior, or evaluation is missing.
- **Missing** — no adequate canonical representation or requirement exists.
- **Conflicts with current principles** — the market pattern would violate evidence, consent, human-control, semantic-ownership, or learning boundaries if copied as-is.

## Research-time recommendation vocabulary

The labels below record the recommendation state when this dated research was produced. The later authorization decision is recorded in [`decision-outcome.md`](decision-outcome.md) and the canonical decision register; it does not retroactively turn vendor evidence or research scores into requirements.

- **Clarify current spec** — preserve the model; make an existing obligation explicit.
- **Add semantic object/contracts after Rob approval** — propose a canonical extension through a separate specification change.
- **Add experiment** — test a falsifiable product hypothesis before adoption.
- **Monitor** — retain evidence and revisit when the product boundary expands.
- **Reject/guardrail** — prohibit or reshape the market pattern.

## Approved experiment-sequence disposition

The current repository boundary remains unchanged: CAP-001 is a synthetic, deterministic, read-only context probe, and EXP-001 is a planned human A/B/C relationship-brief experiment. Both keep external writes and durable memory disabled.

The approved scope of the first permissioned Zoho-plus-Obsidian EXP-001 run remains:

- the evidence-bound relationship brief and a "what changed" explanation;
- reviewable Facts, Observations, Interpretations, Hypotheses, Unknowns, Conflicts, Commitments, and source gaps;
- a next-conversation recommendation with alternatives, not an outbound follow-up;
- read-only use of explicitly approved Obsidian notes under the experiment's source boundary; and
- protocol-owned user feedback, intended/observed Outcome, quality, effort, and correction measures, without admitting conversational residue as durable CRM memory.

The approved later experiment specifications may test the following, but they remain Planned and each still requires its own execution readiness, source boundary, and applicable authority:

- interaction/meeting capture into reviewable claim and commitment proposals;
- a consent-aware follow-up draft that is not sent;
- a broad portfolio of registered Zoho workflows under scoped, revocable, time-bounded WriteGrants, with read-back verification and human-readable receipts;
- a generated Obsidian brief or decision record with an explicit write preview, correction/deletion behavior, and source links; and
- persistent run, cost, acceptance, rejection, correction, and observed-outcome history.

Sequences, automated marketing sends, autonomous qualification, forecast, advertising, CPQ, billing, and production Level-3 execution remain outside EXP-001. They may proceed only through their separately specified experiment, authority, implementation, and evidence gates.
