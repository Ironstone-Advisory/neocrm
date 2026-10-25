# EXP-018: Explainable qualification, metrics, and forecasting

**Status:** Planned

## Decision and hypothesis

Versioned, evidence-bound assessments and semantic metrics can improve decisions and forecast calibration without turning scores into permanent facts or hiding uncertainty.

## Participants and boundaries

Scores are expiring Insights with permitted/prohibited uses and human disposition. No score creates authority, denies service, or automatically changes a stage. Metrics/forecasts expose source quality, missingness, overrides, and assumptions.

## Design

Compare existing/manual decisions with NeoCRM qualification, cohort/metric queries, forecast scenarios/submissions/snapshots, and observed outcomes across normal, sparse, shifted, and fairness-sensitive cases.

## Measures and decision rule

Measure explanation/citation validity, reproducibility, calibration, error, override quality, decision usefulness, fairness, time/cost, and correction. Unsupported precision, hidden missingness, or prohibited automated use fails.

## Results record

Version definitions, inputs, observations, overrides, outcomes, analyses, limitations, and reviewer decisions.

## Proposed addition (2026-10-25): methodology pack fixtures

Use the [MEDDPICC pack](../../spec/domain/methodology/meddpicc.md) (QD-001) as the first QualificationDefinition fixture and compare it with a no-pack baseline on the same opportunities. Under FR-METHOD-001 the workflow steps, authority and stops must be identical in both conditions; only attributes, dimensions and labels may differ. Fail the run if a pack changes a step, if a dimension is Confirmed on seller notes alone, if Missing and Not assessable are merged, or if any assessment is used to rank sellers.
