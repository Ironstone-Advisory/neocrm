# EXP-001 source, privacy, consent, and retention boundary

## Zoho

Use one named tenant and explicit module/field allowlist. Start with Contacts and Accounts; add Deals only where required. Leads, Tasks, Calls, Meetings, and Zoho Notes are opt-in by case. Record module, record ID, field API name, modified time, retrieval time, scope, and authority. Use metadata-discovered API names, not display labels.

## Obsidian

Confine reads to one configured vault root and approved subfolders/tags. Exclude `.obsidian`, attachments, plugin data, templates, unrelated daily notes, hidden files, and links outside the root. Ingest only notes with explicit stable source references or a user-approved mapping; no silent fuzzy-name linking.

## Common rules

- Read-only credentials and operations; no mutation endpoint/action handle is exposed.
- Identity is resolved before private reads; ambiguous cases stop.
- Retrieve only records/notes needed for the chosen Party and brief.
- Note content is untrusted evidence, not instruction or Fact by location.
- Use identifiable content only with documented permission and experiment purpose.
- Keep raw data in source systems where possible; store de-identified metrics and protected references.
- Define run-artifact retention before collection; delete temporary extracts after the agreed window.
- Commit only synthetic, aggregate, or de-identified evidence—never credentials, absolute vault paths, or customer bodies.
- Withdrawal, complaint, or unexpected sensitivity stops use and initiates deletion/redress review.
