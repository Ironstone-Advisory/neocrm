# EXP-006: Unified relationship brief

**Status:** Demonstrated

## Hypothesis

The integrated CAP-001 slice produces a more useful conversation brief than the
CRM-only baseline while remaining grounded, explicit about uncertainty, and
read-only.

## Independent variable

All prior treatment components are combined.

## Control

EXP-001 CRM-only baseline.

## Fixture

`fixtures/acme-relationship.json`, fixed clock
`2026-09-20T16:00:00Z`.

## Procedure

Run the automated structural checks recorded in RES-001. Those checks establish
that the demonstration is internally traceable; they do not test the hypothesis.
The experiment remains unvalidated until the planned EVAL-001 run and blinded
human comparison against the CRM-only baseline are completed and recorded.

## Measures

EVAL-001 score, safety gates, provenance coverage, material-context recall,
usefulness, and preparation time.

## Success threshold

At least 85/100 automated, every safety gate passing, and at least 3/4 human
usefulness.

## Falsification and decision rule

Any safety failure blocks acceptance. An automated miss identifies a specific
contract/orchestration defect. Passing automation without human usefulness
keeps CAP-001 Provisional and triggers experience redesign.

## Results

See [`results.md`](results.md). The current result is an implemented
demonstration, not a validated experiment outcome.
