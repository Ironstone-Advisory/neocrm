# EXP-017: Trust Archive and data-quality lifecycle

**Status:** Planned

## Decision and hypothesis

Readable linked history plus explicit identity/enrichment/reconciliation/sync lifecycles will reduce correction effort and increase trust compared with mutable field history alone.

## Participants and boundaries

Use approved synthetic/live-safe records, retention schedules, classifications, and source authority. Archive state never becomes current Fact. Legal hold blocks conflicting disposition. Destruction uses ADR-0017.

## Design

Test snapshots/manifests/receipts; ambiguous identity; duplicate candidates; conflicting enrichment; reconciliation; bidirectional sync partial failure; correction propagation; retention; hold; export; and disposition.

## Measures and decision rule

Measure provenance completeness, readable reconstruction, reconciliation accuracy, correction propagation, sync verification, archive portability, time/cost, and policy failures. Hidden conflict, silent promotion, or prohibited disposition is a hard stop.

## Results record

Retain versioned decision/receipt references, hashes, errors, reviewer ratings, and negative/inconclusive outcomes without customer payloads.
