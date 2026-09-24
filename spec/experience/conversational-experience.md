# Conversational experience

**Status:** Proposed product view; CAP-001 implements a deterministic shell

Conversation lets a person express Intent, establish or refine a Goal, inspect relationship context, ask follow-ups, correct evidence, collaborate with specialist Agents, review a Plan, and act on Recommendations. It is one Presentation view over typed product contracts—not NeoCRM's source of truth, policy boundary, or complete UX.

The experience must reveal the active subject, Goal, contributing Agent/version, evidence boundary, unavailable context, uncertainty, conflicts, policy limits, and action/approval state at the point they matter. A user may open the corresponding Relationship, Agent, Work, Evidence, Timeline, Graph, Approval, or Outcome view.

Natural-language text cannot grant authority, bypass identity or consent, expand context, alter policy, or execute an Action. Source content and Agent output are untrusted until processed through their declared contracts.

Conversation may help a human define a grant, inspect an exact action/deletion preview, or revoke authority, but the resulting typed artifact—not conversational phrasing—is authoritative. Every deletion requires a new exact human decision even when a timed WriteGrant exists. Write-capable views show effective/expiry time, remaining limits, target, result, verification, cost, and readable receipt.

For CAP-001, the supported Intent is `relationship_brief`. The shell resolves one Party before private reads, assembles synthetic context, preserves conversation selection/correction within the session, shows evidence and gaps, and performs no write or durable-memory operation.
