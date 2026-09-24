# CAP-001 deterministic runtime

**Status:** Implemented reference behavior

```text
Conversational shell
  -> typed relationship_brief request
  -> identity resolution gate
  -> capability-aware context plan
  -> synthetic read-only adapter calls
  -> normalization and reconciliation
  -> deterministic epistemic response construction
  -> fail-closed no-write policy
  -> ResponseEnvelope
```

This pipeline is a deterministic context-engine/orchestration probe. It does not instantiate an AgentDefinition, invoke an LLM, create a general Goal/Plan/AgentRun, perform proactive work, collaborate across Agents, persist memory, use live Zoho/Obsidian data, or execute an external Action. It is not the complete RIL or NeoCRM.

Model-safe context excludes credentials and native execute handles. Source content is untrusted. Telemetry may include trace ID, adapter ID, stage, duration, counts, and outcome; it excludes prompts, hidden reasoning, credentials, and raw private source bodies.
