# NeoCRM

NeoCRM is an experimental, chatbot-first relationship-intelligence system. It
assembles governed context about people, companies, households, relationships,
commercial matters, activity, knowledge, and time without making any source
system's schema the product model.

> NeoCRM owns the semantic model, not the storage model. Persistence is
> replaceable; intelligence, provenance, and human control are not.

## Current experiment

[CAP-001 Relationship Brief](spec/capabilities/CAP-001-relationship-brief/spec.md)
answers:

> What do I need to know before I speak with this person?

The reference slice is deliberately read-only:

```text
apps/assistant
  -> packages/relationship-intelligence
  -> normative contracts and policy
  -> adapters/mock
  -> synthetic multi-source fixture
```

It returns facts, observations, hypotheses, unknowns, conflicts,
recommendations, and evidence as distinct structures. External actions remain
disabled.

## Repository contract

| Path | Responsibility |
| --- | --- |
| [`spec/`](spec/README.md) | Authoritative product, domain, experience, requirements, architecture, decisions, and capability specifications |
| [`experiments/`](experiments/README.md) | Causal experiments and synthetic fixtures |
| [`evals/`](evals/README.md) | Reusable questions, rubrics, and deterministic evaluation |
| [`apps/assistant/`](apps/assistant/README.md) | Chat-first reference experience |
| [`packages/contracts/`](packages/contracts/README.md) | TypeScript projection of normative JSON Schemas |
| [`packages/relationship-intelligence/`](packages/relationship-intelligence/README.md) | Read-only orchestration and context assembly |
| [`adapters/mock/`](adapters/mock/README.md) | Deterministic source adapters |
| [`prototypes/transactional-crm-v0/`](prototypes/transactional-crm-v0/README.md) | Preserved, non-authoritative Fastify/PostgreSQL prototype |

## Run

Requires Node.js 22+ and pnpm 9+.

```sh
pnpm install
pnpm check
pnpm demo -- "What do I need to know before I speak with Alex Chen?"
```

`pnpm check` validates specification traceability, checks the TypeScript
contract projection, and runs contract, conversation, integration, safety, and
end-to-end tests.

## Status

The semantic architecture and implementation are experimental. Decisions are
Provisional until their linked experiment and evaluation evidence satisfies
the acceptance rules in [the specification authority](spec/README.md).

