// IMP-006 - Status: Implemented. Bounded, read-only EXP-001 agent-run reference path.
import { assertContract } from "../../contracts/src/runtime.mjs";
import { opaqueId } from "../../relationship-intelligence/src/ids.mjs";
import { CAP001_RELATIONSHIP_BRIEF_DOMAINS } from "../../relationship-intelligence/src/planner.mjs";

export const RELATIONSHIP_BRIEF_AGENT = Object.freeze(
  assertContract("AgentDefinition", {
    contractType: "agent_definition",
    agentId: "agent.relationship-brief",
    name: "RelationshipBriefAgent",
    version: "0.1.0",
    capabilities: ["CAP-001"],
    allowedOperations: ["read"]
  })
);

function auditEvent(runId, event, occurredAt, safeMetadata = {}) {
  return assertContract("AuditEvent", {
    contractType: "audit_event",
    eventId: opaqueId("audit", runId, event, occurredAt, safeMetadata),
    runId,
    event,
    occurredAt,
    safeMetadata
  });
}

export function createReadOnlyGrant({
  delegator = "human:experiment-operator",
  expiresAt,
  agentId = RELATIONSHIP_BRIEF_AGENT.agentId
}) {
  return assertContract("AuthorityGrant", {
    contractType: "authority_grant",
    grantId: opaqueId("grant", delegator, agentId, expiresAt),
    delegator,
    agentId,
    capability: "CAP-001",
    operations: ["read"],
    expiresAt
  });
}

function policyDecision(grant, now) {
  const validAgent = grant.agentId === RELATIONSHIP_BRIEF_AGENT.agentId;
  const unexpired = Date.parse(grant.expiresAt) >= Date.parse(now);
  const readOnly = grant.operations.length === 1 && grant.operations[0] === "read";
  const allow = validAgent && unexpired && readOnly && grant.capability === "CAP-001";
  const reasonCode = !validAgent || grant.capability !== "CAP-001"
    ? "GRANT_INVALID"
    : !unexpired
      ? "GRANT_EXPIRED"
      : !readOnly
        ? "WRITE_NOT_ALLOWED"
        : "READ_ONLY_GRANT_VALID";
  return assertContract("PolicyDecision", {
    contractType: "policy_decision",
    decisionId: opaqueId("policy", grant.grantId, now, reasonCode),
    decision: allow ? "allow" : "deny",
    allowedOperations: allow ? ["read"] : [],
    reasonCode
  });
}

function createGoal(trigger) {
  return assertContract("Goal", {
    contractType: "goal",
    goalId: opaqueId("goal", trigger.triggerId, "relationship_brief"),
    intent: "relationship_brief",
    objective: "Prepare a grounded, read-only relationship brief for the resolved Party.",
    requiredDomains: [...CAP001_RELATIONSHIP_BRIEF_DOMAINS],
    constraints: {
      externalWrites: false,
      durableMemory: false,
      minimumNecessary: true
    }
  });
}

function createPlan(goal) {
  const kinds = [
    "policy_precheck",
    "identity_resolution",
    "context_retrieval",
    "synthesis"
  ];
  return assertContract("Plan", {
    contractType: "plan",
    planId: opaqueId("plan", goal.goalId),
    goalId: goal.goalId,
    steps: kinds.map((kind, index) => ({
      stepId: `step-${index + 1}-${kind}`,
      kind,
      operation: "read",
      status: "planned"
    }))
  });
}

function completePlan(plan, response, denied = false) {
  const next = structuredClone(plan);
  const identityBoundaryFailed = response?.unknowns?.some(
    (item) => item.predicate === "party.identity" && /boundary was unavailable/i.test(item.text)
  );
  const unresolvedIdentity = Boolean(response?.subject?.unresolvedQuery);
  for (const step of next.steps) {
    if (denied) {
      step.status = step.kind === "policy_precheck" ? "completed" : "blocked";
    } else if (identityBoundaryFailed) {
      step.status = step.kind === "policy_precheck"
        ? "completed"
        : step.kind === "identity_resolution"
          ? "failed"
          : "blocked";
    } else if (step.kind === "identity_resolution" && response?.status === "needs_disambiguation") {
      step.status = "completed";
    } else if (
      response?.status === "needs_disambiguation" &&
      ["context_retrieval", "synthesis"].includes(step.kind)
    ) {
      step.status = "blocked";
    } else if (unresolvedIdentity) {
      step.status = ["policy_precheck", "identity_resolution"].includes(step.kind)
        ? "completed"
        : "blocked";
    } else if (response?.status === "error" && ["context_retrieval", "synthesis"].includes(step.kind)) {
      step.status = "failed";
    } else {
      step.status = "completed";
    }
  }
  return assertContract("Plan", next);
}

function runStatus(response) {
  if (!response) return "failed";
  if (response.status === "needs_disambiguation") return "needs_disambiguation";
  return ["complete", "partial"].includes(response.status) ? "completed" : "failed";
}

