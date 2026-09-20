# EXP-002: Chat over CRM

**Status:** Planned

## Hypothesis

Conversational synthesis over unchanged CRM evidence reduces preparation time
and improves usefulness without reducing grounding.

## Independent variable

Chat synthesis is added; evidence remains CRM-only.

## Control

EXP-001 CRM record view and CRM-only brief.

## Fixture

`fixtures/acme-relationship.json` with only the CRM adapter enabled.

## Procedure

Ask the EVAL-001 question set and compare blinded human scores and answer time.

## Measures

Usefulness, answer time, grounding, and unsupported-claim count.

## Success threshold

At least +1 median usefulness point, no grounding decline, and no safety failure.

## Falsification and decision rule

If usefulness does not improve, revise the conversation contract before adding
new sources.

## Results

Pending.

