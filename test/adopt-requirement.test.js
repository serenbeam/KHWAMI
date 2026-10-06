"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { initializeCore } = require("../src/core/bootstrap");

function createFixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "khwami-adopt-requirement-test-"));
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function createExistingProject(fixture, area = "sales") {
  fs.writeFileSync(
    path.join(fixture, "package.json"),
    JSON.stringify({ name: "existing", engines: { node: ">=20" } }),
  );
  fs.mkdirSync(path.join(fixture, "src", "modules", area), { recursive: true });
  fs.writeFileSync(path.join(fixture, "src", "modules", area, "index.js"), "module.exports = {};\n");
  fs.writeFileSync(path.join(fixture, "README.md"), "# Existing\n");
}

function analyzeRequirements(fixture, objective) {
  const core = initializeCore();
  const context = core.initializeContext({
    targetPath: fixture,
    userIntent: "adopt",
    adoptObjective: objective,
  });
  const analysis = core.workflowController.prepareWorkflow(
    core.workflowController.routeContext(context),
  );
  return {
    core,
    context,
    analysis,
    result: core.workflowController.prepareAdoptRequirements(analysis),
  };
}

test("explicit ADOPT objective reconciles with an existing project area", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture, "sales");
    const { result } = analyzeRequirements(
      fixture,
      "Add offline support to the sales module",
    );

    assert.equal(result.type, "ADOPT_REQUIREMENT_RESULT");
    assert.equal(result.adoptObjective.status, "RESOLVED");
    assert.equal(result.adoptObjective.source, "explicit");
    assert.equal(result.requirementReconciliation.status, "RESOLVED");
    assert.equal(result.proposalReadiness.sufficient, true);
    assert.ok(result.requirementReconciliation.relevantExistingAreas.some((item) => item.includes("sales")));
  } finally {
    removeFixture(fixture);
  }
});

test("missing ADOPT objective remains unresolved", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture);
    const { result } = analyzeRequirements(fixture, null);

    assert.equal(result.adoptObjective.status, "UNRESOLVED");
    assert.equal(result.adoptObjective.source, "none");
    assert.equal(result.proposalReadiness.sufficient, false);
    assert.equal(result.requirementReconciliation.status, "BLOCKED");
  } finally {
    removeFixture(fixture);
  }
});

test("broad ADOPT objective remains review-required", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture);
    const { result } = analyzeRequirements(fixture, "Improve the application");

    assert.equal(result.adoptObjective.status, "UNRESOLVED");
    assert.equal(result.requirementReconciliation.status, "REVIEW_REQUIRED");
    assert.equal(result.proposalReadiness.sufficient, false);
  } finally {
    removeFixture(fixture);
  }
});

test("objective/evidence conflict remains unresolved", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture, "server");
    const { result } = analyzeRequirements(fixture, "Update the mobile frontend");

    assert.equal(result.adoptObjective.status, "RESOLVED");
    assert.equal(result.requirementReconciliation.status, "REVIEW_REQUIRED");
    assert.equal(result.proposalReadiness.sufficient, false);
    assert.ok(result.requirementReconciliation.conflicts.length > 0);
  } finally {
    removeFixture(fixture);
  }
});

test("existing evidence remains separate from explicit objective", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture, "sales");
    const { result } = analyzeRequirements(fixture, "Add offline support to sales");
    const explicitValues = result.requirementReconciliation.objective;

    assert.equal(explicitValues, "Add offline support to sales");
    assert.ok(result.supportingEvidence.length > 0);
    assert.equal(result.requirementReconciliation.explicit[0].source, "explicit");
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT requirement analysis does not create proposal or mutate target", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture);
    const before = fs.readdirSync(fixture).sort();
    const { core, result } = analyzeRequirements(fixture, "Add offline support to sales");
    const proposal = core.workflowController.createProposal(result);

    assert.equal(proposal.proposal.type, "ADOPT_PROPOSAL");
    assert.equal(proposal.permissionRequired, false);
    assert.equal(proposal.proposal.executable, false);
    assert.deepEqual(fs.readdirSync(fixture).sort(), before);
  } finally {
    removeFixture(fixture);
  }
});
