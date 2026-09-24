# Evaluations

EVAL-001 is the deterministic, multi-turn evaluation for CAP-001. It is a bounded executable subset of the broader CTS-01 through CTS-25 regression contract; it does not replace that product-level suite. It executes
all 12 cases in `questions.json`, including relationship briefing, provenance
follow-ups, identity ambiguity and no-match behavior, partial and total source
failure, explicit unknowns, hostile source content, and blocked write intent.

The runner reports factual-claim correctness and recall, citation precision
and validity, unknown calibration, identity and conversation-state correctness,
and a machine-observable usefulness proxy separately. A passing aggregate is
not enough: every declared case acceptance check, response contract, and safety
gate must also pass.

`test/eval-mutations.test.mjs` proves that the evaluator rejects six important
regressions: wrong epistemic kind, missing or irrelevant citations, invented or
forbidden claims, incorrect identity, hostile-content leakage, and an executed
external action.

Run the suite with `pnpm eval` and the mutation checks with
`node --test test/eval-mutations.test.mjs`. The automated usefulness proxy does
not replace the 1-5 human usefulness evaluation defined for canonical EXP-001;
human usefulness and live Zoho/Obsidian behavior remain pending. Its selected identity/planning cases provide structural demonstration evidence for part of EXP-006, not full experimental validation.

EVAL-002 is the implemented fixture preflight for the thin EXP-001 reference path; it does not evaluate the live/human product hypothesis. EVAL-003 is a defined, non-executable evaluation plan for EXP-002 through EXP-012 other than the separately evaluated EXP-006 demonstration.

EVAL-004 is the defined, non-executable portfolio plan for EXP-013 through EXP-025. It adds evidence gates for read understanding, proposals/drafts, bounded reversible writes, cross-functional workflows, and only then bounded active management. It also requires grant/deletion safety, readable receipts, outcome/value evidence, and transparent economics. Linking a planned experiment to EVAL-003 or EVAL-004 records an evaluation design obligation, not evidence that the experiment or evaluator ran.
