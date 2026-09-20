# ADR 0001: Use a modular monolith built on a shared party graph

- Status: accepted
- Date: 2026-09-20

## Context

NeoCRM must unify relationship management, activity history, follow-up work, and commercial records. The initial product has a small team, unknown operating scale, and a high need for data consistency across these areas.

## Decision

Build v0.1 as a TypeScript modular monolith with PostgreSQL as the canonical transactional store. Model people and organizations as a shared `Party` aggregate, with typed, dated party relationships. Activities, work items, opportunities, and agreements reference parties through tenant-aware links.

Keep modules and connector adapters explicit, but do not deploy them independently in v0.1.

## Consequences

- Transactions and party 360-degree reads remain straightforward.
- The first deployment, authorization model, testing, and backup strategy are simpler.
- A future email/calendar/AI connector cannot define its own primary contact model; it must map to party and activity commands.
- If independent scaling is later justified, modules have boundaries that can be extracted without changing the canonical data semantics.
- The team must protect module boundaries in code review rather than relying on network boundaries.
