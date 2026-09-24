# EXP-015: Governed multi-workflow Zoho write portfolio

**Status:** Planned

## Decision and hypothesis

A portfolio of explicitly registered Zoho workflows can execute safely under time-bounded WriteGrants while producing useful verified outcomes and readable receipts.

## Participants and boundaries

Candidate workflows include tasks, meeting outcomes, contact/account corrections, opportunities, stages/next steps, commitments, links, assignments, data-quality decisions, and approved summaries. Each workflow registers exact objects, fields, operations, purpose, risk, authority, limits, approval mode, idempotency, verification, and compensation. CAP-001 and EXP-001 remain read-only.

`delete` is absent from every WriteGrant. Every deletion requires a fresh, exact, single-use human DeletionAuthorization for an immutable target list under ADR-0017. Pricing, discounts, contracts, payments, bulk outbound communications, merges, and other materially different effects remain separately gated.

## Design

Run synthetic/dedicated-sandbox cases before any approved live tenant. Compare human-only and governed-agent workflows; exercise grant expiry/revocation, scope violations, duplicates, partial failure, stale records, uncertain execution, verification mismatch, compensation, and exact deletion controls.

## Measures and decision rule

Measure task success, field accuracy, duplicate rate, verification/receipt completeness, reversibility, time/cost, intervention, policy denial quality, and customer/operational harm. Any out-of-scope write, unverified success claim, or deletion without fresh exact authorization is a hard stop.

## Results record

Store de-identified workflow-level receipts, grant/policy/schema versions, before/after evidence references, verification, corrections, costs, incidents, and human ratings.
