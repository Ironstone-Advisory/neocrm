# Source note: Sunday AI Coffee House working session

**Intake date:** 2026-10-25 · **Session notes dated:** 2026-03-15 · **Author:** Rob Tyrie, Ironstone Advisory, with Claude

A long Sunday working session with the AI Coffee House group ranged from film to AI sales tooling. Part of it was product design that belongs in NeoCRM. This note records what was absorbed, where it landed, and what was deliberately left out, so the provenance survives the chat.

## Absorbed into NeoCRM

| Session idea | Where it landed | Status |
| --- | --- | --- |
| Sales methodology as a plug-in, not a workflow (Rob's favourites: MEDDIC, Crossing the Chasm, Consultative Selling, The Trusted Advisor, LAMP, Challenger, JOLT) | FR-METHOD-001, [methodology packs](../../../spec/domain/methodology/README.md) | Proposed |
| MEDDPICC-scored account brief | [MEDDPICC pack](../../../spec/domain/methodology/meddpicc.md), used by WF-SAL-005 and WF-SAL-010 | Proposed |
| Sales-to-services handoff agent, raised before proposal | FR-SVCSCOPE-001, [WF-SAL-015](../../../workflows/sales/WF-SAL-015-pre-proposal-services-scoping-handoff/GUIDE.md) | Proposed |
| Coaching the team toward a top performer's patterns | EXP-023 addition: exemplars with consent, never a ranking | Proposed |
| AI token pricing with Stripe and Ramp | EXP-025 addition: external adapters under D06 | Proposed |
| Account planning skill built in the session | [skills/account-planning](../../../skills/account-planning/SKILL.md), rewritten to be methodology-neutral | Proposed |

## Changed on the way in

The skill drafted in the session hardcoded MEDDIC, gave scores no version or expiry, and had an "EQ signals" section that could present inferred sentiment as fact. The repository version fixes all three: methodology comes from a pack, assessments expire, and relationship observations must cite evidence or be marked as the seller's own judgment.

## Routed elsewhere

- **Personal research librarian** (capture, tag, summarize, weekly digest of articles) and **video-to-skill extraction** from transcript, audio and video: knowledge ingestion, so they belong to NeoLibrary, not NeoCRM. Useful there as intake adapters, not as model changes.

## Left out on purpose

- Fully autonomous outbound SDR agents. Draft-only and consent-gated sending already cover the useful part.
- Any score of a person's emotional intelligence, trustworthiness or character, customer or employee.
- Vendor product recommendations (Clay, Gong, Clari and similar). Sources enter through capability-intent adapters; vendors never define canonical meaning (ADR-0006).
