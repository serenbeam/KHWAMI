"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { initializeCore } = require("../src/core/bootstrap");

function createFixture(area = "sales") {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "khwami-adopt-proposal-test-"));
  fs.writeFileSync(path.join(fixture, "package.json"), JSON.stringify({ name: "existing" }));
  fs.mkdirSync(path.join(fixture, "src", "modules", area), { recursive: true });
  fs.writeFileSync(path.join(fixture, "src", "modules", area, "index.js"), "module.exports = {};\n");
  fs.writeFileSync(path.join(fixture, "README.md"), "# Existing\n");
  return fixture;
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function createProposalResult(fixture, objective) {
  const core = initializeCore();
  const context = core.initializeContext({
    targetPath: fixture,
    userIntent: "adopt",
    adoptObjective: objective,
  });
  const analysis = core.workflowController.prepareWorkflow(
    core.workflowController.routeContext(context),
  );
  const requirements = core.workflowController.prepareAdoptRequirements(analysis);
  return {
    core,
    context,
    analysis,
    requirements,
    proposal: core.workflowController.createProposal(requirements),
  };
}

test("ADOPT proposal is READY for a grounded objective", () => {
  const fixture = createFixture();
  try {
    const { proposal } = createProposalResult(
      fixture,
      "Add offline support to the existing sales module",
    );

    assert.equal(proposal.proposal.type, "ADOPT_PROPOSAL");
    assert.equal(proposal.status, "READY");
    assert.equal(proposal.permissionRequired, false);
    assert.equal(proposal.proposal.executable, false);
    assert.equal(proposal.proposal.objective.source, "explicit");
    assert.ok(proposal.proposal.proposedChangeAreas.length > 0);
    assert.ok(proposal.proposal.evidence.length > 0);
    assert.ok(proposal.proposal.preservationScope.length > 0);
  } finally {
    removeFixture(fixture);
  }
});

test("missing ADOPT objective produces a blocked proposal result", () => {
  const fixture = createFixture();
  try {
    const { proposal } = createProposalResult(fixture, null);

    assert.equal(proposal.proposal.type, "ADOPT_PROPOSAL");
    assert.equal(proposal.status, "BLOCKED");
    assert.equal(proposal.permissionRequired, false);
    assert.equal(proposal.proposal.executable, false);
    assert.ok(proposal.proposal.unresolvedReviewItems.length > 0);
  } finally {
    removeFixture(fixture);
  }
});

test("broad ADOPT objective produces review-required proposal", () => {
  const fixture = createFixture();
  try {
    const { proposal } = createProposalResult(fixture, "Improve the application");

    assert.equal(proposal.proposal.type, "ADOPT_PROPOSAL");
    assert.equal(proposal.status, "REVIEW_REQUIRED");
    assert.equal(proposal.permissionRequired, false);
    assert.equal(proposal.proposal.executable, false);
  } finally {
    removeFixture(fixture);
  }
});

test("conflicting ADOPT objective remains non-executable", () => {
  const fixture = createFixture("server");
  try {
    const { proposal } = createProposalResult(fixture, "Update the mobile frontend");

    assert.equal(proposal.status, "REVIEW_REQUIRED");
    assert.equal(proposal.proposal.executable, false);
    assert.ok(proposal.proposal.unresolvedReviewItems.length > 0);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT proposal generation does not mutate the target", () => {
  const fixture = createFixture();
  try {
    const before = fs.readdirSync(fixture, { recursive: true }).sort();
    createProposalResult(fixture, "Add offline support to the existing sales module");
    const after = fs.readdirSync(fixture, { recursive: true }).sort();

    assert.deepEqual(after, before);
  } finally {
    removeFixture(fixture);
  }
});
