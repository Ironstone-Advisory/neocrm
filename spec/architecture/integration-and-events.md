# Integration and events

**Status:** Proposed

The Integration boundary connects NeoCRM to source systems, model providers, event producers, and effectors without leaking vendor semantics or credentials upward.

## Integration capabilities

An adapter declares supported reads, filters, subscriptions, proposals, executions, verifications, authority, freshness, permissions, rate limits, idempotency, reversibility, and mapping loss. A source system is not itself an adapter; the adapter is the governed boundary around it.

The ecosystem supports four contract families:

- **query/context:** bounded reads returning canonical evidence and source-state metadata;
- **events/subscriptions:** versioned EventEnvelopes with producer, principal, tenant, purpose, classification, time, correlation, causation, idempotency, schema, and payload reference;
- **commands/actions:** inert proposals routed through policy, approval, and the isolated action gateway;
- **outcomes/feedback:** verified results and attributed signals routed to evaluation, never directly to self-modification.

## Event rules

- Delivery is assumed at-least-once unless a connector proves stronger semantics; consumers are idempotent.
- Replayed, late, duplicate, retracted, and out-of-order events preserve occurrence and observation time.
- Event payloads are minimum necessary; sensitive bodies may remain in the source behind a governed reference.
- Events trigger evaluation and planning, not automatic authority.
- GraphQL, REST, webhooks, streams, files, or queues are replaceable transports.

Live Zoho and Obsidian adapters are deliberately absent from the current architect pass.
