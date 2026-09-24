# ADR-0002: Own canonical semantics independently of storage

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Demonstrated

**Validation plan:** EXP-003 / EVAL-003

**Validation plan:** EXP-004 / EVAL-003

**Demonstration evidence:** EXP-006 / EVAL-001

## Context

Relationship meaning is distributed across CRM records, notes, messages,
calendars, files, analytical stores, and future systems. If a vendor schema or a
physical database becomes NeoCRM's domain model, changing a source changes the
product's meaning and incomplete mappings become invisible data loss.

## Decision

NeoCRM owns the semantic model, not the storage model.

Persistence is replaceable. Intelligence is not.

NeoCRM doesn't own the world's data. It creates a coherent model of the
relationships represented by that data.

Canonical contracts define identity, Party, roles, relationships, commercial
concepts, activity, time, evidence, epistemic state, agency, governed action,
and outcomes. Adapters and storage ports map native representations into those
contracts while retaining source identifiers, native claims, authority,
freshness, and mapping loss. Unmapped source information remains visible as
native evidence; it is never silently discarded or promoted to canonical fact.

The initial canonical object set includes **OBJ-001 Party**, **OBJ-002 Role**,
**OBJ-003 Relationship**, **OBJ-004 OrganizationUnit**, **OBJ-005 Evidence**,
**OBJ-006 Assertion**, **OBJ-007 Unknown**, and **OBJ-008 Conflict**. Other
domain and agency objects are adopted by the decisions that define them.

## Alternatives considered

- Reuse the first CRM's modules and field names as canonical objects.
- Make a single relational schema the product contract.
- Flatten every source into documents and recover meaning only in prompts.

## Consequences

- Zoho, spreadsheets, Markdown repositories, and future stores remain
  replaceable behind explicit capabilities.
- The model must tolerate partial capability, ambiguity, conflicts, temporal
  validity, and imperfect mapping.
- Storage and adapter changes require contract tests against canonical meaning,
  not only successful transport.
- Materialization and caching may improve performance but cannot silently become
  semantic authority.
