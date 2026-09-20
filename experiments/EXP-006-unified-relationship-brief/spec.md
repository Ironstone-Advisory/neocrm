# EXP-006: Unified relationship brief

**Status:** Implemented

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

Run `node --test` and EVAL-001; then conduct a blinded human comparison against
the CRM-only baseline.

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

See [`results.md`](results.md).

