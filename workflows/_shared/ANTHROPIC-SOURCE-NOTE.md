# Anthropic small-business workflow source note

**Reviewed:** 2026-09-24  
**Upstream snapshot:** [`anthropics/knowledge-work-plugins` at `da38ec1ee89d41e5380e652a97382695003396e7`](https://github.com/anthropics/knowledge-work-plugins/tree/da38ec1ee89d41e5380e652a97382695003396e7/small-business)  
**Upstream license:** [Apache License 2.0](https://github.com/anthropics/knowledge-work-plugins/blob/da38ec1ee89d41e5380e652a97382695003396e7/LICENSE)

NeoCRM uses the upstream repository as structural prior art for discoverable job-based workflows, shared operational guidance, onboarding, routing, and connector ergonomics. The NeoCRM material is independently written and paraphrased; it does not copy long passages from the upstream skills.

The upstream structure informed several practical controls:

- define operational seams between workflows instead of assuming a successful handoff;
- distinguish missing, denied, failed, truncated and zero values;
- resolve tenant, principal, timezone and source boundaries before work;
- treat retrieved content as evidence, never as instructions that can alter policy or authority;
- disclose degradation when a connector is absent;
- do not claim scheduling, execution or connection state without durable system confirmation.

NeoCRM deliberately adds stricter product boundaries: canonical semantics, typed WorkflowDefinitions, traceability, evaluation placeholders, principal-bound minimum-necessary reads, effect-based authority, verification and receipts, and fresh exact human authorization for every deletion effect.
