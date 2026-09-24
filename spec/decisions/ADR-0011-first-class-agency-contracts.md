# ADR-0011: Make agency and collaborative work first-class contracts

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Planned

**Validation plan:** EXP-001 / EVAL-002

## Context

A request/response context engine cannot represent proactive work, delegation,
specialist collaboration, plan progress, authority, or outcomes. Prompt text is
not a stable runtime contract.

## Decision

Adopt explicit agency and work objects: **OBJ-025 Agent**,
**OBJ-026 AgentDefinition**, **OBJ-027 AuthorityGrant / Delegation**, **OBJ-028 Trigger**,
**OBJ-029 Intent**, **OBJ-030 Goal**, **OBJ-031 Plan**,
**OBJ-032 PlanStep**, **OBJ-033 WorkItem**, **OBJ-034 AgentRun**,
**OBJ-035 AgentStep**, **OBJ-036 Handoff**,
**OBJ-037 CollaborationSession**, **OBJ-038 ContextRequest**,
**OBJ-039 ContextSnapshot**, **OBJ-040 MemoryItem**, **OBJ-059 Actor**,
**OBJ-060 AgentCapability**, and **OBJ-061 ToolGrant**.

An Agent is a versioned computational Actor operating under Delegation and
tool grants; it is not a Party. A coordinator owns the Goal and Plan.
Specialists receive typed WorkItems and minimum necessary ContextSnapshots.
Handoffs contain evidence references, open questions, budgets, and remaining
authority. Deterministic services may fulfil steps without being represented as
autonomous agents.

## Consequences

- Runs are replayable and auditable without storing hidden chain-of-thought.
- Multi-agent collaboration is explicit rather than simulated through a shared
  prompt transcript.
- The EXP-001 reference path implements a bounded, single-Agent subset of these
  contracts. It does not fully satisfy the multi-Agent collaboration decision.
