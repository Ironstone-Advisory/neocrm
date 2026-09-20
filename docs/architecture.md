# NeoCRM architecture

## Chosen shape: modular monolith

v0.1 is one deployable API backed by one PostgreSQL database. The code is organized by domain modules, not technical layers:

- **identity and access:** users, workspace membership, roles, request context;
- **party graph:** people, organizations, relationships, source references;
- **activity:** notes, communications, meetings/events, activity participants;
- **work:** task assignment and follow-up queue;
- **commercial:** offerings, opportunities, agreements, and participants;
- **read models:** party 360 view, timeline, work queue, pipeline;
- **integration boundary:** future inbound adapters and an outbox for reliable external effects.

A modular monolith is deliberate. NeoCRM needs consistent joins and transactions across party, activity, and commercial data far more than independent deployment. Module boundaries are preserved in the codebase so an extraction can happen later if operational evidence requires it.

## Context

```text
Web client / future connectors
            |
            v
      TypeScript API
  request auth + workspace scope
            |
            v
Domain modules and application services
            |
            v
       PostgreSQL 16+
  canonical transactional source of truth
```

## Data and tenancy rules

- A request resolves one authenticated actor and one active workspace before invoking a domain operation.
- Every aggregate carries `workspace_id`; query code must never load a record by ID without workspace scope.
- The schema uses composite tenant-aware foreign keys for cross-aggregate links where practical.
- All persisted timestamps are UTC. Local timezone is an account/display concern.
- Records retain external references in JSONB during v0.1, avoiding premature connector-specific tables.
- Activities are append-first. Corrections are modelled as an auditable change path once auditing is implemented, not silent destruction.

## API and read model rules

The write API owns validation, authorization, and transaction boundaries. The party 360 view, timeline, work queue, and pipeline may use optimized query services, but must read only canonical module data. Do not let UI-specific denormalized state become a second source of truth.

REST is the v0.1 boundary because it is simple to inspect and supports both a web client and future connectors. Contract evolution is versioned under `/v1`; breaking changes require an ADR and a new version.

## Future integration pattern

Email, calendar, enrichment, document, and AI capabilities remain outside the core. A future connector receives data at an adapter boundary, maps it to canonical commands, and writes external side effects through an outbox. This avoids coupling the core party and activity models to one vendor's identifiers or webhook semantics.

## Security baseline

- Authenticate before workspace selection; authorize each operation using membership and record scope.
- Enforce tenant scoping in repositories and test for cross-workspace access failures.
- Avoid placing mailbox contents, credentials, or secrets in activity metadata.
- Add database row-level security only when the production authentication/connection model is selected; until then, application enforcement and integration tests are mandatory.
- Use managed secrets, encrypted transport, structured audit logging, backups, and retention rules before handling production client data.
