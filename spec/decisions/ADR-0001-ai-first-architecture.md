# ADR-0001: Adopt an agent-native relationship-intelligence architecture

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Demonstrated

**Validation plan:** EXP-001 / EVAL-002

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

Conventional CRM products make records, forms, pipelines, and vendor screens the
centre of the product. NeoCRM's original purpose is different: help a person and
governed AI collaborators understand relationships, decide what matters, and
carry work forward across fragmented systems. Adding a chat box to a
record-centric product would preserve the old product boundary and would not
test that proposition.

## Decision

NeoCRM is agent-native. Natural-language interaction, relationship workspaces,
and explicit human-agent collaboration are first-class experiences over a
Relationship Intelligence Layer (RIL). The RIL interprets intent, coordinates
specialist agents and deterministic services, assembles minimum-necessary
context, reasons over canonical semantics, applies policy, and records outcomes.

The product is organized around seven logical architecture layers defined by
ADR-0010. A chatbot is one presentation view, not the architecture. Agents are
bounded computational actors, not Party records and not holders of ambient
authority. v0.1 permits autonomy Levels 0-2 (observe, recommend, draft/plan).
Level 3 is experiment-only; broader autonomy is deferred.

CAP-001 is a deterministic, read-only reference slice for relationship briefs.
It demonstrates selected context and safety contracts; it is not evidence that
the complete agent-native architecture exists.

## Product traceability catalogue

### Product goals

- **GOAL-001 — Agent-native relationship work:** make governed AI collaboration
  a foundation of the product rather than an add-on.
- **GOAL-002 — Unified relationship understanding:** assemble a coherent view
  of Parties, roles, relationships, activity, commercial state, knowledge, and
  time without forcing the user to navigate source systems.
- **GOAL-003 — Proactive contextual assistance:** respond to conversations,
  events, and schedules with relevant next work while respecting authority and
  attention.
- **GOAL-004 — Safe outcome learning:** learn through explicit outcomes,
  evaluation, and approved version changes rather than silent self-modification.
- **GOAL-005 — Replaceable ecosystem:** preserve product meaning when storage,
  model providers, protocols, or vendors change.

### Business capabilities

- **BCAP-001 — Relationship understanding**
- **BCAP-002 — Human-agent collaboration**
- **BCAP-003 — Proactive planning and orchestration**
- **BCAP-004 — Governed recommendation and action**
- **BCAP-005 — Outcome measurement and learning**
- **BCAP-006 — Semantic and ecosystem portability**

### Product views

- **VIEW-001 — Conversational interface**
- **VIEW-002 — Relationship workspace**
- **VIEW-003 — Agent collaboration workbench**
- **VIEW-004 — Insight explorer**
- **VIEW-005 — Relationship graph**
- **VIEW-006 — Timeline and conversation view**
- **VIEW-007 — Calendar, time, and capacity view**
- **VIEW-008 — Human work queue**
- **VIEW-009 — Approval inbox**
- **VIEW-010 — Evidence and provenance inspector**
- **VIEW-011 — Agent audit console**
- **VIEW-012 — Outcome and learning dashboard**
- **VIEW-013 — Integration and authority administration**
- **VIEW-014 — Goal and plan board**
- **VIEW-015 — Commercial workspace**
- **VIEW-016 — Service workspace**
- **VIEW-017 — Campaign and engagement workspace**

## Alternatives considered

- A conventional CRM with an assistant bolted onto CRUD screens.
- A single general-purpose agent with direct access to every source and tool.
- A chat-only product with no explicit workspaces, contracts, or lifecycle.

These alternatives obscure authority and provenance, couple the product to
vendor records, or make collaboration and learning untestable.

## Consequences

- Agency, goals, plans, runs, handoffs, outcomes, and learning signals become
  first-class contracts.
- Conversational and event-driven entry points use the same governed runtime.
- Product claims require outcome evidence, not merely fluent output.
- The first implementation remains deliberately narrower than the adopted
  architecture and must state those gaps.
