# Publication checklist

Use this checklist for any venue. A checked item means the published artifact—not only the local draft—satisfies it.

## Evidence lock and remote verification

- [ ] Commit the complete article package and all cited repository artifacts to the intended branch.
- [ ] Replace `{{FINAL_COMMIT_SHA}}` and `{{FINAL_COMMIT_URL}}` in `evidence-ledger.md` with a permanent GitHub commit permalink.
- [ ] Confirm the remote commit contains the exact article, specifications, experiment files, tests and evidence cited in the ledger.
- [ ] Run the full repository gate against that exact commit.
- [ ] Add the final green CI run URL as `{{CI_RUN_URL}}`.
- [ ] Confirm CI reports the same specification, test, mutation and EVAL-001 counts used in the article.
- [ ] If any count changed, update both `draft.md` and `evidence-ledger.md`; do not preserve a more attractive older number.
- [ ] Run the repository relative-link checker after the final article edits.
- [ ] Search the article package for unresolved placeholders: `{{`.

## Claim and evidence review

- [ ] Every quantitative or current-capability statement appears in `evidence-ledger.md`.
- [ ] Concept, Specification, Synthetic Fixture, Automated Evaluation, Live Pilot, Human Evaluation and Business Outcome evidence remain visibly distinct.
- [ ] The article says that the current evidence is synthetic and structural.
- [ ] CAP-001 is described as a bounded capability and EXP-001 as a planned product experiment.
- [ ] The automated usefulness proxy is not described as human usefulness.
- [ ] Fixture Conditions B/C are not described as a live Zoho/Obsidian result.
- [ ] There is no claim of preparation-time reduction, administrative savings, customer improvement, revenue impact, production security, compliance or product-market fit without matching evidence.
- [ ] Negative, failed and inconclusive results are included when they exist.
- [ ] Limitations and generalizability are stated next to the relevant result, not hidden in a footnote.
- [ ] The original essay's administrative percentage, market-size, inevitability, lower-customization and incumbent-disruption claims remain omitted unless direct current sources and methodology are added.

## EXP-001 live and human-result status

- [ ] Record the publication-time status as one of: not started, running, completed/inconclusive, completed/failed or completed/supported.
- [ ] If the live pilot has not run, retain the explicit statement that live and human evidence is pending.
- [ ] If live results are added, freeze and link the preregistration, versions, deviations, case count, aggregate results, hard stops and limitations.
- [ ] Link de-identified Condition A/B/C results; never publish source bodies or identifiable customer records.
- [ ] Report human errors, distrust, corrections and negative preferences as well as favourable scores.
- [ ] Do not generalize a single-user or small exploratory pilot to a market.
- [ ] Do not call an opt-in smoke test product validation.

## Zoho and Obsidian implementation claims

- [ ] Cite official Zoho documentation for any published OAuth, API, scope, pagination, rate-limit or module-behaviour claim.
- [ ] Cite official Obsidian documentation for any published vault, Markdown, metadata or application-behaviour claim.
- [ ] Distinguish official product behaviour from NeoCRM adapter behaviour.
- [ ] Verify that the final article does not imply endorsement by Zoho or Obsidian.
- [ ] Confirm trademarks are used descriptively and correctly.
- [ ] If no live run exists, use “production-shaped read-only adapter” rather than “live integration” or “production integration.”

## Privacy, consent and de-identification

- [ ] Confirm that every committed example is synthetic, aggregate or properly de-identified.
- [ ] Search the article package and linked result files for names, email addresses, phone numbers, account identifiers, tenant identifiers, tokens, absolute vault paths and private source excerpts.
- [ ] Confirm permission, purpose, source allowlists, retention, deletion, withdrawal and incident paths before any live scenario.
- [ ] Confirm no identifiable pilot data or per-person output is committed.
- [ ] Review examples for re-identification risk even when direct identifiers were removed.
- [ ] Confirm the article does not reveal the existence of access-controlled records.
- [ ] Record any consent, fairness, manipulation, customer-harm, complaint or redress event, including zero only when it was actually measured.

## Architecture figure

- [ ] Render `figures/architecture.mmd` to SVG and a high-resolution PNG.
- [ ] Verify Mermaid source and exported image match the canonical seven-layer architecture.
- [ ] Use the approved caption from `figures/README.md`.
- [ ] Attach the approved alt text from `figures/README.md` to the published image.
- [ ] Confirm the diagram remains understandable in grayscale and does not rely on colour alone.
- [ ] Check text legibility on desktop and mobile.
- [ ] Add the final image URL to `{{ARCHITECTURE_FIGURE_URL}}` in the evidence ledger.
- [ ] Retain the Mermaid source in the repository as the versioned figure source.

## SEO and editorial quality

- [ ] Keep the SEO title at 60 characters or fewer.
- [ ] Keep the meta description at 160 characters or fewer.
- [ ] Retain one H1 and descriptive H2 headings.
- [ ] Use the primary keyword naturally in the title, opening, one heading or early section, meta description and slug.
- [ ] Avoid keyword stuffing and unsupported superlatives.
- [ ] Verify the 100-150 word opening after final edits.
- [ ] Keep paragraphs short and define technical terms on first use.
- [ ] Confirm every acronym is expanded on first use.
- [ ] Check quotations and attribution against the source.
- [ ] Add venue-specific canonical URL, author biography, publication date and social preview only after the venue is selected.
- [ ] Proofread Canadian/US spelling choices for consistency with the selected venue.

## License, attribution and disclosure

- [ ] Confirm repository license terms permit publication and clarify whether prose/figures use the repository license or a separate publication license.
- [ ] Attribute Rob Tyrie as author and identify the originating essay when its final title/URL is available.
- [ ] Attribute third-party trademarks and external sources appropriately.
- [ ] Confirm no confidential research source is reproduced beyond its permitted use.
- [ ] Retain the AI-assistance acknowledgment in the article.
- [ ] Ensure the disclosure accurately describes assistance with research synthesis, specification work, implementation, testing, review and drafting.
- [ ] Record the final human editor/reviewer responsible for the published version.

## Publication and post-publication

- [ ] Replace `{{ARTICLE_URL}}` in `evidence-ledger.md` and `linkedin-draft.md` after publication.
- [ ] Verify every published link resolves to the intended immutable or authoritative target.
- [ ] Save the final published text and image references in the repository.
- [ ] Establish a correction contact and update path.
- [ ] Correct the article if later verification changes a current-capability claim.
- [ ] Update the evidence ledger rather than silently rewriting historical results.
- [ ] Invite scrutiny and permissioned pilot participation without soliciting customer data in public comments.
