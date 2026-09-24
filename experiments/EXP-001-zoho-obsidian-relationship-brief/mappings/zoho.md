# Zoho mapping for EXP-001

| Zoho source | Canonical interpretation | Rule |
| --- | --- | --- |
| Contact | Person plus source identity/contact evidence | Never automatically Customer. |
| Account | Company plus source identity/organizational evidence | Never automatically Customer. |
| Lead | Person or Company plus contextual Prospect Role | Lead is adapter vocabulary, not a Party type. |
| Deal | Normally Opportunity; map to Deal only when process semantics establish a specific transaction | Preserve stage, amount, owner, dates, and mapping limitations. |
| Task/Call/Meeting | WorkItem or Activity/Event as applicable | Preserve occurrence/due time and native state. |
| Note | Knowledge/Evidence with author/time/provenance | Not Fact merely because attached to a record. |

Roles and Relationships are derived only from mapped fields/evidence under explicit rules. Authority is declared by concept/field and remains independent of freshness, confidence, completeness, and epistemic category.
