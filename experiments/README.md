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
| [EXP-013](EXP-013-conversation-intelligence/spec.md) | Evidence-linked conversation intelligence | Planned |
| [EXP-014](EXP-014-consent-aware-follow-up/spec.md) | Consent-aware intelligent follow-up, draft first | Planned |
| [EXP-015](EXP-015-multi-workflow-zoho-write/spec.md) | Governed multi-workflow Zoho writes | Planned |
| [EXP-016](EXP-016-governed-obsidian-artifact-write/spec.md) | Governed Obsidian artifact writes | Planned |
| [EXP-017](EXP-017-trust-archive-and-data-quality/spec.md) | Trust Archive and data-quality lifecycle | Planned |
| [EXP-018](EXP-018-qualification-metrics-and-forecast/spec.md) | Qualification, metrics, and forecasting | Planned |
| [EXP-019](EXP-019-sales-playbooks-buying-groups-and-account-plans/spec.md) | Sales playbooks, buying groups, and account plans | Planned |
| [EXP-020](EXP-020-marketing-treatment-journey-and-inbound/spec.md) | Marketing treatments, journeys, intent, and inbound | Planned |
| [EXP-021](EXP-021-customer-success-and-service-guard/spec.md) | Customer Success and Service Guard | Planned |
| [EXP-022](EXP-022-content-and-brand-intelligence/spec.md) | Content and brand intelligence | Planned |
| [EXP-023](EXP-023-education-and-enablement/spec.md) | Education and enablement | Planned |
| [EXP-024](EXP-024-bounded-supervisor-agent/spec.md) | Bounded supervisor agent | Planned |
| [EXP-025](EXP-025-packaging-metering-and-outcome-pricing/spec.md) | Packaging, metering, and outcome pricing | Planned |

[`archive/pre-canonical-staging/`](archive/pre-canonical-staging/README.md) preserves the earlier staged CRM/chat/context documents and their former conflicting IDs. Those filenames are historical labels only.

Every experiment follows [`template.md`](template.md), preregisters hypotheses/measures/stop rules, protects identifiable data, records negative/inconclusive results, and links claims only to evidence of the correct scope.

EXP-013 through EXP-025 follow the A-E evidence gates in EVAL-004. Accepted specifications are not implemented experiments. CAP-001 and EXP-001 remain read-only. EXP-015 and EXP-016 are the first Planned write experiments and require typed time-bounded grants; every deletion in any experiment requires a fresh exact human authorization for its immutable target list.
