# Sales methodology packs

**Status:** Proposed (2026-10-25). Planned implementation; no evidence yet. Governing requirement: FR-METHOD-001 in [proposed requirements](../../requirements/proposed-2026-10-25.md).

NeoCRM is sales-methodology independent. The base workflows, objects, authority and stops are the same whether a team sells with MEDDPICC, Challenger or nothing written down at all. A methodology arrives as a **pack**: versioned data that extends attributes. It never changes the workflow.

The test is simple. Turn every pack off and every workflow still runs, with the same steps, in the same order, under the same authority. Turn one on and the results get richer vocabulary, sharper questions and better-targeted gaps.

## What a pack may extend

| Extension point | Canonical object | Example |
| --- | --- | --- |
| Qualification dimensions, criteria and evidence rules | OBJ-093 QualificationDefinition | MEDDPICC's eight dimensions |
| Scoring rubrics, with intended and prohibited uses | OBJ-095 ScoreDefinition | JOLT indecision signals |
| Reusable plays and steps inside a Plan | OBJ-100 PlaybookDefinition | Challenger commercial-teaching play |
| Attribute sets on Relationship, Opportunity or Plan, recorded as expiring Insights | OBJ-070 Insight | Crossing the Chasm adopter segment |
| Buying-group role vocabulary, as Role projections with evidence | Party / Role / Relationship (D21) | Challenger "Mobilizer" |
| Account plan sections | OBJ-031 Plan (FR-ACCOUNTPLAN-001) | LAMP account strategy and political map |
| Coaching rubrics, opt-in only | OBJ-126 Competency (FR-EDU-001) | Trusted Advisor trust-equation reflection |
| Labels and prompts in results | Presentation only | "Economic buyer" instead of "budget authority" |

## What a pack must not do

- Add, remove, reorder or skip workflow steps.
- Change result mode, write intent, authority, budgets, policy gates or stop conditions.
- Introduce new canonical objects or vendor schemas.
- Turn a pack attribute into a permanent Party fact. Pack outputs are Insights with evidence, counter-evidence, expiry and permitted use (FR-QUALIFY-001).
- Score a person's character, trustworthiness or personality, customer or employee. Person-level coaching attributes stay opt-in, visible and appealable (SAFE-SURVEIL-001).

When two active packs disagree, both readings are shown with their evidence. NeoCRM does not average methodologies.

## Pack roster

| Pack | Source | Extends | Status |
| --- | --- | --- | --- |
| [MEDDIC / MEDDPICC](meddpicc.md) | Dunkel and Napoli, PTC, 1990s; Paper process and Competition added later | QualificationDefinition | Proposed reference instance (QD-001) |
| Crossing the Chasm | Geoffrey Moore, 1991 | Account and Relationship Insights: adopter segment, beachhead fit, whole-product gaps; feeds marketing intent and campaign workflows | Planned stub |
| Consultative Selling | Mack Hanan, 1970 | CustomerNeed and ValueHypothesis: quantified customer profit-improvement case | Planned stub |
| The Trusted Advisor | Maister, Green and Galford, 2000 | Opt-in seller self-reflection rubric on the trust equation; relationship-history prompts. Never a score of the customer's trust | Planned stub |
| LAMP (Large Account Management Process) | Miller Heiman | Account plan sections: account situation, goals and strategies, investment, political map | Planned stub |
| The Challenger Sale | Dixon and Adamson, 2011 | Buying-group role vocabulary (Mobilizer, Talker, Blocker) with evidence; commercial-teaching play | Planned stub |
| The JOLT Effect | Dixon and McKenna, 2022 | Opportunity Insights for customer indecision (valuation, information, outcome uncertainty) and a JOLT play | Planned stub |

Stubs become packs one at a time, each with a definition file shaped like [meddpicc.md](meddpicc.md): purpose, dimensions or attributes, evidence rules, states, expiry, permitted and prohibited use, traceability.

## Evidence plan

EXP-018 tests qualification packs (start with MEDDPICC, then compare a no-pack baseline). EXP-019 tests plays and account plan sections. EXP-023 tests coaching rubrics under its surveillance hard stop. A pack is not "supported" until its own fixture has run.
