# EXP-006: Semantic routing and entity resolution

**Status:** Demonstrated

Test whether the context boundary selects the necessary source capabilities and resolves Parties from natural-language relationship requests without vendor-specific prompts or unsafe private reads.

Cases include ambiguous names, duplicate Companies, mixed Roles, unavailable/denied sources, intent-specific minimum context, and source substitution. Measure identity precision/recall, safe clarification, wrong-person private reads, plan necessity/coverage, denied non-disclosure, and CTS-24.

The current synthetic deterministic CAP-001 suite demonstrates selected identity gating and capability planning. It does not validate live identity quality, truly intent-variable planning, production authorization, or human clarification quality. See [`results.md`](results.md).
