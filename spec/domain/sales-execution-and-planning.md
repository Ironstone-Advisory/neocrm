# Sales execution, plans, and forecasts

**Status:** Accepted specification; Planned implementation and evidence

- **OBJ-093 QualificationDefinition** — versioned qualification framework with purpose, dimensions, criteria, evidence rules, disqualifiers, permissible use, owner, and effective interval.
- **OBJ-094 QualificationAssessment** — an expiring Insight specialization representing a point-in-time application of a QualificationDefinition to a Relationship/Opportunity, retaining evidence, counter-evidence, unknowns, uncertainty, expiry, assessor, and disposition. It is not a permanent Party fact or independent action authority.
- **OBJ-095 ScoreDefinition** — versioned formula/model/rules, population, intended and prohibited uses, features, calibration/fairness evidence, owner, and effective interval.
- **OBJ-096 ScoreObservation** — expiring Insight produced by a ScoreDefinition with subject/time, value or qualitative band, evidence, missingness, counter-evidence, uncertainty, explanation, and human disposition.
- **OBJ-100 PlaybookDefinition** — versioned reusable Plan pattern with eligibility, roles, steps, branching, policies, stop/escalation rules, measures, and owner.
- **OBJ-101 SequenceRun** — execution instance of a playbook/sequence for a declared Goal, subject, principal, authority, enrollment, current state, budgets, and outcome.
- **OBJ-102 SequenceStep** — ordered or conditional PlanStep with channel/action, timing, prerequisites, content reference, owner, policy gate, result, and next transition.
- **OBJ-103 Enrollment** — explicit admission of a Party/Relationship/Opportunity into a SequenceRun with reason, evidence, consent/purpose, time, owner, and exit.
- **OBJ-104 StopCondition** — independently evaluable condition that pauses or ends a run, including consent withdrawal, negative response, service conflict, frequency limit, goal completion, risk, or manual stop.
- **OBJ-105 DeliveryAttempt** — proposed/attempted communication delivery with channel, destination reference, content version, authority, consent decision, provider result, verification, response, cost, and receipt.
- **OBJ-106 ForecastDefinition** — versioned horizon, population, grain, measures, inclusion rules, method, assumptions, permissible use, and owner.
- **OBJ-107 ForecastScenario** — named assumptions and controlled changes applied to a ForecastDefinition with rationale, uncertainties, dependencies, and comparison baseline.
- **OBJ-108 ForecastSubmission** — accountable human or Agent forecast assertion at a point in time with scenario, evidence, assumptions, override rationale, and confidence semantics.
- **OBJ-109 ForecastSnapshot** — immutable aggregate and component state for a definition/scenario/time, including source versions, missingness, uncertainty, and reproducibility data.
- **OBJ-110 ForecastOutcome** — observed actual compared with one or more submissions/snapshots, attribution limits, error measures, explanations, and LearningSignals.

Buying groups remain a versioned view over Party, Role, and Relationship. Account plans remain relationship-scoped Plans; externally shared mutual plans use Commitments and access-controlled views.
