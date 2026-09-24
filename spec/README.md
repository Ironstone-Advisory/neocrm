# Specification authority

`spec/` is the single authoritative design boundary for NeoCRM. Code,
prototypes, experiments, and research may test the specification; they do not
silently redefine it.

## Authority and precedence

Normative material uses RFC 2119 terms (`MUST`, `SHOULD`, and `MAY`) and a
stable identifier recorded in [`traceability.json`](traceability.json).
Conflicts are resolved in this order:

1. safety and privacy requirements;
2. normative JSON Schemas under `domain/schemas/`;
3. accepted capability, functional, and quality requirements;
4. accepted Architecture Decision Records;
5. descriptive domain, experience, architecture, product, and vision text.

JSON Schema is the normative representation of exchanged data. The TypeScript
types in `packages/contracts` are a checked projection for developer
ergonomics. If the two disagree, the schema wins and the projection must be
corrected.

Research, experiment plans/results, evaluation outputs, prototypes, examples,
and implementation notes are informative evidence unless explicitly promoted
through this lifecycle.

## Lifecycle

Normative artifacts have one status:

- **Draft** — incomplete and unsuitable as a dependency.
- **Proposed** — reviewable but not yet used as the development baseline.
- **Provisional** — the development baseline while linked evidence is gathered.
- **Accepted** — supported by linked experiment/evaluation evidence.
- **Superseded** or **Rejected** — retained for decision history.

A Provisional artifact becomes Accepted only when each required trace follows
typed lifecycle links to a validated experiment, passed evaluation, verified
implementation, and validated result that meet its acceptance rule. A
demonstration result may support continued Provisional development, but it is
not validation evidence. A change to semantics, safety, or externally visible
contracts requires a new or amended ADR and traceability update in the same
change.

## Required trace

```text
Capability -> FR/NFR/SAFE -> ADR -> EXP -> EVAL -> implementation -> result
```

`pnpm validate:spec` validates `traceability.json` against
`traceability.schema.json`; rejects invalid node kinds, lifecycle statuses, and
edge direction; reconciles artifact status and ADR validation declarations;
and requires every capability requirement to end in result evidence scoped to
the same experiment, evaluation, and implementation. Sequencing links such as
`precedes` never count as evidence. CI runs that command on every change.
