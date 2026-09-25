# Adapter boundaries

Adapters translate permissioned source evidence into NeoCRM contracts. They do not own canonical meaning, decide source authority, grant permissions, or execute policy merely because a connection exists.

## Discover capabilities

- [`_catalog/capability-intents.json`](_catalog/capability-intents.json) lists host-neutral read intents used by workflow definitions.
- [`_catalog/source-categories.json`](_catalog/source-categories.json) classifies source roles without making vendors canonical.
- [`_catalog/adapter-manifest.schema.json`](_catalog/adapter-manifest.schema.json) requires tenant/principal boundaries, freshness, pagination, missingness, cost/budget signals, fallback, effect classification, idempotency, verification, and authority declarations.

## Current adapters

| Adapter | Current boundary | Manifest |
| --- | --- | --- |
| [Mock](mock/README.md) | Deterministic synthetic CAP-001 reads | [Capability manifest](mock/adapter.manifest.json) |
| [Zoho CRM](zoho/README.md) | Regional, allowlisted, GET-only CAP-001 reads | [Capability manifest](zoho/adapter.manifest.json) |
| [Obsidian](obsidian/README.md) | Vault-confined, explicitly linked Markdown reads | [Capability manifest](obsidian/adapter.manifest.json) |

Registration and manifests are discovery/configuration artifacts. They confer no read, write, send, schedule, or deletion authority. All current adapter manifests declare read-only maximum material effect.
