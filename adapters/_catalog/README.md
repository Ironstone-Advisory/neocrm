# Adapter capability catalogue

This catalogue lets workflows ask for **capability intents**, not vendor names. An adapter declares which intents it can satisfy and under what conditions; NeoCRM keeps canonical meaning, reconciliation, authority and policy outside the vendor schema.

- [`capability-intents.json`](capability-intents.json) is the host-neutral vocabulary used by workflow definitions.
- [`source-categories.json`](source-categories.json) groups source roles without making a product the semantic owner.
- [`adapter-manifest.schema.json`](adapter-manifest.schema.json) validates adapter declarations.

Connection registration is discovery/configuration only. It grants no read, write, send, schedule or deletion authority. Every read remains within the authenticated principal's authority and minimum-necessary context plan. No current adapter manifest enables external writes or deletions.
