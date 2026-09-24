# Context engine

`IMP-007 - Status: Implemented`

This package is the credential-isolating context boundary for the bounded EXP-001 reference path. The agent runtime passes a goal and trigger; it never receives adapter credentials or handles. The boundary invokes CAP-001's identity-first, read-only relationship-intelligence pipeline and returns only the validated brief.

The implementation is intentionally thin. It is not the complete context/data-access layer described by the canonical architecture.
