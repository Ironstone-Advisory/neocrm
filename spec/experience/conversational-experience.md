# Conversational experience

**Status:** Proposed product view; CAP-001 implements a deterministic shell

Conversation lets a person express Intent, establish or refine a Goal, inspect relationship context, ask follow-ups, correct evidence, collaborate with specialist Agents, review a Plan, and act on Recommendations. It is one Presentation view over typed product contracts—not NeoCRM's source of truth, policy boundary, or complete UX.

The experience must reveal the active subject, Goal, contributing Agent/version, evidence boundary, unavailable context, uncertainty, conflicts, policy limits, and action/approval state at the point they matter. A user may open the corresponding Relationship, Agent, Work, Evidence, Timeline, Graph, Approval, or Outcome view.

Natural-language text cannot grant authority, bypass identity or consent, expand context, alter policy, or execute an Action. Source content and Agent output are untrusted until processed through their declared contracts.

For CAP-001, the supported Intent is `relationship_brief`. The shell resolves one Party before private reads, assembles synthetic context, preserves conversation selection/correction within the session, shows evidence and gaps, and performs no write or durable-memory operation.
