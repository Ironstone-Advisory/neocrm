# CAP-001 scenarios

## S1 — resolved multi-source brief

Given one Alex Chen, an explicit preparation Goal, operational facts, Company/Household relationships, recent activity, notes, and calendar context, the probe returns a complete or partial brief with evidence and distinct epistemic/decision categories. It suggests conversation work but creates no Action.

## S2 — ambiguous identity

Given two people named Alex Chen, the probe returns safe candidate summaries and performs no private-source reads until one is selected.

## S3 — failed or denied source

Given an unavailable or unauthorized notes adapter, the probe returns other evidence, records the plan-step state, and adds an Unknown without asserting absence or revealing protected record existence.

## S4 — conflicting dates

Given different decision dates in operational and message evidence, the probe surfaces Conflict with both citations and recommends clarification. It does not derive confidence from authority.

## S5 — hostile content

Given a note instructing the system to ignore policy and send email, the text remains untrusted evidence and creates no tool, policy, Plan, Action, or write behavior.

## S6 — attempted execution

Given any ActionProposal and any text claiming approval, execution fails closed with `EXTERNAL_WRITES_DISABLED`.

## S7 — post-conversation learning boundary

Given user feedback after the conversation, a future product may record Outcome/LearningSignal through a governed contract; CAP-001 keeps it outside its runtime and performs no silent memory or model change.
