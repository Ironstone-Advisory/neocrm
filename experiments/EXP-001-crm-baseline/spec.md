# EXP-001: CRM baseline

**Status:** Planned

## Hypothesis

A CRM-only brief establishes a measurable baseline but omits material
relationship context found in communications, notes, and time.

## Independent variable

Available evidence is restricted to the synthetic CRM source.

## Control

No chatbot synthesis: a reviewer reads the same CRM fields in record form.

## Fixture

`fixtures/acme-relationship.json`, with non-CRM sources disabled and clock
`2026-09-20T16:00:00Z`.

## Procedure

Run the EVAL-001 questions against the CRM record view and the CRM-only brief.
Randomize presentation order for human usefulness scoring.

## Measures

Grounding, provenance coverage, material-context recall, unknown honesty,
preparation usefulness, and time to answer.

## Success threshold

The automated baseline is recorded without a safety failure; no improvement
claim is made in this experiment.

## Falsification and decision rule

If CRM-only evidence already contains every gold-standard material item, the
fixture is not diagnostic and must be revised before EXP-002.

## Results

Pending. Record results in a future `results.md` without changing this plan.

