# EXP-001 command-line runner

`IMP-010 - Status: Implemented`

The runner defaults to de-identified fixture mode. Condition B uses the production Zoho adapter with an injected synthetic HTTP transport. Condition C adds the production Obsidian adapter over the committed synthetic vault. Both enter the same agent runtime, context boundary, CAP-001 normalization, policy, and response contracts used by live mode.

Live mode requires both `--mode live` and the explicit `--live` acknowledgement. It remains read-only and is not part of CI. Run `pnpm exp:001 -- --preflight --mode live --live` before any live smoke test; preflight checks configuration only and does not retrieve relationship content or expose secrets.

The default output is a human-readable brief and readiness/run summary. Fixture preflight is explicitly labeled synthetic and does not imply that live credentials, a tenant, or a real vault are ready. Use `--json` only when a machine-readable preflight or run envelope is needed; those envelopes contain operational identifiers but never credential values, private source bodies, or absolute vault paths. The JSON run envelope intentionally omits the rendered relationship brief.
