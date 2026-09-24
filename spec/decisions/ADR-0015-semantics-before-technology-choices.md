# ADR-0015: Keep technology choices subordinate to semantic contracts

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Demonstrated

**Validation plan:** EXP-003 / EVAL-003

**Validation plan:** EXP-004 / EVAL-003

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

The origin design illustrates relational, graph, vector, and columnar stores;
GraphQL, REST, and streaming APIs; containers; and model providers. Treating
those examples as requirements would prematurely bind experiments to a stack
and confuse deployment decisions with product meaning.

## Decision

Canonical objects, contract behavior, policy, provenance, and acceptance tests
are normative. Specific databases, protocols, event brokers, container
platforms, orchestration frameworks, model providers, and deployment topology
are replaceable implementation choices unless a separate ADR promotes one for
a bounded context.

A technology choice must identify the contract it implements, measurable
quality requirements, operational consequences, exit path, and evidence. It
must not leak vendor vocabulary into canonical semantics.

## Consequences

- Early experiments can choose the smallest adequate stack.
- Reference implementations do not become accidental platform mandates.
- Technology substitutions are judged by contract conformance and outcomes.
