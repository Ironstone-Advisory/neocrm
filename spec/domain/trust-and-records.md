# Trust, archive, and readable records

**Status:** Accepted specification; Planned implementation and evidence

Trust records preserve what was known, proposed, authorized, done, verified, and disposed without confusing history with current truth.

- **OBJ-077 RecordSnapshot** — immutable, time-bound representation of selected source or canonical state with subject, source version, captured time, schema/mapping version, provenance, classification, hash, and gaps. It is evidence, not automatically current Fact.
- **OBJ-078 ArchiveManifest** — inventory of archived snapshots and related evidence, coverage, custody, integrity checks, format, access policy, export/restore ability, and omissions.
- **OBJ-079 RetentionSchedule** — versioned purpose/classification/jurisdiction rule defining minimum/maximum retention, review, archive, redaction, disposition, and owner.
- **OBJ-080 LegalHold** — authorized suspension of disposition for exact subjects/categories/time ranges with issuer, reason, effective/release time, scope, notice, and audit.
- **OBJ-081 DispositionEvent** — append-only record of retain, archive, redact, suppress, export, destroy-at-source, or other disposition proposal/decision/execution/verification. Destruction requires ADR-0017 authorization.
- **OBJ-082 HumanReadableReceipt** — plain-language rendering linked to machine events that identifies principal, purpose, sources/targets, material inputs, action, authority, time, result, verification, cost, correction/reversal path, and retained evidence.

Snapshots and manifests use open, documented formats where feasible. A readable receipt never substitutes for machine-verifiable audit evidence, and neither may expose credentials, hidden reasoning, or unnecessary private content.
