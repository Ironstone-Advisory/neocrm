const decisionArtifactTypes = new Set([
  "brief",
  "recommendation",
  "draft",
  "plan",
  "handoff",
  "action-proposal",
  "policy-decision-input",
  "evidence-gap",
  "learning-signal"
]);

const expectedFolderByDomain = {
  sales: "sales",
  marketing: "marketing",
  service: "service",
  meta: "_meta",
  shared: "_shared"
};

const asSet = (value) => value instanceof Set ? value : new Set(value ?? []);

const addError = (errors, code, path, message) => {
  errors.push({ code, path, message });
};

const indexById = (errors, values, key, path) => {
  const result = new Map();
  for (const value of values ?? []) {
    const id = value?.[key];
    if (result.has(id)) addError(errors, "DUPLICATE_INTERNAL_ID", `${path}.${id}`, `${id} is duplicated.`);
    result.set(id, value);
  }
  return result;
};

const validateReference = (errors, collection, id, path, code) => {
  if (id !== null && id !== undefined && !collection.has(id)) {
    addError(errors, code, path, `${id} does not resolve inside the WorkflowDefinition.`);
  }
};

const hasDependencyCycle = (steps) => {
  const state = new Map();
  const byId = new Map((steps ?? []).map((step) => [step.stepId, step]));
  const visit = (stepId) => {
    const current = state.get(stepId);
    if (current === "visiting") return true;
    if (current === "visited") return false;
    state.set(stepId, "visiting");
    for (const dependency of byId.get(stepId)?.dependsOn ?? []) {
      if (byId.has(dependency) && visit(dependency)) return true;
    }
    state.set(stepId, "visited");
    return false;
  };
  return [...byId.keys()].some(visit);
};

const containsOrderedKinds = (steps, expected) => {
  let cursor = 0;
  for (const step of steps ?? []) {
    if (step.kind === expected[cursor]) cursor += 1;
    if (cursor === expected.length) return true;
  }
  return false;
};

/**
 * Cross-field and reference conformance that JSON Schema cannot express.
 * The function is side-effect free so generation checks, tests, and a future
 * registry loader can use the same acceptance logic.
 */
