# Quality requirements

**Status:** Provisional

- **NFR-REL-001 Reliability** — Partial, failed, denied, or stale sources MUST
  remain visible and MUST NOT be silently interpreted as no data.
- **NFR-OBS-001 Observability** — Each request MUST emit structured lifecycle
  events with a trace identifier, stage, duration or counts, and outcome. Logs
  MUST exclude hidden chain-of-thought, credentials, and raw private source
  bodies.
- **NFR-PORT-001 Portability** — Replacing an adapter MUST NOT require changing
  the canonical semantic model or user intent.
- **NFR-TEST-001 Reproducibility** — The CAP-001 reference path MUST run against
  versioned synthetic fixtures with a fixed clock and deterministic output.

