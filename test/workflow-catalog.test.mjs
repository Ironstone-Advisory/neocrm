import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  workflowConformanceErrors,
  workflowSafetyFixtureErrors
} from "../packages/contracts/src/workflow-conformance.mjs";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const json = async (path) => JSON.parse(await read(path));

const expectedByFolder = {
  sales: [
    "WF-SAL-001-relationship-brief-and-meeting-prep",
    "WF-SAL-002-account-research-and-buying-group",
    "WF-SAL-003-lead-triage-and-call-plan",
    "WF-SAL-004-speed-to-lead-and-booking",
    "WF-SAL-005-opportunity-qualification-and-next-step",
    "WF-SAL-006-pipeline-review-and-hygiene",
    "WF-SAL-007-conversation-capture-and-commitment-review",
    "WF-SAL-008-consent-aware-follow-up",
    "WF-SAL-009-outreach-sequence-and-enrollment",
    "WF-SAL-010-account-and-mutual-action-plan",
    "WF-SAL-011-proposal-and-rfp-response",
    "WF-SAL-012-governed-crm-activity-and-opportunity-update",
    "WF-SAL-013-forecast-and-scenario-review",
    "WF-SAL-014-dormant-relationship-reactivation"
  ],
  marketing: [
    "WF-MKT-001-audience-and-contact-eligibility",
    "WF-MKT-002-campaign-brief-and-goal-plan",
    "WF-MKT-003-content-strategy-and-key-messages",
    "WF-MKT-004-content-and-asset-variant-drafting",
    "WF-MKT-005-brand-rights-and-claims-review",
    "WF-MKT-006-treatment-experiment-design",
    "WF-MKT-007-assignment-exposure-and-holdout-audit",
    "WF-MKT-008-adaptive-journey-recommendation",
    "WF-MKT-009-intent-signal-and-account-activation",
    "WF-MKT-010-inbound-qualification-booking-and-handoff",
    "WF-MKT-011-intelligent-marketing-follow",
    "WF-MKT-012-campaign-performance-and-attribution",
    "WF-MKT-013-weekly-growth-and-channel-brief",
    "WF-MKT-014-reputation-and-voice-of-customer"
  ],
  service: [
    "WF-SRV-001-customer-and-service-brief",
    "WF-SRV-002-case-intake-identity-and-entitlement",
    "WF-SRV-003-case-triage-and-priority",
    "WF-SRV-004-response-draft-and-deflection",
    "WF-SRV-005-sla-and-commitment-monitor",
    "WF-SRV-006-service-handoff-and-escalation",
    "WF-SRV-007-resolution-verification-and-closure",
    "WF-SRV-008-complaint-correction-and-redress",
    "WF-SRV-009-customer-health-review",
    "WF-SRV-010-success-plan-and-outcome-review",
    "WF-SRV-011-customer-onboarding-and-adoption",
    "WF-SRV-012-usage-and-entitlement-anomaly",
    "WF-SRV-013-renewal-readiness-and-churn-risk",
    "WF-SRV-014-expansion-with-service-guard",
    "WF-SRV-015-customer-education-and-enablement",
    "WF-SRV-016-service-knowledge-capture-and-update"
  ],
  _meta: [
    "WF-META-001-guided-onboarding-and-source-readiness",
    "WF-META-002-conversational-intent-router",
    "WF-META-003-relationship-operations-pulse",
    "WF-META-004-workflow-authoring-and-simulation"
  ],
  _shared: [
    "WF-SH-001-identity-and-source-resolution",
    "WF-SH-002-minimum-necessary-context-and-evidence",
    "WF-SH-003-consent-and-contact-safety",
    "WF-SH-004-evidence-and-epistemic-review",
    "WF-SH-005-data-quality-and-reconciliation",
    "WF-SH-006-time-locale-and-scheduling",
    "WF-SH-007-typed-handoff-and-seam-recovery",
    "WF-SH-008-governed-action-verification-and-receipt",
    "WF-SH-009-outcome-and-learning-capture"
  ]
};

async function loadDefinitions() {
  const registry = await json("workflows/registry.json");
  return Promise.all(registry.workflows.map(async (entry) => ({ entry, definition: await json(entry.path) })));
}

