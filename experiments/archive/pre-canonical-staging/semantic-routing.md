# Historical staging artifact: Semantic routing

**Archive status:** Mapped to canonical EXP-006

## Hypothesis

Planning from intent and adapter capabilities retrieves less irrelevant data
while retaining material context.

## Independent variable

Capability-aware Context Plan replaces unconditional source fan-out.

## Control

EXP-003 unconditional multi-source retrieval.

## Fixture

`fixtures/acme-relationship.json` plus one irrelevant mock source.

## Procedure

Compare retrieved record count, material-context recall, and source-failure
behavior across both planners.

## Measures

Recall, precision, records retrieved, visible source gaps, and adapter
substitutability.

## Success threshold

No recall loss, at least 25% fewer irrelevant records, and all failures visible.

## Falsification and decision rule

If routing hides a material item, retain broader retrieval until the capability
model explains the miss.

## Results

Pending.
