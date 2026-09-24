# Safety and human-control requirements

**Status:** Proposed

Accepted portfolio safety requirements SAFE-GRANT-001, SAFE-DELETE-001, SAFE-SCORE-001, SAFE-ATTRIB-001, SAFE-SURVEIL-001, and SAFE-CONTACT-001 are specified in [experimental authority](experimental-authority.md) and [approved portfolio](approved-portfolio.md). A timed WriteGrant never authorizes deletion; every delete needs fresh exact human authorization for its immutable target list.

- **SAFE-IDENT-001** — Ambiguous identity MUST halt private context retrieval until safely resolved; candidate summaries MUST expose only authorized disambiguation data.
- **SAFE-DATA-001** — Retrieval and Handoff MUST use minimum-necessary authorized data for a declared purpose. A denial MUST NOT disclose whether protected data exists.
- **SAFE-CONSENT-001** — Consent, Preference, suppression, purpose, classification, retention, and deletion constraints MUST be evaluated for retrieval, memory, communication, Campaigns, and learning use.
- **SAFE-INJECT-001** — Source, user, model, and Agent content is untrusted data. Embedded instructions MUST NOT change policy, Plans, authority, tools, or action state.
- **SAFE-CRED-001** — Models and Agents MUST NOT receive source credentials, native execute handles, unrestricted filesystem/network access, or direct policy mutation capability.
- **SAFE-DELEG-001** — Agents MUST NOT expand or transfer authority beyond a valid Delegation/ToolGrant; multi-Agent Handoffs preserve isolation and least context.
- **SAFE-ACT-001** — Consequential effects MUST use independent policy, exact preview, risk-appropriate approval, isolated execution, verification, audit, and compensation/escalation.
- **SAFE-AUTO-001** — v0.1 supports autonomy Levels 0-2; Level 3 is experiment-only and reversible; Levels 4-5 are deferred.
- **SAFE-HARM-001** — Policy and evaluation MUST test unwanted contact, manipulation, unfair/discriminatory treatment, privacy/service harm, vulnerable-context risk, complaints, and redress.
- **SAFE-LEARN-001** — LearningSignals MUST NOT directly mutate production facts, customer profiles, consent/preferences, policy, authority, AgentDefinitions, prompts, models, mappings, or evaluation criteria.
- **SAFE-MEM-001** — Durable MemoryItems require explicit purpose, provenance, classification, admission, expiry, correction/deletion, and access policy; conversational residue is not memory.
- **SAFE-ACT-002** — The current CAP-001 implementation MUST reject every external write and durable-memory attempt, including after text claiming approval.
