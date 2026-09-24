# CAP-001: Relationship Brief

**Status:** Provisional

## Outcome

Before a conversation, a relationship owner receives a concise, evidence-grounded picture of the resolved Person, related Parties, commercial context, recent Activity, Commitments, contextual knowledge, conflicts, Unknowns, and a suggested next conversation step without needing to navigate source systems.

## Scope and proof boundary

CAP-001 is a **synthetic deterministic read-only context probe**. It reads mock operational, knowledge, activity, and calendar sources through capability contracts, then emits a structured ResponseEnvelope and conversational rendering.

It is not NeoCRM, the complete RIL, or a general Agent runtime. It excludes a production LLM, proactive triggers, Goal/Plan/AgentRun execution, specialist Agent collaboration, live Zoho/Obsidian access, durable memory, source mutation, autonomous follow-up, production identity/access control, and business Outcome claims.

## Requirements

The bounded requirements are defined in [`requirements.md`](requirements.md); runtime behavior is in [`runtime.md`](runtime.md). System requirements remain future-facing unless explicitly exercised here.

## Decisions and evidence

ADR-0001, ADR-0002, ADR-0003, ADR-0005, ADR-0006, ADR-0010, and ADR-0014 constrain the slice. EVAL-001 scores deterministic CAP-001 conformance. The reference demo is a preflight for canonical EXP-001; it does not validate EXP-001's live/human hypothesis.

## Acceptance

Automated acceptance is defined in [`acceptance.md`](acceptance.md). Human usefulness uses the same 1-5 rubric as EXP-001 and remains a separate evidence gate.
