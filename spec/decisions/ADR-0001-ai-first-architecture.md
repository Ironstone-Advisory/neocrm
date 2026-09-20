# ADR-0001: AI-first architecture

**Status:** Provisional

**Validation:** EXP-006 / EVAL-001

## Context

Conventional CRM products are organized around records, schemas, and application screens. NeoCRM's objective is to help a person understand and act in relationships across fragmented information sources.

## Decision

NeoCRM is designed around a Relationship Intelligence Layer that assembles governed context and reasons over canonical relationship semantics. Storage systems are integrations, not the product boundary.

## Consequences

- Semantic and provenance requirements become core architecture.
- Vendor schemas cannot dictate the user model.
- A working system must demonstrate value through real relationship questions, not merely record management.
