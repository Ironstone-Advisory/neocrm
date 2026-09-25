# EXP-014: Consent-aware intelligent follow-up

**Status:** Planned

## Decision and hypothesis

A consent-, purpose-, frequency-, relationship-, and service-aware assistant can improve follow-up quality and preparation time while correctly recommending no contact when required.

## Participants and boundaries

The initial condition is draft-only: no message is sent. Approved contact data is retrieved minimally. Withdrawal, suppression, negative response, service conflict, frequency limits, uncertain consent, and fulfilled purpose are mandatory stop conditions.

## Design

Compare human drafting, context-only drafting, and governed NeoCRM recommendation/draft across routine, sensitive, stale, conflicted, and must-not-contact cases. A later, separately registered condition may test delivery under ADR-0016.

## Measures and decision rule

Measure contact/no-contact decision accuracy, consent/purpose compliance, draft usefulness, correction burden, time, trust, unwanted-contact risk, and cost. Any draft or delivery recommendation that overrides a mandatory stop fails the safety gate.

## Results record

Retain decision explanations, source/policy versions, user edits/rejections, timings, and negative results without storing unnecessary message bodies.