export async function runRelationshipBriefAgent({
  trigger,
  authorityGrant,
  contextBoundary,
  now,
  auditLogger = { log() {} }
}) {
  const validatedTrigger = assertContract("Trigger", trigger);
  const grant = assertContract("AuthorityGrant", authorityGrant);
  const currentTime = new Date(now).toISOString();
  const runId = opaqueId(
    "run",
    RELATIONSHIP_BRIEF_AGENT.agentId,
    RELATIONSHIP_BRIEF_AGENT.version,
    validatedTrigger,
    grant.grantId
  );
  const audit = [];
  const emit = (event, metadata = {}) => {
    const item = auditEvent(runId, event, currentTime, metadata);
    audit.push(item);
    auditLogger.log(structuredClone(item));
  };

  emit("run.started", { triggerKind: validatedTrigger.kind });
  const goal = createGoal(validatedTrigger);
  let plan = createPlan(goal);
  const decision = policyDecision(grant, currentTime);
  emit("policy.checked", { decision: decision.decision, reasonCode: decision.reasonCode });

  const handoff = assertContract("Handoff", {
    contractType: "handoff",
    handoffId: opaqueId("handoff", runId, "not_required"),
    fromAgentId: RELATIONSHIP_BRIEF_AGENT.agentId,
    toAgentId: RELATIONSHIP_BRIEF_AGENT.agentId,
    status: "not_required",
    reason: "Single-agent EXP-001 reference run."
  });

  if (decision.decision === "deny") {
    plan = completePlan(plan, null, true);
    emit("run.denied", { reasonCode: decision.reasonCode });
    return assertContract("AgentRun", {
      contractType: "agent_run",
      runId,
      agent: RELATIONSHIP_BRIEF_AGENT,
      grant,
      trigger: validatedTrigger,
      goal,
      plan,
      policyDecision: decision,
      status: "denied",
      brief: null,
      contextSnapshot: null,
      handoff,
      audit
    });
  }

  if (!contextBoundary || typeof contextBoundary.resolve !== "function") {
    throw new TypeError("A credential-isolating context boundary is required.");
  }
  let brief;
  try {
    brief = await contextBoundary.resolve({
      trigger: validatedTrigger,
      goal,
      traceId: runId
    });
  } catch {
    plan = completePlan(plan, {
      status: "error",
      subject: { unresolvedQuery: validatedTrigger.query },
      unknowns: [{ predicate: "party.identity", text: "The identity boundary was unavailable." }]
    });
    emit("run.failed", { reasonCode: "CONTEXT_BOUNDARY_FAILED" });
    return assertContract("AgentRun", {
      contractType: "agent_run",
      runId,
      agent: RELATIONSHIP_BRIEF_AGENT,
      grant,
      trigger: validatedTrigger,
      goal,
      plan,
      policyDecision: decision,
      status: "failed",
      brief: null,
      contextSnapshot: null,
      handoff,
      audit
    });
  }
  plan = completePlan(plan, brief);
  const resolvedPartyId = brief.subject?.partyId;
  const contextSnapshot = resolvedPartyId
    ? assertContract("ContextSnapshot", {
        contractType: "context_snapshot",
        snapshotId: opaqueId("snapshot", runId, brief.evidence.map((item) => item.evidenceId)),
        capturedAt: currentTime,
        subjectPartyId: resolvedPartyId,
        evidenceIds: brief.evidence.map((item) => item.evidenceId),
        sourceStatuses: (brief.sourcePlan?.steps ?? []).map((step) => ({
          adapterId: step.adapterId,
          status: step.status
        })),
        containsCredentials: false,
        containsRawPrivateContent: false
      })
    : null;
  emit("run.completed", {
    status: runStatus(brief),
    evidenceCount: brief.evidence.length
  });

  return assertContract("AgentRun", {
    contractType: "agent_run",
    runId,
    agent: RELATIONSHIP_BRIEF_AGENT,
    grant,
    trigger: validatedTrigger,
    goal,
    plan,
    policyDecision: decision,
    status: runStatus(brief),
    brief,
    contextSnapshot,
    handoff,
    audit
  });
}

export function recordHumanFeedback({ run, rating, notes = "", now }) {
  const validatedRun = assertContract("AgentRun", run);
  const recordedAt = new Date(now).toISOString();
  const outcome = assertContract("Outcome", {
    contractType: "outcome",
    outcomeId: opaqueId("outcome", validatedRun.runId, rating, notes, recordedAt),
    runId: validatedRun.runId,
    recordedAt,
    rating,
    notes
  });
  const learningSignal = assertContract("LearningSignal", {
    contractType: "learning_signal",
    signalId: opaqueId("learning", outcome.outcomeId),
    outcomeId: outcome.outcomeId,
    kind: "human_feedback",
    effect: "record_only",
    prohibitedMutations: [
      "prompt",
      "policy",
      "mapping",
      "configuration",
      "source_data"
    ]
  });
  return { outcome, learningSignal };
}
