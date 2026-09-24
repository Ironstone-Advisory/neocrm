# ADR-0007: Treat Activity, Message, and Conversation as distinct semantics

**Decision status:** Accepted

**Implementation status:** Partial

**Evidence maturity:** Planned

**Validation plan:** EXP-009 / EVAL-003

## Decision

**OBJ-015 Activity**, **OBJ-016 Message**, and **OBJ-017 Conversation** are
first-class canonical objects. A Message is a communicative item; an Activity
is an event or work record; a Conversation is an ordered, participant-aware
thread that may contain Messages and link Activities. Email, SMS, WhatsApp,
meetings, and provider threads are channels or adapter representations, not
separate domain models.

## Consequences

- NeoCRM can reconstruct context across channels without flattening all events
  into notes.
- Ordering, participants, reply/thread linkage, and provenance remain explicit.
- Conversation summaries are derived artifacts and do not replace source
  messages.
