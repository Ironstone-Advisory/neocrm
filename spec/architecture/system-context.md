# System context

**Status:** Proposed architecture baseline

NeoCRM sits between relationship participants and the systems that hold or execute operational work. Its boundary is defined by semantics, agency, orchestration, context, policy, and outcomes—not by ownership of every datum.

```mermaid
flowchart LR
    P["People and relationship participants"]
    N["NeoCRM\nPresentation | Agents | Orchestration | Context"]
    G["Governance and control\nidentity | delegation | consent | policy | audit"]
    S["Source and execution systems\nCRM | knowledge | messaging | calendar | service | commerce"]
    O["Outcome evidence\nuser | customer | operational | business | ethical"]
    P <--> N
    G -. constrains .-> N
    N <--> S
    N --> O
    O --> N
```

## Participants

- **Relationship owner and customer-facing specialists** remain accountable for goals and consequential judgment.
- **Coordinator and specialist Agents** plan and perform delegated bounded work.
- **Policy/governance functions** define data, consent, autonomy, approval, retention, fairness, and redress controls.
- **Data/system stewards** define mappings, authority, quality, and source boundaries.
- **Customers and other Parties** are relationship participants whose value, rights, and outcomes remain explicit.
- **Source systems** retain their own operational records and execute authorized effects through bounded interfaces.

## System boundary

NeoCRM owns canonical meaning, Agent and orchestration contracts, context planning, provenance, policy decisions, action lifecycle, and outcome-learning governance. It may materialize approved semantic state, but does not claim universal ownership of source data or source-side transactions.

The current executable boundary is smaller: CAP-001 uses synthetic adapters and performs only deterministic read-only context assembly.
