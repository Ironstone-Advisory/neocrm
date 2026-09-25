# Identity and data-quality lifecycle

**Status:** Accepted specification; Planned implementation and evidence

- **OBJ-083 IdentityResolutionDecision** — accepted, rejected, ambiguous, or deferred linkage among canonical and native identities, with candidates, evidence, counter-evidence, resolver, confidence semantics, effective time, and correction history.
- **OBJ-084 DuplicateCandidate** — proposed duplicate pair/set with detection method/version, evidence, conflicting attributes, risk, disposition, and expiry. It never merges records by itself.
- **OBJ-085 EnrichmentProposal** — externally supplied candidate data with vendor/source, collection time, evidence, licensing/use limits, confidence, expiry, and accept/reject/correct disposition.
- **OBJ-086 ReconciliationDecision** — explicit decision selecting, combining, rejecting, or preserving conflicting claims, including authority rationale, reviewer/policy, effective interval, downstream effects, and reversibility.
- **OBJ-087 SyncReceipt** — readable and machine-linked account of attempted source synchronization: mapping/version, direction, records/fields, changed/unchanged/skipped/conflicted/failed counts, per-target results, verification, and retry/compensation state.
- **OBJ-088 DataQualityIssue** — versioned observation of completeness, validity, consistency, duplication, freshness, lineage, or policy failure with impact, affected subjects, evidence, owner, status, resolution, and recurrence.

The lifecycle is `observe -> propose -> review/policy -> decide -> act under authority -> verify -> receipt -> monitor/correct`. Enrichment never becomes fact merely because a vendor or model supplied it.