test("catalog contains exactly the approved 57 workflows in their canonical folders", async () => {
  const registry = await json("workflows/registry.json");
  assert.equal(registry.definitionCount, 57);
  assert.deepEqual(registry.groups, { sales: 14, marketing: 14, service: 16, meta: 4, shared: 9 });
  const actual = Object.fromEntries(Object.keys(expectedByFolder).map((folder) => [
    folder,
    registry.workflows
      .filter((entry) => entry.path.startsWith(`workflows/${folder}/`))
      .map((entry) => entry.path.split("/").at(-2))
  ]));
  assert.deepEqual(actual, expectedByFolder);
  assert.equal(new Set(registry.workflows.map((entry) => entry.workflowId)).size, 57);
  assert.equal(new Set(registry.workflows.map((entry) => entry.path)).size, 57);
  assert.equal(new Set(registry.workflows.map((entry) => entry.slug)).size, 57);
});

test("planned routing fixtures cover every routable workflow and clarify ambiguity", async () => {
  const registry = await json("workflows/registry.json");
  const fixtures = await json("workflows/routing-fixtures.json");
  assert.match(fixtures.status, /Planned routing fixtures only; no router runtime/i);
  const routable = registry.workflows.filter((entry) => entry.routable).map((entry) => entry.workflowId).sort();
  const selected = fixtures.cases
    .filter((fixture) => fixture.expected.kind === "workflow")
    .map((fixture) => fixture.expected.workflowId)
    .sort();
  assert.deepEqual(selected, routable);
  assert.equal(new Set(selected).size, selected.length);
  assert.ok(selected.every((id) => !id.startsWith("WF-SH-")));
  const ambiguous = fixtures.cases.filter((fixture) => fixture.expected.kind === "clarification");
  assert.ok(ambiguous.length >= 3);
  for (const fixture of ambiguous) {
    assert.ok(fixture.expected.candidateWorkflowIds.length >= 2);
    assert.match(fixture.expected.question, /\?$/);
    assert.ok(fixture.expected.candidateWorkflowIds.every((id) => routable.includes(id)));
  }
});

test("all generated definitions satisfy the strict WorkflowDefinition schema", async () => {
  const schema = await json("spec/contracts/workflow-definition.schema.json");
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  for (const { entry, definition } of await loadDefinitions()) {
    assert.equal(validate(definition), true, `${entry.workflowId}: ${JSON.stringify(validate.errors)}`);
    assert.equal(definition.classification.repositoryPath, entry.path);
  }
});

test("folder, domain, perspective, class and routing rules remain unambiguous", async () => {
  for (const { entry, definition } of await loadDefinitions()) {
    const folder = entry.path.split("/")[1];
    const expectedDomain = folder.startsWith("_") ? folder.slice(1) : folder;
    assert.equal(definition.classification.primaryDomain, expectedDomain);
    if (expectedDomain === "marketing") assert.equal(definition.classification.canonicalPerspective, "engagement");
    if (expectedDomain === "sales") assert.equal(definition.classification.canonicalPerspective, "sales");
    if (expectedDomain === "service") assert.equal(definition.classification.canonicalPerspective, "service");
    if (expectedDomain === "shared") {
      assert.equal(definition.workflowClass, "shared-control");
      assert.equal(definition.classification.routable, false);
      assert.deepEqual(definition.flow.triggerModes, ["workflow-call"]);
      assert.equal(definition.authority.mode, "internal-routine");
    } else {
      assert.equal(definition.classification.routable, true);
      assert.ok(!definition.flow.triggerModes.includes("workflow-call"));
    }
  }
});

test("workflow status keeps accepted specification separate from unproven runtime evidence", async () => {
  for (const { definition } of await loadDefinitions()) {
    if (definition.workflowId === "WF-SAL-001") {
      assert.equal(definition.status.specificationStatus, "Accepted");
      assert.equal(definition.status.implementationStatus, "NotStarted");
      assert.equal(definition.status.evidenceMaturity, "Unassessed");
      assert.equal(definition.status.deliveryHorizon, "P1");
      assert.deepEqual(definition.traceability.evaluationIds, []);
      assert.match(definition.status.evidenceBoundary, /related bounded read-only relationship-brief dependency, not this WorkflowDefinition wrapper/i);
    } else {
      assert.equal(definition.status.specificationStatus, "Proposed");
      assert.equal(definition.status.implementationStatus, "NotStarted");
      assert.equal(definition.status.evidenceMaturity, "Unassessed");
      assert.deepEqual(definition.traceability.evaluationIds, []);
      assert.equal(definition.evaluation.status, "NotStarted");
      assert.equal(definition.evaluation.plannedFixtureIds.length, 1);
      assert.match(definition.evaluation.evidenceGap, /must be created and run/i);
    }
    assert.equal(definition.evaluation.status, "NotStarted");
    assert.equal(definition.evaluation.plannedFixtureIds.length, 1);
    assert.equal(definition.authority.liveExecutionEnabled, false);
    assert.equal(definition.flow.scheduleRegistration, "not-implemented");
    assert.match(definition.status.runtimeClaim, /no workflow router, live write, send, schedule, or connection-registration runtime/i);
  }
});