export function workflowConformanceErrors(definition, options = {}) {
  const errors = [];
  if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
    return [{ code: "INVALID_DEFINITION", path: "$", message: "WorkflowDefinition must be an object." }];
  }

  const knownTraceIds = asSet(options.knownTraceIds);
  const knownDecisionIds = asSet(options.knownDecisionIds);
  const knownSourceIntentIds = asSet(options.knownSourceIntentIds);
  const inputs = indexById(errors, definition.inputs, "inputId", "inputs");
  const outputs = indexById(errors, definition.outputs, "outputId", "outputs");
  const steps = indexById(errors, definition.flow?.steps, "stepId", "flow.steps");
  const policies = indexById(errors, definition.policies, "policyId", "policies");
  const escalations = indexById(errors, definition.flow?.escalations, "escalationId", "flow.escalations");
  indexById(errors, definition.handoffs, "handoffId", "handoffs");

  const folder = expectedFolderByDomain[definition.classification?.primaryDomain];
  const expectedPath = folder && definition.workflowId && definition.slug
    ? `workflows/${folder}/${definition.workflowId}-${definition.slug}/workflow.json`
    : null;
  if (expectedPath && definition.classification?.repositoryPath !== expectedPath) {
    addError(errors, "CANONICAL_PATH_MISMATCH", "classification.repositoryPath", `Expected ${expectedPath}.`);
  }
  if (definition.classification?.primaryDomain === "marketing" && definition.classification?.canonicalPerspective !== "engagement") {
    addError(errors, "MARKETING_IS_ENGAGEMENT", "classification.canonicalPerspective", "Marketing navigation must map to the canonical Engagement perspective.");
  }
  if (definition.classification?.primaryDomain === "shared") {
    if (definition.classification?.routable !== false) {
      addError(errors, "SHARED_MUST_NOT_ROUTE", "classification.routable", "Shared control workflows are not directly routable.");
    }
    const triggers = definition.flow?.triggerModes ?? [];
    if (triggers.length !== 1 || triggers[0] !== "workflow-call") {
      addError(errors, "SHARED_TRIGGER_BOUNDARY", "flow.triggerModes", "Shared controls may be invoked only by a registered parent workflow.");
    }
  } else if (definition.classification?.routable !== true) {
    addError(errors, "BUSINESS_WORKFLOW_MUST_ROUTE", "classification.routable", "Non-shared catalogue workflows must be discoverable by the router.");
  }

  const principal = inputs.get("IN-01");
  const intentGoal = inputs.get("IN-02");
  if (principal?.semanticType !== "principal" || principal?.required !== true) {
    addError(errors, "PRINCIPAL_INPUT_REQUIRED", "inputs.IN-01", "IN-01 must bind the authenticated principal and purpose.");
  }
  if (intentGoal?.semanticType !== "goal" || intentGoal?.required !== true) {
    addError(errors, "GOAL_INPUT_REQUIRED", "inputs.IN-02", "IN-02 must bind Intent and Goal before retrieval.");
  }

  const declaredSourceIntents = new Set(definition.sources?.capabilityIntents ?? []);
  if (declaredSourceIntents.size === 0 && definition.classification?.primaryDomain !== "meta") {
    addError(errors, "EMPTY_SOURCE_PLAN", "sources.capabilityIntents", "Only a meta workflow may operate without external source retrieval.");
  }
  for (const intent of declaredSourceIntents) {
    if (!intent.endsWith(".read")) {
      addError(errors, "SOURCE_INTENT_NOT_READ", "sources.capabilityIntents", `${intent} is not a read capability intent.`);
    }
    if (knownSourceIntentIds.size > 0 && !knownSourceIntentIds.has(intent)) {
      addError(errors, "UNKNOWN_SOURCE_INTENT", "sources.capabilityIntents", `${intent} is not registered in the source capability catalogue.`);
    }
  }
  const inputSourceIntents = new Set();
  for (const input of definition.inputs ?? []) {
    const intent = input.sourceCapabilityIntent;
    if (intent === null || intent === undefined) continue;
    inputSourceIntents.add(intent);
    if (!declaredSourceIntents.has(intent)) {
      addError(errors, "UNDECLARED_INPUT_SOURCE_INTENT", `inputs.${input.inputId}.sourceCapabilityIntent`, `${intent} is not declared by sources.capabilityIntents.`);
    }
  }
  for (const intent of declaredSourceIntents) {
    if (!inputSourceIntents.has(intent)) {
      addError(errors, "UNBOUND_SOURCE_INTENT", "sources.capabilityIntents", `${intent} has no typed workflow input.`);
    }
  }

  const scope = definition.sources?.readScope;
  if (!scope?.principalBound || !scope?.purposeBound || !scope?.minimumNecessary) {
    addError(errors, "UNSCOPED_READ", "sources.readScope", "Reads must be principal-bound, purpose-bound, and minimum necessary.");
  }

  for (const output of definition.outputs ?? []) {
    if (output.epistemicCategory === "recommendation") {
      addError(errors, "RECOMMENDATION_IS_NOT_EPISTEMIC", `outputs.${output.outputId}.epistemicCategory`, "Recommendation is a decision artifact, not an epistemic category.");
    }
    if (decisionArtifactTypes.has(output.semanticType) && output.epistemicCategory !== "not-applicable") {
      addError(errors, "DECISION_ARTIFACT_EPISTEMIC_CONFLATION", `outputs.${output.outputId}.epistemicCategory`, `${output.semanticType} must preserve contained epistemic items rather than acquire their category.`);
    }
  }

  for (const step of definition.flow?.steps ?? []) {
    for (const id of step.dependsOn ?? []) validateReference(errors, steps, id, `flow.steps.${step.stepId}.dependsOn`, "UNKNOWN_STEP_REFERENCE");
    for (const id of step.inputIds ?? []) validateReference(errors, inputs, id, `flow.steps.${step.stepId}.inputIds`, "UNKNOWN_INPUT_REFERENCE");
    for (const id of step.outputIds ?? []) validateReference(errors, outputs, id, `flow.steps.${step.stepId}.outputIds`, "UNKNOWN_OUTPUT_REFERENCE");
    for (const id of step.policyIds ?? []) validateReference(errors, policies, id, `flow.steps.${step.stepId}.policyIds`, "UNKNOWN_POLICY_REFERENCE");
    validateReference(errors, escalations, step.escalationId, `flow.steps.${step.stepId}.escalationId`, "UNKNOWN_ESCALATION_REFERENCE");
  }
  if (hasDependencyCycle(definition.flow?.steps)) {
    addError(errors, "CYCLIC_STEP_DEPENDENCY", "flow.steps", "Workflow step dependencies must be acyclic.");
  }
  for (const branch of definition.flow?.branches ?? []) {
    for (const key of ["afterStepId", "onTrueStepId", "onFalseStepId"]) {
      validateReference(errors, steps, branch[key], `flow.branches.${branch.branchId}.${key}`, "UNKNOWN_BRANCH_STEP_REFERENCE");
    }
  }

  const authority = definition.authority ?? {};
  const governed = authority.writeIntent === "governed-action-proposal";
  if (authority.requiresWriteGrantForExecution !== governed) {
    addError(errors, "WRITE_GRANT_BOUNDARY", "authority.requiresWriteGrantForExecution", "Only governed external-action proposals require a WriteGrant; drafts do not execute externally.");
  }
  if (governed && !containsOrderedKinds(definition.flow?.steps, ["proposal", "preview", "policy", "authority", "execution", "verification", "receipt"])) {
    addError(errors, "GOVERNED_LIFECYCLE_INCOMPLETE", "flow.steps", "Governed actions require proposal, preview, policy, authority, execution, verification, and receipt in order.");
  }
  if (authority.connectionRegistrationGrantsAuthority !== false) {
    addError(errors, "CONNECTION_GRANTS_AUTHORITY", "authority.connectionRegistrationGrantsAuthority", "Registering a connection must grant no read or action authority.");
  }
  if (authority.liveExecutionEnabled !== false || definition.operationalControls?.budgets?.maxActions !== 0) {
    addError(errors, "LIVE_EXECUTION_NOT_ALLOWED", "authority.liveExecutionEnabled", "Catalogue scaffolding must not enable live execution or an action budget.");
  }
  if (definition.operationalControls?.budgets?.maxCost === 0 && definition.operationalControls?.budgets?.currency !== null) {
    addError(errors, "HOST_CURRENCY_LEAK", "operationalControls.budgets.currency", "A zero-cost host-neutral definition must leave currency unbound for a future run or workspace policy.");
  }

  const traceability = definition.traceability ?? {};
  for (const key of ["capabilityIds", "objectIds", "viewIds", "requirementIds", "experimentIds", "evaluationIds"]) {
    for (const id of traceability[key] ?? []) {
      if (knownTraceIds.size > 0 && !knownTraceIds.has(id)) {
        addError(errors, "UNKNOWN_TRACEABILITY_REFERENCE", `traceability.${key}`, `${id} is not registered in spec/traceability.json.`);
      }
    }
  }
  for (const id of traceability.decisionRegisterIds ?? []) {
    if (knownDecisionIds.size > 0 && !knownDecisionIds.has(id)) {
      addError(errors, "UNKNOWN_DECISION_REFERENCE", "traceability.decisionRegisterIds", `${id} is not registered in the product decision register.`);
    }
  }

  const demonstrated = definition.status?.evidenceMaturity === "Demonstrated" || definition.evaluation?.status === "Demonstrated";
  if (demonstrated && (definition.evaluation?.status !== "Demonstrated" || (traceability.evaluationIds?.length ?? 0) === 0)) {
    addError(errors, "UNSUPPORTED_DEMONSTRATION_CLAIM", "status.evidenceMaturity", "A demonstrated workflow requires workflow-level evaluation status and a registered evaluation reference.");
  }
  if (definition.status?.implementationStatus === "NotStarted" && definition.status?.evidenceMaturity !== "Unassessed") {
    addError(errors, "STATUS_AXIS_CONFLICT", "status", "A not-started workflow cannot claim demonstrated implementation evidence.");
  }
  if (definition.evaluation?.status === "NotStarted" && !(definition.evaluation?.plannedFixtureIds?.length > 0)) {
    addError(errors, "PLANNED_FIXTURE_REQUIRED", "evaluation.plannedFixtureIds", "An unassessed workflow must name a planned fixture without claiming it was run.");
  }

  return errors;
}

