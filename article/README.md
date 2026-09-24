# NeoCRM publication package

**Status:** Publication-ready editorial draft with remote evidence locked; venue details, figure exports and live/human results are pending.

This directory contains a venue-neutral article package about the NeoCRM architecture and its first experiment. It must travel with its evidence boundary: the current verified results are local, synthetic and structural. EXP-001 remains Planned until permissioned live A/B/C cases and the human evaluation are recorded.

## Contents

| File | Purpose |
| --- | --- |
| [`draft.md`](draft.md) | Long-form publication draft, SEO metadata, evidence boundary and call to action |
| [`evidence-ledger.md`](evidence-ledger.md) | Claim-by-claim sources, commands, evidence tiers, immutable evidence commit and CI run |
| [`publication-checklist.md`](publication-checklist.md) | Evidence, privacy, attribution, visual, SEO and release checks |
| [`figures/architecture.mmd`](figures/architecture.mmd) | Versioned publication source for the seven-layer architecture figure |
| [`figures/README.md`](figures/README.md) | Figure caption, alt text and export instructions |
| [`linkedin-draft.md`](linkedin-draft.md) | Optional launch post with an eventual article URL placeholder |

## Venue-neutral workflow

1. Edit `draft.md` in the repository; keep venue-specific biography, canonical URL and formatting outside the master until the venue is chosen.
2. Confirm every quantitative or current-capability claim appears in `evidence-ledger.md`.
3. Run the full repository gate and relative-link check.
4. Commit the exact source state intended for publication and push it to the feature branch.
5. Wait for green CI on that exact commit.
6. Replace the remaining venue and visual placeholders in the package:

   - `{{ARCHITECTURE_FIGURE_URL}}`
   - `{{ARTICLE_URL}}`

7. Export the Mermaid figure to SVG and high-resolution PNG, then apply the caption and alt text in `figures/README.md`.
8. Complete every applicable item in `publication-checklist.md`.
9. Save the final published URL and immutable evidence links back into the ledger.

Search for `{{` before publication. No placeholder should remain in published copy.

## Evidence rules

- A specification is evidence of an intended design, not a current product capability.
- A passing synthetic fixture is evidence of bounded implementation behaviour, not live-system value.
- EVAL-001's automated usefulness proxy is not human usefulness.
- A live smoke test is not an EXP-001 result.
- A single-user exploratory pilot cannot establish general market, revenue or customer outcomes.
- Negative and inconclusive results must remain visible.

Do **not** claim that NeoCRM works with live Zoho or a private Obsidian vault, saves preparation time, improves decisions, unifies production sales/service/marketing, or changes business outcomes until the corresponding EXP-001 evidence has been collected and linked.

## Updating the article after EXP-001

When the permissioned pilot is complete:

1. freeze and link the preregistration and exact code/configuration versions;
2. add de-identified aggregate A/B/C results and deviations to the experiment directory;
3. record hard stops, errors, negative feedback and limitations;
4. update the Live Pilot and Human Evaluation sections of the evidence ledger;
5. revise the article's evidence and “what this proves” sections without changing the historical pre-publication result; and
6. request an independent evidence review before republishing.

External publication is a separate action. Nothing in this package authorizes publishing, announcing live results, or sharing customer data.