test("traceability references resolve without inventing evaluations", async () => {
  const trace = await json("spec/traceability.json");
  const nodes = new Map(trace.nodes.map((node) => [node.id, node]));
  const decisions = await read("spec/product/decision-register.md");
  for (const { definition } of await loadDefinitions()) {
    for (const ids of ["capabilityIds", "objectIds", "viewIds", "requirementIds", "experimentIds", "evaluationIds"]) {
      for (const id of definition.traceability[ids]) assert.ok(nodes.has(id), `${definition.workflowId} has unresolved ${id}`);
    }
    for (const id of definition.traceability.decisionRegisterIds) {
      assert.match(decisions, new RegExp(`\\| ${id} \\|`), `${definition.workflowId} has unresolved ${id}`);
    }
  }
});

test("source, authority and deletion boundaries fail closed", async () => {
  for (const { definition } of await loadDefinitions()) {
    assert.ok(definition.sources.capabilityIntents.every((intent) => intent.endsWith(".read")));
    assert.equal(definition.sources.meaningRule, "Sources are selected by adapter capability intent and provide evidence; vendor products and schemas do not define NeoCRM canonical meaning.");
    assert.equal(definition.sources.readScope.principalBound, true);
    assert.equal(definition.sources.readScope.minimumNecessary, true);
    assert.equal(definition.sources.zeroConnectorFallback.supported, true);
    assert.match(definition.sources.zeroConnectorFallback.degradationDisclosure, /reduce freshness, completeness, verification and automation/i);
    assert.match(definition.authority.writeGrantRule, /never authorizes deletion/i);
    assert.match(definition.authority.deletionRule, /fresh exact human DeletionAuthorization bound to an immutable target list/i);
    assert.equal(definition.authority.connectionRegistrationGrantsAuthority, false);
    assert.equal(definition.operationalControls.receipt.humanReadable, true);
    assert.equal(definition.operationalControls.verification.requiredForExternalEffects, true);
    assert.equal(definition.operationalControls.budgets.currency, null, "host-neutral workflow definitions must not bind a workspace currency");
    assert.ok(definition.outputs.every((output) => output.epistemicCategory !== "recommendation"));
    assert.equal(definition.authority.requiresWriteGrantForExecution, definition.authority.writeIntent === "governed-action-proposal");
    if (definition.authority.writeIntent === "governed-action-proposal") {
      assert.deepEqual(
        definition.flow.steps.slice(5, 12).map((step) => step.kind),
        ["proposal", "preview", "policy", "authority", "execution", "verification", "receipt"]
      );
      assert.equal(definition.operationalControls.budgets.maxActions, 0, "scaffolding must not enable an action budget");
    }
  }
});

test("meta catalogue and authoring workflows do not over-request customer-record reads", async () => {
  const byId = new Map((await loadDefinitions()).map(({ definition }) => [definition.workflowId, definition]));
  for (const workflowId of ["WF-META-001", "WF-META-002", "WF-META-004"]) {
    const definition = byId.get(workflowId);
    assert.deepEqual(definition.sources.capabilityIntents, []);
    assert.deepEqual(definition.inputs.map((input) => input.inputId), ["IN-01", "IN-02"]);
    assert.match(definition.flow.steps[1].name, /without customer-record retrieval/i);
  }
  assert.ok(byId.get("WF-META-003").sources.capabilityIntents.length > 0, "the relationship operations pulse still declares its bounded evidence reads");
});

test("all definitions pass reusable semantic conformance, not only JSON Schema", async () => {
  const trace = await json("spec/traceability.json");
  const sourceCatalogue = await json("adapters/_catalog/capability-intents.json");
  const decisions = await read("spec/product/decision-register.md");
  const options = {
    knownTraceIds: new Set(trace.nodes.map((node) => node.id)),
    knownSourceIntentIds: new Set(sourceCatalogue.intents.map((intent) => intent.id)),
    knownDecisionIds: new Set([...decisions.matchAll(/\|\s*(D[0-9]{2})\s*\|/g)].map((match) => match[1]))
  };
  for (const { definition } of await loadDefinitions()) {
    assert.deepEqual(workflowConformanceErrors(definition, options), [], definition.workflowId);
  }
});

