# NeoCRM

NeoCRM is Ironstone Advisory's relationship operating system: a workspace that makes the people, organizations, conversations, commitments, and commercial work around a relationship visible in one place.

This repository is the v0.1 foundation. It turns a collection of useful CRM ideas into one coherent product model before adding third-party integrations or automation.

## v0.1 outcome

A user can work in a tenant-scoped workspace and:

- keep a shared record for each person and organization;
- capture how those parties relate to one another;
- record calls, notes, emails, meetings, and calendar events on a durable activity timeline;
- manage tasks and follow-ups;
- track offerings, opportunities, and agreements/engagements; and
- see the commercial and relationship context together.

The first release deliberately does **not** include email/calendar sync, marketing automation, AI actions, mobile clients, or a generic workflow builder. Those become extensions once the canonical relationship graph and activity record are dependable.

## Product and technical direction

- The domain starts with a single `Party` concept, specialized as a person or organization. A contact is never detached from the organization and relationships around it.
- Activities are append-first timeline facts. Tasks are work to be done, rather than historical activity.
- Opportunities and agreements are commercial records connected to the relevant parties and offerings.
- Each record belongs to exactly one workspace; tenant scoping is an application invariant and database field on every aggregate.
- v0.1 is a modular monolith: one TypeScript API and one PostgreSQL database, with explicit module boundaries. It keeps deployment simple while avoiding a future rewrite into microservices.
- API contracts and database migrations are the source of truth for the first implementation; integrations arrive through adapter/outbox boundaries later.

Read the detailed material before changing the model:

- [Product definition](docs/product/v0.1.md)
- [Architecture](docs/architecture.md)
- [Domain model and invariants](docs/domain-model.md)
- [API surface](docs/api.md)
- [Initial PostgreSQL migration](db/migrations/0001_initial.sql)

## Repository layout

```text
apps/api/              Minimal Fastify API entry point
packages/domain/       Dependency-free TypeScript domain contracts
db/migrations/         PostgreSQL schema migrations
docs/                  Product, architecture, data, and API decisions
```

## Local development

Prerequisites: Node.js 22+, pnpm 9+, and PostgreSQL 16+.

```sh
pnpm install
pnpm build
pnpm --filter @neocrm/api dev
```

The API currently exposes `GET /health` and `GET /v1/meta`. The domain contracts and database migration define the next endpoints; their implementation is intentionally tracked as work rather than presented as complete.

## Delivery status

This is an intentional **foundation commit**, not a production deployment. Authentication, authorization, persistence adapters, user interface, data migration, observability, integrations, and endpoint implementation remain to be built. See the implementation gaps in [the v0.1 product document](docs/product/v0.1.md#implementation-sequence-and-gaps).
