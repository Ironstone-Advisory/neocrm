# Historical staging artifact: Unified relationship brief

**Archive status:** CAP-001 synthetic preflight; not canonical EXP-006

## Hypothesis

The integrated CAP-001 slice produces a more useful conversation brief than the
CRM-only baseline while remaining grounded, explicit about uncertainty, and
read-only.

## Independent variable

All prior treatment components are combined.

## Control

The earlier staging CRM-only baseline.

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

At least 85/100 automated, every safety gate passing, and at least 4/5 human
usefulness.

## Falsification and decision rule

Any safety failure blocks acceptance. An automated miss identifies a specific
contract/orchestration defect. Passing automation without human usefulness
keeps CAP-001 Provisional and triggers experience redesign.

## Results

See [`unified-brief-results.md`](unified-brief-results.md). The archived result is an implemented
demonstration, not a validated experiment outcome.
