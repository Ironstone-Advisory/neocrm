# Relationship Intelligence plane

**Status:** Proposed

The Relationship Intelligence Layer (RIL) is the coherent product plane formed by three independently governed boundaries:

1. **Agent Runtime:** creates versioned AgentRuns, reasons toward Goals, constructs Plans, delegates specialist work, and produces typed outputs.
2. **Relationship Orchestration:** coordinates Agents and humans, workflows, policy, approvals, action lifecycle, exceptions, and Outcomes.
3. **Context and Data Access:** resolves identity, requests minimum evidence, normalizes and reconciles it, and returns versioned ContextSnapshots with provenance and uncertainty.

The separation is mandatory:

- an Agent cannot retrieve arbitrary source data or execute an effect directly;
- orchestration cannot treat model output or source content as authority;
- context services do not decide business goals or action permission;
- policy decisions are independently recorded;
- credentials and native execute handles remain behind integration/action gateways; and
- outcomes do not update AgentDefinitions, prompts, models, mappings, or policies without governed evaluation and release.

CAP-001 implements a deterministic subset of Context/Data Access plus narrow orchestration. It does not implement the full RIL or a production Agent Runtime.
