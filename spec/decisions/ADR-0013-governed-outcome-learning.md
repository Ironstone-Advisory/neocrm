# ADR-0013: Learn through governed outcomes, never silent self-modification

**Decision status:** Accepted

**Implementation status:** Planned

**Evidence maturity:** Planned

**Validation plan:** EXP-001 / EVAL-002

## Context

NeoCRM should improve from relationship outcomes, but an agent that silently
changes prompts, policies, mappings, memories, or tool behavior is neither
auditable nor safely attributable.

## Decision

Adopt **OBJ-051 Outcome**, **OBJ-052 LearningSignal**, and
**OBJ-053 EvaluationRun**. **OBJ-058 EventEnvelope** carries typed triggers and
outcome events across runtime boundaries. A completed run may record an Outcome
and derive a LearningSignal with provenance and consent. Learning signals feed offline
comparison and may propose a versioned change. A human or governed release
process reviews the proposal, runs the Canonical CRM Test Suite and relevant
replays, and explicitly promotes or rejects the new version.

Runtime agents cannot modify their own policies, prompts, grants, schemas,
evaluation thresholds, or durable memories merely because an interaction
succeeded or failed.

## Consequences

- Learning is measurable, reversible, and attributable.
- A user correction is retained as evidence, not immediately generalized into
  global behavior.
- Online adaptation is limited to explicitly authorized session state until a
  later decision defines stronger controls.
