# Domain model and invariants

## Canonical concepts

| Concept | Meaning | Key relationships |
| --- | --- | --- |
| Workspace | Tenant boundary for data and membership. | Owns every business record. |
| User | Authenticated actor. | May belong to many workspaces. |
| Party | A person or organization with a reusable relationship identity. | Participates in relationships, activities, opportunities, and agreements. |
| Party relationship | A typed, directed, date-aware link between two parties. | Examples: works_at, advises, is_client_of, introduced_by. |
| Activity | A factual interaction or timeline item. | Can involve many parties and optionally an opportunity/agreement. |
| Work item | A future commitment or follow-up. | May point to a party or opportunity. |
| Offering | A product or service being sold or delivered. | Can be selected by opportunities. |
| Opportunity | A potential commercial outcome. | Has many participating parties and an optional offering. |
| Agreement | A signed or proposed engagement/contractual record. | May originate from an opportunity and has participating parties. |

## Party graph

`Party` is the primary identity aggregate. It has exactly one kind: `person` or `organization`. Kind-specific attributes live in `person_details` or `organization_details`.

This prevents the common CRM failure mode where a contact copied into a deal loses its history or where an organization is merely a text field. A party may appear in any number of commercial records and activities without duplicate identity data.

`party_relationships` is directed so it can express distinct roles cleanly. Consumers may render a reciprocal label, but must not assume one exists. Relationship types begin as controlled workspace vocabulary; a global ontology can follow after pilot usage demonstrates what must be standardized.

## Timeline and work

Activities represent things that happened or a scheduled calendar event. They have an occurrence time, kind, direction, body/metadata, and participants. A scheduled meeting can carry `starts_at` and `ends_at`; an email or call generally only needs `occurred_at`.

A work item represents a thing that still needs attention. It is intentionally separate from activity so that closing a task does not rewrite history and a historical activity does not clutter the work queue.

## Commercial model

An offering is a reusable product or service definition. An opportunity represents a potential sale/engagement and progresses through a small, explicit pipeline. Agreement captures the resulting or proposed engagement. Party participation is separate join data rather than a single `account` or `contact` field, allowing sponsors, clients, partners, and decision-makers to be represented accurately.

Amounts are stored with ISO currency codes. v0.1 does not calculate FX conversion.

## Non-negotiable invariants

1. Every business record belongs to one workspace.
2. A cross-record reference must stay within the same workspace.
3. A party relationship cannot point from a party to itself.
4. A person or organization is never duplicated merely to appear in a new opportunity or agreement.
5. Activities preserve the fact of an interaction; use an auditable edit/change policy rather than destructive rewrites.
6. Tasks are work state, not historical activity state.
7. Relationship type, participant role, lifecycle stage, and pipeline stage are controlled values; new values require product review.
8. External identifiers are references, never NeoCRM's primary identity.

## Naming decisions

The database uses **agreement** as the neutral core term. The UI can label an agreement as an engagement, contract, mandate, or other business-friendly term. Likewise, **party** is an implementation term; the UI should normally say person, organization, contact, or company.
