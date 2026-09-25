# Article evidence ledger

**Article:** [From Database-First to AI-First, Agent-Native CRM](draft.md)  
**Ledger status:** Repository evidence locked to a verified remote commit and green CI run; live/human evidence remains pending  
**Local verification date:** 2026-09-23  
**Evidence commit SHA:** `89deab05afeff012a0024c8ad1ec779e80d4b56a`  
**Evidence commit permalink:** [89deab05afeff012a0024c8ad1ec779e80d4b56a](https://github.com/Ironstone-Advisory/neocrm/commit/89deab05afeff012a0024c8ad1ec779e80d4b56a)  
**Green CI run:** [ci run 35950651549](https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549)

This ledger is the claim boundary for the article. A specification describes an intended contract; a synthetic fixture demonstrates bounded implementation behaviour; neither is evidence of live user or business value.

## Evidence tiers

| Tier | Meaning |
| --- | --- |
| **Concept** | Originating proposition or design principle. Not a current-capability claim. |
| **Specification** | Versioned intended architecture, semantic contract, requirement or experiment protocol. |
| **Synthetic Fixture** | Behaviour observed with committed synthetic inputs in a controlled local path. |
| **Automated Evaluation** | Reproducible tests or evaluator output over synthetic cases. |
| **Live Pilot** | Behaviour observed with permissioned live systems and data. |
| **Human Evaluation** | Recorded human usefulness, trust, effort or comparative assessment. |
| **Business Outcome** | Operational, customer, service, revenue or economic result with an appropriate comparison. |

## Concept and specification claims

| Claim used in the article | Tier | Exact source | Status | Final evidence link |
| --- | --- | --- | --- | --- |
| NeoCRM begins with AI agents and intelligence as the organizing principle rather than AI added to forms and schemas. | Concept | `spec/vision/origin.md`; `spec/vision/thesis.md` | Preserved origin and adopted product thesis; not an empirical result. | [origin](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/vision/origin.md) |
| NeoCRM has seven logical layers: Presentation, Agent, Relationship Orchestration, Context/Data Access, Hybrid Storage, Integration and Infrastructure. | Specification | `spec/architecture/seven-layer-architecture.md`; `spec/architecture/diagrams/layered-architecture.mmd` | Specified. The number seven describes logical responsibilities, not deployed services. | [architecture](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/architecture/seven-layer-architecture.md) |
| Canonical Semantics and Governance/Control cross all seven layers. | Specification | `spec/architecture/seven-layer-architecture.md`; `spec/architecture/diagrams/layered-architecture.mmd` | Specified; not a claim of complete implementation. | [architecture](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/architecture/seven-layer-architecture.md) |
| The Relationship Intelligence Layer spans Layers 2-4 without collapsing Agent Runtime, Orchestration and Context/Data Access. | Specification | `spec/architecture/relationship-intelligence-plane.md`; `spec/decisions/ADR-0010-ril-layer-boundaries.md` | Specified; CAP-001 implements only a deterministic subset. | [RIL boundaries](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/architecture/relationship-intelligence-plane.md) |
| Sales, service and marketing/engagement are perspectives over shared relationship semantics. | Specification | `spec/product/product-definition.md`; `spec/product/business-capabilities.md`; domain files under `spec/domain/model/` | Specified product model; no production cross-functional workflow has been demonstrated. | [product definition](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/product/product-definition.md) |
| Party, Role and Relationship are distinct, and Customer is a contextual Role. | Specification | `spec/domain/model/party.md`; `spec/domain/model/relationship.md`; `spec/decisions/ADR-0003-party-types-and-business-roles.md`; `spec/decisions/ADR-0009-customer-as-party-role.md` | Specified and represented in current contracts. | [party model](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/domain/model/party.md) |
| Offer/Product/Service are distinct from Opportunity/Deal/Contract. | Specification | `spec/domain/model/commercial.md`; `spec/decisions/ADR-0008-commercial-object-separation.md` | Specified; not a claim that every source maps without loss. | [commercial model](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/domain/model/commercial.md) |
| Activity, Message and Conversation are canonical concepts; channels are implementations. | Specification | `spec/domain/model/activity.md`; `spec/decisions/ADR-0007-activity-message-and-conversation.md` | Specified. | [activity model](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/domain/model/activity.md) |
| Time is a domain and Calendar is a view. | Specification | `spec/domain/model/time.md`; `spec/architecture/temporal-model.md`; `spec/decisions/ADR-0004-time-as-a-domain-calendar-as-a-view.md` | Specified; no live calendar experiment has been completed. | [temporal model](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/architecture/temporal-model.md) |
| Proactivity and outcome learning are policy-bound and may not silently self-modify agents or policy. | Specification | `spec/vision/principles.md`; `spec/architecture/outcome-learning-and-evaluation.md`; `spec/decisions/ADR-0013-governed-outcome-learning.md` | Specified; no adaptive production learning loop exists. | [learning governance](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/spec/architecture/outcome-learning-and-evaluation.md) |
| CAP-001 and EXP-001 are different: CAP-001 is a capability; EXP-001 is the A/B/C product experiment. | Specification | `spec/capabilities/CAP-001-relationship-brief/spec.md`; `experiments/EXP-001-zoho-obsidian-relationship-brief/spec.md` | Specified and traceable. EXP-001 remains Planned. | [EXP-001](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/experiments/EXP-001-zoho-obsidian-relationship-brief/spec.md) |
| EXP-001 has Conditions A (Zoho baseline), B (NeoCRM + Zoho) and C (NeoCRM + Zoho + Obsidian). | Specification | `experiments/EXP-001-zoho-obsidian-relationship-brief/spec.md`; `conditions/A-zoho-baseline.md`; `conditions/B-neocrm-zoho.md`; `conditions/C-neocrm-zoho-obsidian.md` | Preregistered design. Only synthetic B/C paths are currently runnable. | [EXP-001](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/experiments/EXP-001-zoho-obsidian-relationship-brief/spec.md) |

## Current implementation and synthetic-fixture claims

| Claim used in the article | Tier | Exact source/test/command | Observed status | Final evidence link |
| --- | --- | --- | --- | --- |
| The executable slice is deterministic and read-only and implements bounded Agent, Goal, Plan and Run contracts around `RelationshipBriefAgent`. | Synthetic Fixture | `packages/agent-runtime/`; `spec/contracts/agent-runtime.schema.json`; `test/agent-runtime.test.mjs`; `packages/agent-runtime/README.md` | Verified locally. This is one bounded Agent role, not a production multi-agent workforce. | [agent runtime](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/packages/agent-runtime/README.md) |
| Identity is resolved before private retrieval, context planning is minimum-necessary, source content is treated as untrusted and action fails closed. | Automated Evaluation | `test/agent-runtime.test.mjs`; `test/relationship-intelligence.test.mjs`; `test/safety.test.mjs`; `test/integration.test.mjs` via `node --test` | Verified locally over synthetic cases. | [green CI](https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549) |
| External writes and durable conversational memory are disabled in the current slice. | Automated Evaluation | `spec/capabilities/CAP-001-relationship-brief/requirements.md`; `test/safety.test.mjs`; `test/conversation.test.mjs`; response contract in `spec/contracts/capabilities/cap-001.schema.json` | Verified locally over the tested paths. This is not proof against every possible production defect. | [green CI](https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549) |
| The Zoho adapter is production-shaped and GET-only for CRM data; OAuth token exchange is its sole permitted POST. | Automated Evaluation | `adapters/zoho/README.md`; `test/zoho-adapter.test.mjs` | Verified locally with injected synthetic HTTP transport. No live tenant result exists. | [Zoho adapter](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/adapters/zoho/README.md) |
| The Obsidian adapter confines reads to an approved vault boundary and treats note instructions as untrusted content. | Automated Evaluation | `adapters/obsidian/README.md`; `test/obsidian-adapter.test.mjs`; synthetic vault under `experiments/fixtures/synthetic-obsidian-vault/` | Verified locally with committed synthetic Markdown. No private vault result exists. | [Obsidian adapter](https://github.com/Ironstone-Advisory/neocrm/blob/89deab05afeff012a0024c8ad1ec779e80d4b56a/adapters/obsidian/README.md) |
| Synthetic fixture Conditions B and C are runnable through the same agent, context and adapter contracts. | Synthetic Fixture | `test/exp001-cli.test.mjs`; `experiments/EXP-001-zoho-obsidian-relationship-brief/fixture-results.md`; commands shown below | Verified locally for B and C. Condition A is a human baseline and has no CLI run. | [green CI](https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549) |

Fixture commands:

```text
node apps/experiment-cli/src/cli.mjs --mode fixture --condition B --query "What do I need to know before I speak with Alex Rivera?"
node apps/experiment-cli/src/cli.mjs --mode fixture --condition C --query "What do I need to know before I speak with Alex Rivera?"
```

## Quantitative pre-publication evidence

| Quantitative claim | Tier | Exact command | Local result on 2026-09-23 | Source artifacts | Final evidence link |
| --- | --- | --- | --- | --- | --- |
| **356 typed specification nodes / 475 typed links** | Automated Evaluation | `node scripts/validate-spec.mjs` | PASS: `spec validation passed: 356 typed nodes, 475 typed links` | `spec/traceability.json`; `spec/traceability.schema.json`; `scripts/validate-spec.mjs` | Local architecture-review check 2026-09-24; remote CI pending publication. |
| **6/6 mutation tests passed** | Automated Evaluation | `node --test test/eval-mutations.test.mjs` | PASS: 6 tests, 6 passed, 0 failed | `test/eval-mutations.test.mjs` | [green CI](https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549) |
| **EVAL-001 executed 12/12 cases** | Automated Evaluation | `node evals/run-eval.mjs` | PASS: 12 required, 12 executed | `evals/run-eval.mjs`; `evals/questions.json`; `evals/rubric.json` | [green CI](https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549) |
| **EVAL-001 scored 100/100** | Automated Evaluation | `node evals/run-eval.mjs` | PASS: weighted score 100, maximum 100, passing score 85 | Same as above | [green CI](https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549) |
| **EVAL-001 passed 7/7 safety gates** | Automated Evaluation | `node evals/run-eval.mjs` | PASS: all seven declared gates passed | Same as above | [green CI](https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549) |

These results overlap with the full repository test run, which includes the EVAL-001 execution test and the six mutation cases. They must not be added together or described as independent product evidence.

## Evidence that does not yet exist

| Claim area | Required evidence | Current status | Publication rule |
| --- | --- | --- | --- |
| Live Zoho retrieval | Permissioned tenant, frozen configuration, de-identified run record and successful hard-stop review | **Pending** | Do not claim live Zoho operation. Official API documentation alone is not runtime evidence. |
| Live Obsidian retrieval | Permissioned vault, documented allowlist, de-identified run record and boundary review | **Pending** | Do not claim operation on a private/live vault. |
| EXP-001 user value | Completed A/B/C cases, frozen preregistration, paired results and limitations | **Pending** | Describe EXP-001 as Planned. |
| Human usefulness/trust | Human evaluation using `human-evaluation.md`, including errors and negative feedback | **Pending** | Automated usefulness proxy must not be presented as human usefulness. |
| Reduced preparation time or administrative burden | Condition A timing compared with B/C under the protocol | **Pending** | Do not claim time savings. |
| Multi-agent collaboration | Implemented and evaluated specialist-agent runtime and handoffs | **Pending** | Describe the multi-agent model as specified product vision only. |
| Proactive external action | Policy-authorized implementation, consent, approval, execution, verification and audit evidence | **Out of scope for v0.1** | Do not imply autonomous customer contact. |
| Customer or service outcome | Appropriate observation window, measures, cases and harm review | **Pending** | Do not claim customer or service improvement. |
| Revenue, retention or expansion effect | Credible longitudinal or comparative causal evidence | **Pending** | Do not claim business impact. |
| Production security/compliance | Threat model, deployment controls, independent review and applicable assurance | **Pending** | Do not call the system production-secure or compliant. |

## Finalization record

Repository evidence is locked; publication venue and figure export remain open:

- Evidence commit SHA: `89deab05afeff012a0024c8ad1ec779e80d4b56a`
- Commit permalink: https://github.com/Ironstone-Advisory/neocrm/commit/89deab05afeff012a0024c8ad1ec779e80d4b56a
- CI workflow and run: https://github.com/Ironstone-Advisory/neocrm/actions/runs/35950651549
- Article publication URL: `{{ARTICLE_URL}}`
- Architecture image URL: `{{ARCHITECTURE_FIGURE_URL}}`
- Final repository verification date: `2026-09-23`
- Evidence review: business architecture, technical architecture, implementation QA, specification QA, and GitHub CI
- Human/live result status at repository publication: not run; EXP-001 remains Planned