/**
 * Evaluates a proposed run/effect fixture using the same fail-closed rules that
 * tests and future orchestration adapters can share. It performs no effects.
 */
export function workflowSafetyFixtureErrors(fixture, now = "2026-09-24T12:00:00Z") {
  const errors = [];
  if (!fixture?.readScope?.principalBound || !fixture?.readScope?.purposeBound || !fixture?.readScope?.minimumNecessary) {
    errors.push("UNSCOPED_READ");
  }
  if (fixture?.principalTenantId !== fixture?.subjectTenantId) errors.push("CROSS_TENANT_ACCESS");
  if (fixture?.factualOutput && !(fixture?.evidenceIds?.length > 0)) errors.push("SILENT_FACT_PROMOTION");
  if (fixture?.operation && fixture.operation !== "read") {
    if (fixture.operation === "delete") {
      if (fixture.authority?.kind !== "DeletionAuthorization") errors.push("DELETION_REQUIRES_EXACT_AUTHORIZATION");
    } else if (fixture.authority?.kind !== "WriteGrant") {
      errors.push("WRITE_AUTHORITY_REQUIRED");
    }
    if (fixture.authority?.kind === "WriteGrant") {
      if (fixture.authority.revokedAt) errors.push("GRANT_REVOKED");
      const expiry = Date.parse(fixture.authority.expiresAt);
      if (!Number.isFinite(expiry)) errors.push("GRANT_EXPIRY_REQUIRED");
      else if (expiry <= Date.parse(now)) errors.push("GRANT_EXPIRED");
    }
  }
  if (fixture?.operation === "send" && fixture?.consentSatisfied !== true) errors.push("CONTACT_CONSENT_REQUIRED");
  if (fixture?.result === "succeeded" && fixture?.verified !== true) errors.push("UNVERIFIED_SUCCESS");
  if (fixture?.futureRunClaimed === true && !fixture?.schedulerId) errors.push("SCHEDULE_NOT_REGISTERED");
  return errors;
}
