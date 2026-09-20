# Agent runtime and Relationship Intelligence Layer

**Status:** Provisional

```text
Chat adapter
  -> typed intent
  -> identity resolution gate
  -> capability-aware context planner
  -> read-only adapter fan-out
  -> provenance normalizer
  -> epistemic classifier
  -> policy check
  -> ResponseEnvelope
```

The model-facing orchestration layer cannot reach source credentials or an
adapter execute primitive directly. Adapters expose capabilities and return
typed evidence. Policy runs independently of conversational text and fails
closed.

Operational telemetry records `request.started`, `identity.resolved`,
`source.completed` or `source.failed`, and `request.completed`. Events may
include trace ID, adapter ID, stage, duration, counts, and outcome. They exclude
prompts, hidden chain-of-thought, credentials, and raw source content.

