# Functional requirements

**Status:** Provisional

## Context and resolution

- **FR-RES-001** — For a relationship-brief request, NeoCRM MUST resolve one
  Party or return explicit disambiguation candidates before retrieving private
  context.
- **FR-CTX-001** — NeoCRM MUST create a source plan from the resolved intent,
  Party, source capabilities, policy, and freshness constraints.
- **FR-CTX-002** — A relationship brief MUST cover relevant operational,
  knowledge, activity, and calendar sources, while representing unavailable or
  failed sources as gaps rather than as absence.

## Epistemics and provenance

- **FR-PROV-001** — Every material fact and observation MUST cite one or more
  evidence records containing source, native identifier, retrieval time, and
  effective time when known.
- **FR-EPI-001** — Responses MUST keep facts, observations, hypotheses,
  unknowns, conflicts, and recommendations structurally distinct.
- **FR-MEM-001** — The assistant MUST distinguish session context from durable
  memory and MUST NOT write durable memory in CAP-001.

## Governed action

- **FR-ACT-001** — Consequential external action MUST follow
  propose -> preview -> approve -> execute -> verify -> audit.
- **FR-ACT-002** — CAP-001 MUST keep execution disabled; recommendations and
  proposals MUST NOT cause external writes.

