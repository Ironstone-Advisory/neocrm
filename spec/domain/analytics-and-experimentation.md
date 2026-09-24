# Analytics and treatment experimentation

**Status:** Accepted specification; Planned implementation and evidence

- **OBJ-097 MetricDefinition** — versioned name, purpose, formula, unit, grain, population, dimensions, time semantics, exclusions, source requirements, quality thresholds, owner, and effective interval.
- **OBJ-098 MetricObservation** — computed value for one definition/population/time window with inputs, source versions, missingness, calculation version, uncertainty, lineage, and reproducibility reference.
- **OBJ-099 CohortDefinition** — versioned membership rule, purpose, eligibility/exclusions, observation window, freeze/dynamic behavior, consent/policy constraints, and owner.
- **OBJ-111 TreatmentExperiment** — preregistered Goal, hypothesis, population, design, control/holdout, variants, randomization, measures, guardrails, stop rules, analysis, and owner.
- **OBJ-112 TreatmentVariant** — versioned treatment content/experience/action and allowed channels with rationale, policy, expected Outcome, cost, and effective interval.
- **OBJ-113 TreatmentAssignment** — immutable assignment of an eligible subject to a variant/control with assignment method/version, time, strata, eligibility evidence, and exceptions.
- **OBJ-114 TreatmentExposure** — evidence that an assigned treatment was actually presented/delivered, with time, channel, delivery verification, dose, context, and contamination/noncompliance.
- **OBJ-115 AttributionClaim** — bounded analytical claim linking observed outcomes to activities/treatments with method, comparison, window, assumptions, alternatives, uncertainty, and limitations. It is not causal proof unless the design supports that claim.

Natural-language analytics resolves questions to declared MetricDefinitions and exposes calculation, filters, source quality, and uncertainty. No dashboard creates a competing metric ontology.