test("contact and decision-support workflows carry their specific safety controls", async () => {
  for (const { definition } of await loadDefinitions()) {
    if (/follow|outreach|booking|journey|reactivation|response|campaign|contact|inbound|education|enrollment/.test(definition.slug)) {
      const stops = definition.flow.stopConditions.join(" ");
      assert.match(stops, /Consent, suppression, frequency-cap, quiet-hours/i);
      assert.match(stops, /service conflict/i);
    }
    if (/triage|qualification|forecast|health|churn|intent|priority|attribution|performance|anomaly|risk|scoring/.test(definition.slug)) {
      const constraints = definition.goal.constraints.join(" ");
      assert.match(constraints, /evidence, counterevidence, unknowns/i);
      assert.match(constraints, /version, expiry and permitted use/i);
    }
  }
});

test("adapter manifests are strict, read-only and operationally explicit", async () => {
  const schema = await json("adapters/_catalog/adapter-manifest.schema.json");
  const intents = new Set((await json("adapters/_catalog/capability-intents.json")).intents.map((intent) => intent.id));
  const categories = new Set((await json("adapters/_catalog/source-categories.json")).categories.map((category) => category.id));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  for (const path of ["adapters/mock/adapter.manifest.json", "adapters/zoho/adapter.manifest.json", "adapters/obsidian/adapter.manifest.json"]) {
    const manifest = await json(path);
    assert.equal(validate(manifest), true, `${path}: ${JSON.stringify(validate.errors)}`);
    assert.ok(manifest.sourceCategories.every((category) => categories.has(category)));
    assert.ok(manifest.capabilityIntents.every((capability) => intents.has(capability.intentId)));
    assert.ok(manifest.capabilityIntents.every((capability) => capability.operations.every((operation) => operation === "read")));
    assert.equal(manifest.connection.registrationGrantsAuthority, false);
    assert.equal(manifest.authority.writeExecutionEnabled, false);
    assert.equal(manifest.authority.deletionExecutionEnabled, false);
    assert.equal(manifest.actionSafety.maximumMaterialEffect, "read-only");
    assert.match(manifest.dataSemantics.missingness, /none may be interpreted as zero or absence/i);
  }
});

test("guides and indexes expose progressive discovery, fallback and planned evidence", async () => {
  const rootReadme = await read("workflows/README.md");
  assert.ok(rootReadme.indexOf("Browse Sales") < rootReadme.indexOf("Browse Meta"));
  assert.match(rootReadme, /57 total = 14 Sales \+ 14 Marketing \+ 16 Service \+ 4 Meta \+ 9 Shared controls/);
  assert.match(rootReadme, /48 routable definitions/);
  assert.match(rootReadme, /nine Shared controls are \*\*internal and non-routable\*\*/);
  assert.match(rootReadme, /META-001 → META-002 → SAL-001 → SH-001 \/ SH-002 \/ SH-004/);
  for (const heading of ["Find by outcome", "First usable path", "How to read status", "Connections, local-only behavior and fallback"]) {
    assert.match(rootReadme, new RegExp(`## ${heading}`, "i"));
  }

  const firstExperiment = await read("workflows/FIRST-EXPERIMENT.md");
  assert.match(firstExperiment, /not evidence that 57 automations exist/i);
  assert.match(firstExperiment, /META-001 → META-002 → SAL-001 → SH-001 \/ SH-002 \/ SH-004/);
  assert.match(firstExperiment, /Zoho CRM[\s\S]*Obsidian[\s\S]*NeoCRM/);
  assert.match(firstExperiment, /operator-guided/);

  for (const folder of ["sales", "marketing", "service", "_meta", "_shared"]) {
    const index = await read(`workflows/${folder}/README.md`);
    for (const phrase of ["Choose by outcome", "authority mode", "Zero-connector fallback", "sole product authority"]) {
      assert.match(index, new RegExp(phrase, "i"));
    }
  }
  for (const { entry } of await loadDefinitions()) {
    const guide = await read(entry.path.replace(/workflow\.json$/, "GUIDE.md"));
    for (const heading of ["Job", "Use when", "Produces", "Flow", "Sources and fallback", "Authority and stops", "Evidence and status", "Example and fixture plan", "Related artifacts"]) {
      assert.match(guide, new RegExp(`## ${heading}`, "i"), `${entry.workflowId} lacks ${heading}`);
    }
  }
});

