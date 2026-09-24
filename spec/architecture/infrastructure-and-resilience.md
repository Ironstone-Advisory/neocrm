# Infrastructure and resilience

**Status:** Proposed; no production conformance claim

The Infrastructure layer must preserve safety and service under component failure, cost pressure, malicious content, and variable load.

## Required responsibilities

- workload and tenant isolation;
- secrets and key management outside model/Agent context;
- authenticated service identity and least-privilege network/tool access;
- structured telemetry using correlation/causation IDs without raw private source bodies or hidden reasoning;
- health, timeout, retry, circuit-breaking, backpressure, idempotency, and partial-result behavior;
- loop, wall-clock, model/token, tool-call, data-volume, and financial budgets per AgentRun;
- cancellation, escalation, dead-letter/quarantine, replay, and incident investigation;
- backup, restoration, retention/deletion, and disaster-recovery objectives for state NeoCRM owns;
- versioned, reversible deployment of models, prompts, policies, mappings, adapters, and schemas; and
- evaluation gates and rollback criteria before broader authority.

Containers, serverless functions, virtual machines, orchestration platforms, and cloud providers are optional implementation choices. A local deterministic test suite is not evidence of production availability, privacy, scale, or recovery.
