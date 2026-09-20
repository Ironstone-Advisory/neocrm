# Conversation contract

**Status:** Provisional

## Request

CAP-001 accepts a plain-language request equivalent to: “What do I need to
know before I speak with {person}?” A user may include a company or email as a
disambiguation hint.

## Disambiguation

Zero matches produces an explicit unknown and recovery prompt. Multiple matches
produce `needs_disambiguation` with safe candidate summaries; no private
activity, knowledge, commercial, or calendar retrieval occurs before selection.

## Response

The structured envelope is normative. A rendered brief SHOULD lead with the
subject and material changes, then commitments/conflicts, unknowns, and a
recommended next conversation step. Every material fact or observation links
to evidence. Hypotheses and recommendations link to their derivation.

## Memory and correction

Conversation selections and corrections MAY live in session context. CAP-001
MUST NOT create durable memory. When a user corrects a claim, the assistant
retains the correction as session context, marks the original as disputed, and
does not mutate a source. A durable correction is a future governed action.

## Failure and recovery

One unavailable source yields a partial brief with a visible unknown and failed
plan step. Total failure yields `error` without invented content. Retrying an
adapter does not change epistemic classification.

## Action policy

Recommendations are advice, not execution. The future action protocol is
propose -> preview -> approve -> execute -> verify -> audit. CAP-001 stops at
proposal/preview and the reference implementation rejects every execute call,
including after a claimed approval.

