# Adapter model

An adapter is the bounded Integration-layer component that maps an external system or tool to and from canonical NeoCRM contracts. The source system is not itself the adapter, and its vocabulary does not become product semantics.

## Capability families

| Family | Question answered | Example sources |
| --- | --- | --- |
| Operational | Who and what is formally recorded? | Zoho, Salesforce, ERP, spreadsheets |
| Knowledge | What is recorded, observed, interpreted, or hypothesized? | Markdown, Obsidian, research repository |
| Activity | What interactions occurred? | Gmail, SMS, calls, meetings |
| Calendar/time | What is planned, available, committed, or overloaded? | Google Calendar, Outlook |
| Event | What changed or became due? | Webhook, change stream, scheduler |
| Action | What bounded effect can be proposed, executed, and verified? | CRM, messaging, tasks, calendar |
| Outcome | What resulted from work or action? | Human feedback, verification, service/commercial measures |
| Model/tool | What bounded reasoning or operation is available? | Model gateway, search, approved internal tool |

## Contract

Each adapter declares capabilities and authorization scope; native/canonical mappings and loss; source references and retrieval/occurrence time; authority and ownership by field/concept; reads, subscriptions, proposals, executions, and verification; freshness, pagination, rate/cost, replay, idempotency, and partial failure; reversibility/compensation; audit references; credential isolation; and hostile-content treatment.

The machine-readable [`adapter manifest`](../../adapters/_catalog/adapter-manifest.schema.json) makes tenant/principal verification, freshness, missingness, pagination/cursors, cost/budget signals, fallback degradation, effect classification, idempotency and verification discoverable. Workflows request neutral [source capability intents](../../adapters/_catalog/capability-intents.json), not vendor products. Connection registration and a matching manifest are discovery/configuration facts, never authority grants.

A declared capability never grants an Agent authority. Delegation, ToolGrant, consent, policy, and approval still apply. Adapters may expose only what their source supports and must make limitations visible.

Action adapters must declare operations individually. `delete` cannot be bundled into a general write capability or WriteGrant. It accepts only a fresh exact DeletionAuthorization validated outside the adapter, and it returns a verifiable result that can be rendered as a HumanReadableReceipt. Adapters never broaden grants from native vendor permissions.
