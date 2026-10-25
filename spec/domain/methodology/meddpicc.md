# MEDDPICC methodology pack (QD-001)

**Status:** Proposed reference instance of OBJ-093 QualificationDefinition (2026-10-25). Planned implementation; no evidence yet.

**Version:** 0.1.0 · **Owner:** Rob Tyrie, Ironstone Advisory · **Effective interval:** from acceptance until superseded

The first full [methodology pack](README.md). It extends one point only: a versioned [QualificationDefinition](../sales-execution-and-planning.md) that every QualificationAssessment (OBJ-094) cites by ID and version. It gives [WF-SAL-005](../../../workflows/sales/WF-SAL-005-opportunity-qualification-and-next-step/GUIDE.md), [WF-SAL-010](../../../workflows/sales/WF-SAL-010-account-and-mutual-action-plan/GUIDE.md) and [WF-SAL-015](../../../workflows/sales/WF-SAL-015-pre-proposal-services-scoping-handoff/GUIDE.md) something concrete to test against without changing a single step in any of them.

## Purpose

Find the gaps in an opportunity's evidence and turn them into next actions. It is a gap-finding tool, not a forecast, a rep score or a checkbox ritual.

## Dimensions

| Dimension | Question | Evidence that counts |
| --- | --- | --- |
| Metrics | What quantified outcome does the customer expect, and have they agreed to it? | Customer-stated numbers in a source span or document, not seller paraphrase |
| Economic buyer | Who controls the budget, and have they engaged? | Direct participation in a meeting or thread; a named person alone is Partial |
| Decision criteria | How will the customer evaluate options? | Customer-stated criteria, RFP text, evaluation documents |
| Decision process | What steps lead to a signed decision, in what order, with whom? | Customer-described steps and approvers with dates |
| Paper process | What contracting, security, legal and procurement steps apply? | Named steps, owners and documents (MSA, DPA, security review) |
| Identified pain | What business problem is being solved, and who owns it? | Customer-stated pain with an owner, ideally with cost or impact |
| Champion | Who sells internally for us, with power, and has been tested? | Observable actions taken on the seller's behalf, not enthusiasm |
| Competition | Who else is being considered, including doing nothing? | Customer-stated alternatives and status quo |

## Assessment states

Each dimension resolves to one of five states. Missing is never zero, and absence of evidence is never negative evidence.

- **Confirmed** — customer-sourced evidence directly supports it.
- **Partial** — some evidence, with a named gap.
- **Contradicted** — evidence conflicts; both sides are shown.
- **Missing** — no evidence found in the sources read.
- **Not assessable** — a required source was denied, failed or not connected. Shown separately from Missing.

## Evidence rules

- Every state above Missing cites at least one source span or record, with source and date.
- Seller notes count as seller assertions, not customer evidence. A dimension supported only by seller notes is at most Partial.
- Model output is interpretation. It can propose a state; it cannot confirm one without the evidence above.
- Counter-evidence is shown beside supporting evidence, never hidden by an overall rollup.

## Expiry

An assessment expires at the earliest of: 30 days after it was made, a stage change, a new decision-maker or champion change, or a material new conversation. Expired assessments stay readable as history and are not used for current decisions.

## Disqualifiers

None by default. A tenant may add explicit disqualifiers (for example, no budget owner reachable within a set period), each with an accountable owner.

## Permitted and prohibited use

- **Permitted:** deal planning, next-step selection, account plans, services scoping handoffs, coaching conversations the seller has opted into.
- **Prohibited:** individual performance evaluation, compensation, ranking sellers, or any employment decision (SAFE-SURVEIL-001). Aggregate, de-identified gap patterns may inform enablement content.

## Traceability

FR-QUALIFY-001 · D22 · EXP-018 · EXP-019
