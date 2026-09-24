# EXP-002: Persistence substitution

## Hypothesis

The same user questions can be answered with materially similar quality when one underlying persistence system is replaced, without changing the intelligence layer's user-facing semantics.

## Setup

Run representative questions against two source configurations, for example an operational CRM plus Markdown knowledge repository and a spreadsheet plus web knowledge repository.

## Success criteria

- User intent and canonical domain concepts remain unchanged.
- Results retain source-specific provenance.
- Differences caused by source coverage or quality are explained.
- No adapter-specific terminology leaks into the primary user experience unless useful for transparency.

