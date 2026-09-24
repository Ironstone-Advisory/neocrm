# EXP-016: Governed Obsidian artifact writing

**Status:** Planned

## Decision and hypothesis

NeoCRM can create useful, reviewable Markdown artifacts in an approved Obsidian boundary while preserving source links, authorship state, correction, and deletion safety.

## Participants and boundaries

Writes require ADR-0016 authority, vault/path confinement, filename rules, and preview. Content is visibly labelled Generated, Proposed, or Human-accepted; generated text never masquerades as human-authored memory. Existing notes are not overwritten unless the grant explicitly allows an exact update. Deletion always uses ADR-0017.

## Design

Test new relationship brief, meeting follow-up, decision note, and corrected artifact workflows against synthetic then approved vault data. Exercise collision, symlink/path traversal, stale source, revoked grant, correction, archive, and exact deletion cases.

## Measures and decision rule

Measure usefulness, source-link validity, label correctness, vault-boundary safety, conflict handling, correction effort, verification/receipt quality, and cost. Any escape from the allowed root or deletion without exact authorization is a hard stop.

## Results record

Record artifact hashes and relative paths, sources, preview/approval/grant versions, verification, reviewer disposition, and de-identified outcomes; do not commit private vault content.
