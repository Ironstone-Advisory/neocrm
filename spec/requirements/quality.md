# System quality requirements

**Status:** Proposed

Accepted portfolio quality requirements NFR-RECEIPT-001, NFR-VALUE-001, and NFR-METER-001 are specified in [product-value requirements](product-value.md). They require readable receipts, explicit value evidence, and pre-estimated/post-reconciled metering without weakening core safety.

- **NFR-USE-001 Usefulness** — Evaluations MUST measure task completion, usefulness, cognitive/source-switching effort, correction/override, and time against a declared baseline; synthetic conformance MUST NOT stand in for human usefulness.
- **NFR-TIME-001 Timeliness** — Answers, Plans, and Actions MUST expose evidence freshness and meet capability-specific latency/age thresholds or declare degradation.
- **NFR-REL-001 Reliability** — Partial, failed, denied, stale, or incomplete sources MUST remain explicit and MUST NOT be interpreted as absence.
- **NFR-RES-001 Resilience** — Runs MUST have timeout, retry, backpressure, cancellation, escalation, and partial-result behavior; action retries MUST be idempotent or safely compensated.
- **NFR-LIMIT-001 Bounded execution** — Each AgentRun MUST enforce loop, wall-clock, model/token, tool-call, data-volume, and financial budgets.
- **NFR-OBS-001 Observability** — Material lifecycle events MUST be correlated and versioned while excluding credentials, hidden reasoning, and raw private source bodies.
- **NFR-PORT-001 Portability** — Replacing a store, adapter, model provider, protocol, or deployment product MUST NOT require changing canonical meaning or user Goal; capability loss MUST be disclosed.
- **NFR-TEST-001 Reproducibility** — Contract/evaluation results MUST identify code, schema, Agent/prompt/model, policy, mapping, fixture/data, clock, rubric, and evaluator versions.
- **NFR-LEARN-001 Learning regression** — Any learning-derived change MUST pass held-out functional, CTS, safety, fairness, cost, and rollback gates before broader authority.
- **NFR-COST-001 Economics** — NeoCRM MUST measure human, Agent/model, adapter, storage, approval, correction, and incident cost per productive Outcome.
- **NFR-CUST-001 Customer outcome** — Success measures MUST include customer effort, service quality, trust, consent, complaints/redress, and harm rather than revenue alone.
- **NFR-CAL-001 Calibration** — Numeric confidence or risk MUST NOT be displayed unless its meaning and calibration are documented; otherwise use evidence-based qualitative labels.
