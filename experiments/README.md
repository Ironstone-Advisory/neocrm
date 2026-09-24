# Experiments

Experiments change one major capability at a time so a better result can be
attributed to a specific design choice. All use versioned synthetic fixtures
before any real customer data.

| Sequence | Change introduced | Primary question |
| --- | --- | --- |
| EXP-001 | CRM-only baseline | What can structured operational data answer alone? |
| EXP-002 | Chat over CRM | Does conversational access improve usefulness without new sources? |
| EXP-003 | Knowledge context | What changes when notes, email, and calendar are added? |
| EXP-004 | Semantic routing | Does capability-aware planning improve relevance and portability? |
| EXP-005 | Epistemic discipline | Do provenance, conflicts, and unknowns improve trust? |
| EXP-006 | Unified brief demonstration | Does the integrated slice materially improve conversation preparation? (Demonstrated structurally; experimental validation pending.) |

Every experiment follows [`template.md`](template.md). Results are evidence,
not specifications; a decision changes status only through the lifecycle in
`spec/README.md`.
