# NeoCRM

NeoCRM is an experiment in **agent-native customer relationship management**. It explores how people and governed specialist agents can understand and manage unified relationships across sales, service, marketing, and cross-functional work without making one vendor schema the product.

The product is organized around relationship goals, shared context, human-agent collaboration, policy-bound proactive work, governed action, and learning from measured outcomes. Conversation is one experience; it is not the product boundary.

> NeoCRM owns the semantic model, not the storage model.
>
> Persistence is replaceable. Intelligence is not.
>
> Calendar = View; Time = Domain.
>
> NeoCRM doesn't own the world's data. It creates a coherent model of the relationships represented by that data.

## Architectural baseline

NeoCRM defines seven logical layers: Presentation; Agent; Business Logic / Relationship Orchestration; Data Access / Context; Hybrid Data Storage; Integration / Ecosystem; and Infrastructure / Resilience. Canonical Semantics and Governance / Control are cross-cutting planes.

The Relationship Intelligence Layer spans the Agent, Relationship Orchestration, and Context / Data Access layers while preserving their separate contracts. See the [canonical specification](spec/canonical/NeoCRM-v0.1-Canonical-Specification.md) and [seven-layer architecture](spec/architecture/seven-layer-architecture.md).

## Current evidence boundary

The executable code is **CAP-001** plus a thin, deterministic, read-only **EXP-001 reference path**. It demonstrates bounded Agent/Goal/Plan/Run contracts, identity resolution, minimum-necessary context planning, normalization, provenance, epistemic response, failure handling, conversation continuity, record-only feedback, and fail-closed action policy.

The repository now includes configurable read-only Zoho and Obsidian adapters and a fixture-backed RelationshipBriefAgent. This is not the complete NeoCRM product, Agent layer, or RIL. It has no production LLM, completed live pilot, multi-Agent collaboration, hybrid persistence implementation, external execution, or adaptive production outcome-learning loop. External writes remain impossible in this slice.

The first product experiment, [EXP-001](experiments/EXP-001-zoho-obsidian-relationship-brief/spec.md), compares a Zoho baseline with NeoCRM over Zoho and then Zoho plus permissioned Obsidian context. Its live and human evidence is still pending.

## Repository map

| Path | Responsibility |
| --- | --- |
| [`spec/`](spec/README.md) | Product authority: origin, canonical design, domain, architecture, experience, requirements, decisions, and capability scopes |
| [`experiments/`](experiments/README.md) | Unique EXP-001 through EXP-012 hypotheses, protocols, and evidence records |
| [`evals/`](evals/README.md) | Bounded repeatable evaluations; EVAL-001 covers only CAP-001 |
| [`apps/assistant/`](apps/assistant/README.md) | Deterministic conversational reference shell for CAP-001 |
| [`packages/contracts/`](packages/contracts/README.md) | Generated projection of the CAP-001 exchange schema |
| [`packages/relationship-intelligence/`](packages/relationship-intelligence/README.md) | Deterministic CAP-001 context engine; not the complete RIL |
| [`adapters/mock/`](adapters/mock/README.md) | Synthetic source adapters |
| [`packages/agent-runtime/`](packages/agent-runtime/README.md) | Bounded RelationshipBriefAgent run, policy, audit, and feedback contracts |
| [`packages/context-engine/`](packages/context-engine/README.md) | Credential-isolating context boundary over CAP-001 |
| [`adapters/zoho/`](adapters/zoho/README.md) | Configurable production-shaped Zoho GET-only adapter |
| [`adapters/obsidian/`](adapters/obsidian/README.md) | Vault-confined Markdown read-only adapter |
| [`apps/experiment-cli/`](apps/experiment-cli/README.md) | Fixture-first EXP-001 runner and opt-in live preflight/smoke path |
| [`prototypes/transactional-crm-v0/`](prototypes/transactional-crm-v0/README.md) | Preserved, non-authoritative transactional prototype history |

## Validate the current slice

Requires Node.js 22+ and pnpm 9+.

```sh
pnpm install
pnpm check
pnpm demo -- "What do I need to know before I speak with Alex Chen?"
pnpm exp:001 -- --preflight --mode fixture --condition C
pnpm exp:001 -- --mode fixture --condition C --query "What do I need to know before I speak with Alex Rivera?"
```

`pnpm check` validates specification traceability, repository-relative links, article claims, generated CAP-001 contracts, TypeScript, implementation tests, safety tests, and the deterministic CAP-001 evaluation. Passing it is implementation evidence for this slice, not proof of the broader product hypothesis.
