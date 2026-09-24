# Canonical experiment registry

Experiment identifiers have one meaning across the repository. Plans, demonstrations, human results, and validation maturity are recorded separately; passing CAP-001 fixtures never validates a product hypothesis.

| ID | Canonical experiment | Status |
| --- | --- | --- |
| [EXP-001](EXP-001-zoho-obsidian-relationship-brief/spec.md) | Zoho + Obsidian relationship brief, conditions A/B/C | Planned; synthetic preflight only |
| [EXP-002](EXP-002-sheets-web-substrate/spec.md) | Google Sheets + web/Markdown knowledge substrate | Planned |
| [EXP-003](EXP-003-persistence-arrangement/spec.md) | Same questions/data with different persistence arrangements | Planned |
| [EXP-004](EXP-004-backend-substitution/spec.md) | Swap one backend without changing intelligence | Planned |
| [EXP-005](EXP-005-without-crm-ui/spec.md) | Complete selected work without the CRM UI | Planned |
| [EXP-006](EXP-006-semantic-routing-and-entity-resolution/spec.md) | Semantic routing and entity resolution | Demonstrated structurally; human/live validation pending |
| [EXP-007](EXP-007-epistemics-and-provenance/spec.md) | Epistemic categories and provenance | Planned; exercised by CAP-001 tests |
| [EXP-008](EXP-008-relationship-graph-recommendations/spec.md) | Relationship-graph recommendations | Planned |
| [EXP-009](EXP-009-activity-message-conversation/spec.md) | Activity, Message, and Conversation synthesis | Planned |
| [EXP-010](EXP-010-calendar-as-view/spec.md) | Calendar as a view over Time | Planned |
| [EXP-011](EXP-011-time-and-load-intelligence/spec.md) | Time and load intelligence | Planned |
| [EXP-012](EXP-012-temporal-relationship-analysis/spec.md) | Temporal relationship analysis | Planned |

[`archive/pre-canonical-staging/`](archive/pre-canonical-staging/README.md) preserves the earlier staged CRM/chat/context documents and their former conflicting IDs. Those filenames are historical labels only.

Every experiment follows [`template.md`](template.md), preregisters hypotheses/measures/stop rules, protects identifiable data, records negative/inconclusive results, and links claims only to evidence of the correct scope.
