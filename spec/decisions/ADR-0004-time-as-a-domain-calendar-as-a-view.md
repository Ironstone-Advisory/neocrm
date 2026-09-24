# ADR-0004: Model Time as a domain and Calendar as a view

**Decision status:** Accepted

**Implementation status:** Planned

**Evidence maturity:** Planned

**Validation plan:** EXP-010 / EVAL-003

**Validation plan:** EXP-011 / EVAL-003

**Validation plan:** EXP-012 / EVAL-003

## Decision

Calendar = View; Time = Domain.

**OBJ-018 Event**, **OBJ-019 Interval**, **OBJ-020 Commitment**,
**OBJ-021 Availability**, **OBJ-022 Capacity**, **OBJ-023 Workload**, and
**OBJ-024 TimeSeries** are canonical temporal objects. Google Calendar,
Outlook, and other providers are adapters and partial views over this domain.

## Consequences

- Time and load can be reasoned about alongside relationship and commercial
  context.
- A calendar record cannot by itself determine capacity, commitment, or
  relationship priority.
- Temporal analysis declares windows, inclusion rules, sources, and missing
  data.
