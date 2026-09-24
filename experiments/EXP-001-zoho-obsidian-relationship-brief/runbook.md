# EXP-001 operator runbook

**Status:** Implemented fixture path; live and human evidence pending.

## Safety boundary

The runnable path is read-only. Zoho CRM calls are GET-only; the sole permitted POST is OAuth token exchange to the exact endpoint registered for the selected Zoho region. Obsidian has no write API. External writes and durable conversational memory are disabled. Do not put real customer data, vault copies, tokens, or per-person outputs in the repository.

## Fixture rehearsal (Windows PowerShell)

```powershell
corepack pnpm exp:001 -- --mode fixture --condition B --query "What do I need to know before I speak with Alex Rivera?"
corepack pnpm exp:001 -- --mode fixture --condition C --query "What do I need to know before I speak with Alex Rivera?"
corepack pnpm exp:001 -- --preflight --mode fixture --condition C
```

Condition B uses synthetic Zoho evidence. Condition C uses the same Zoho evidence plus the committed synthetic vault. Condition A is a timed human baseline and has no NeoCRM CLI run.

## Live preflight (content-free)

1. Copy `.env.example` values into operator-local environment variables. Do not commit `.env`.
2. Grant only Zoho read scopes and approve a minimal field/module allowlist.
3. Point Obsidian at one vault and an approved relationship-notes directory/tag.
4. Run:

```powershell
corepack pnpm exp:001 -- --preflight --mode live --live --condition C
```

The default preflight reports a plain-language, content-free readiness summary. It does not retrieve relationship content or print secrets. Add `--json` only when an operator needs the machine-readable diagnostic envelope containing origins, modules, allowlists, and approved vault boundary names.

For experiment runs, `--json` returns a body-free operational envelope only. It intentionally omits the rendered relationship brief so redirected output cannot become an accidental private-content log. Use the default human-readable mode to review a permissioned brief interactively.

## Opt-in live smoke (never CI)

Only after preflight is ready and the selected case is permissioned:

```powershell
corepack pnpm exp:001 -- --mode live --live --condition C --query "What do I need to know before I speak with <permissioned person>?"
```

Stop immediately on any wrong-person candidate, external-write attempt, vault-boundary error, secret/private-content log entry, or source instruction affecting behavior. Record only de-identified aggregate results using `results.template.md`. A successful smoke run is not product validation.
