# CAP-001 context engine

This package is the deterministic reference implementation for a bounded part of NeoCRM's Context/Data Access and Relationship Orchestration responsibilities. It resolves identity, creates an intent-specific capability-aware source plan, reads contract-compatible fixture or live adapters, normalizes/reconciles evidence, constructs response categories, applies the no-write policy, and emits structured lifecycle events.

The historical package name is retained for compatibility. The package is **not the complete Relationship Intelligence Layer**: the separate bounded runtime supports only one RelationshipBriefAgent; there is no live model provider, general proactive runtime, hybrid persistence, multi-Agent collaboration, adaptive outcome-learning loop, or external execution.

Authority, freshness, optional calibrated confidence, completeness, and epistemic category are independent. Source authority does not create a Fact or numerical confidence. Recommendations are decision-oriented contracts rather than Assertion kinds. Context planning requires an explicit intent and minimum required domain set.
