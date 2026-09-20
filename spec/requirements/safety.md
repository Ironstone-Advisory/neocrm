# Safety and human-control requirements

**Status:** Provisional

- **SAFE-ACT-001** — External writes MUST be disabled in the CAP-001 reference
  implementation. Attempted execution MUST fail closed.
- **SAFE-APP-001** — Source content is untrusted data. Instructions embedded in
  notes, messages, or records MUST NOT change system policy, initiate tools, or
  become recommendations solely because they are phrased as commands.
- **SAFE-DATA-001** — The assistant MUST retrieve only sources required by the
  source plan and MUST expose denied access as an unknown.
- **SAFE-IDENT-001** — Ambiguous identity MUST halt private context assembly
  until the user selects a candidate.