test("negative mutations reject the required workflow safety failures", async () => {
  const schema = await json("spec/contracts/workflow-definition.schema.json");
  const governedSchema = await json("spec/contracts/governed-action.schema.json");
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validateDefinition = ajv.compile(schema);
  const validateGovernedAction = ajv.compile(governedSchema);
  const [{ definition: source }] = (await loadDefinitions()).filter(({ definition }) => definition.workflowId === "WF-SAL-008");

  const unscoped = structuredClone(source);
  unscoped.sources.readScope.principalBound = false;
  assert.equal(validateDefinition(unscoped), false);

  const silentFact = structuredClone(source);
  silentFact.outputs[0].epistemicCategory = "fact";
  silentFact.outputs[0].evidenceRequired = false;
  assert.equal(validateDefinition(silentFact), false);

  const noWriteAuthority = structuredClone(source);
  noWriteAuthority.authority.requiresWriteGrantForExecution = false;
  assert.equal(validateDefinition(noWriteAuthority), false);

  const unknownTrace = structuredClone(source);
  unknownTrace.traceability.requirementIds = ["FR-UNKNOWN-999"];
  const knownIds = new Set((await json("spec/traceability.json")).nodes.map((node) => node.id));
  assert.ok(workflowConformanceErrors(unknownTrace, { knownTraceIds: knownIds }).some((error) => error.code === "UNKNOWN_TRACEABILITY_REFERENCE"));

  const brokenStepReference = structuredClone(source);
  brokenStepReference.flow.steps[0].outputIds = ["OUT-99"];
  assert.ok(workflowConformanceErrors(brokenStepReference).some((error) => error.code === "UNKNOWN_OUTPUT_REFERENCE"));

  const epistemicConflation = structuredClone(source);
  epistemicConflation.outputs[2].epistemicCategory = "recommendation";
  assert.ok(workflowConformanceErrors(epistemicConflation).some((error) => error.code === "RECOMMENDATION_IS_NOT_EPISTEMIC"));

  const writeGrant = {
    kind: "WriteGrant",
    grantId: "grant-test",
    principalId: "principal-1",
    grantorHumanActorId: "human-1",
    purpose: "Test a registered non-delete workflow",
    experimentId: "EXP-015",
    workflowDefinitionIds: ["WF-SAL-012"],
    systems: ["test-system"],
    operations: ["update"],
    targetScopes: [{ system: "test-system", objectType: "Opportunity", fields: ["Stage"], recordScope: { kind: "exact-records", recordIds: ["opp-1"] } }],
    riskCeiling: "medium",
    materialEffectBoundary: "non-destructive-only",
    effectClassificationPolicyId: "effect-policy.v1",
    effectiveAt: "2026-09-24T10:00:00Z",
    expiresAt: "2026-09-24T13:00:00Z",
    revocable: true,
    limits: { maxActions: 1, maxActionsPerHour: 1, maxCost: 0, currency: "CAD" },
    approvalMode: "per-action",
    verificationRequired: true,
    receiptRequired: true,
    compensationPlan: "Correct through a separately governed action."
  };
  assert.equal(validateGovernedAction(writeGrant), true, JSON.stringify(validateGovernedAction.errors));
  assert.equal(validateGovernedAction({ ...writeGrant, operations: ["delete"] }), false);

  const safe = {
    principalTenantId: "tenant-1",
    subjectTenantId: "tenant-1",
    readScope: { principalBound: true, purposeBound: true, minimumNecessary: true },
    factualOutput: true,
    evidenceIds: ["evidence-1"],
    operation: "send",
    authority: { kind: "WriteGrant", expiresAt: "2026-09-24T13:00:00Z" },
    consentSatisfied: true,
    result: "succeeded",
    verified: true
  };
  assert.deepEqual(workflowSafetyFixtureErrors(safe), []);
  assert.ok(workflowSafetyFixtureErrors({ ...safe, authority: undefined }).includes("WRITE_AUTHORITY_REQUIRED"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, operation: "delete" }).includes("DELETION_REQUIRES_EXACT_AUTHORIZATION"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, authority: { ...safe.authority, expiresAt: "2026-09-24T11:00:00Z" } }).includes("GRANT_EXPIRED"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, authority: { ...safe.authority, revokedAt: "2026-09-24T11:30:00Z" } }).includes("GRANT_REVOKED"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, subjectTenantId: "tenant-2" }).includes("CROSS_TENANT_ACCESS"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, consentSatisfied: false }).includes("CONTACT_CONSENT_REQUIRED"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, verified: false }).includes("UNVERIFIED_SUCCESS"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, evidenceIds: [] }).includes("SILENT_FACT_PROMOTION"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, readScope: { ...safe.readScope, minimumNecessary: false } }).includes("UNSCOPED_READ"));
  assert.ok(workflowSafetyFixtureErrors({ ...safe, futureRunClaimed: true }).includes("SCHEDULE_NOT_REGISTERED"));
});
