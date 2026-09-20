# API surface — v0.1 contract

All routes are under `/v1`. Authentication and workspace selection are not yet implemented, but every protected request must resolve a workspace context. Responses use ISO 8601 UTC timestamps and opaque UUIDs.

## Current bootstrap routes

| Method | Route | Purpose | Status |
| --- | --- | --- | --- |
| GET | `/health` | Process liveness | Implemented |
| GET | `/v1/meta` | Domain version and supported party kinds | Implemented |

## Planned resource routes

| Area | Routes | Notes |
| --- | --- | --- |
| Parties | `GET/POST /parties`, `GET/PATCH /parties/:id` | Filter by kind, lifecycle, name; details follow party kind. |
| Relationships | `GET/POST /parties/:id/relationships`, `PATCH /relationships/:id` | Validate same workspace and distinct source/target parties. |
| Activities | `GET/POST /activities`, `GET /parties/:id/timeline` | Cursor paginate reverse-chronological timeline; accept multiple participants. |
| Work | `GET/POST /work-items`, `PATCH /work-items/:id` | Queue filters: assignee, status, due range, party, opportunity. |
| Offerings | `GET/POST /offerings`, `PATCH /offerings/:id` | Product/service catalogue. |
| Opportunities | `GET/POST /opportunities`, `GET/PATCH /opportunities/:id` | Support participant set and controlled stage transitions. |
| Agreements | `GET/POST /agreements`, `GET/PATCH /agreements/:id` | Supports participant set and optional originating opportunity. |
| Search | `GET /search?q=` | Implement only after authorization and relevance rules are tested. |

## Write behavior

- Require an idempotency key for connector-originated create commands; web UI commands may use server-generated request IDs until a formal idempotency policy lands.
- Return `201 Created` with the canonical record on a successful create.
- Return `409 Conflict` for violated state transitions or uniqueness requirements, `422 Unprocessable Content` for validation failures, and `404 Not Found` for records outside the current workspace as well as absent records.
- Use optimistic concurrency (`updated_at`/ETag) before the UI supports competing edits.
- Record actor, request ID, and before/after values in an audit facility before production use.

## Pagination and filtering

List routes use opaque `cursor` and bounded `limit` values. Timeline and activity lists sort by `occurred_at DESC, id DESC`. Filters are explicit; no endpoint implicitly queries across workspaces.
