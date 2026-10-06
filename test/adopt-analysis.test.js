"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { initializeCore } = require("../src/core/bootstrap");

function createFixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "khwami-adopt-analysis-test-"));
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function createExistingProject(fixture) {
  fs.writeFileSync(
    path.join(fixture, "package.json"),
    JSON.stringify({
      name: "existing-project",
      engines: { node: ">=20" },
      dependencies: { react: "18.0.0" },
    }),
  );
  fs.mkdirSync(path.join(fixture, "src"));
  fs.writeFileSync(path.join(fixture, "src", "index.js"), "module.exports = {};\n");
  fs.writeFileSync(path.join(fixture, "README.md"), "# Existing project\n");
}

test("clear existing project produces a read-only ADOPT Analysis Result", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture);
    const before = fs.readdirSync(fixture).sort();
    const core = initializeCore();
    const context = core.initializeContext({ targetPath: fixture });
    const route = core.workflowController.routeContext(context);
    const analysis = core.workflowController.prepareWorkflow(route);

    assert.equal(context.classification, "ADOPT");
    assert.equal(analysis.type, "ADOPT_ANALYSIS_RESULT");
    assert.equal(analysis.workflow, "ADOPT");
    assert.ok(analysis.evidence.length > 0);
    assert.deepEqual(analysis.projectUnderstanding.existingFiles.value, [
      "README.md",
      "package.json",
    ]);
    assert.equal(analysis.projectUnderstanding.technology.value, "react");
    assert.equal(analysis.projectUnderstanding.runtime.value, "Node.js");
    assert.deepEqual(analysis.candidateActions, []);
    assert.deepEqual(fs.readdirSync(fixture).sort(), before);
  } finally {
    removeFixture(fixture);
  }
});

test("explicit ADOPT intent remains distinguishable from target evidence", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture);
    const context = initializeCore().initializeContext({
      targetPath: fixture,
      userIntent: "adopt",
    });
    const analysis = initializeCore().workflowController.prepareWorkflow(
      initializeCore().workflowController.routeContext(context),
    );

    assert.equal(analysis.type, "ADOPT_ANALYSIS_RESULT");
    assert.deepEqual(analysis.requirementReconciliation.explicit, [
      {
        key: "workflowSelection",
        value: "ADOPT",
        source: "explicit-context-selection",
      },
    ]);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT analysis does not run for ambiguous or empty targets", () => {
  const fixture = createFixture();
  try {
    const core = initializeCore();
    const context = core.initializeContext({
      targetPath: fixture,
      userIntent: "adopt",
    });
    const route = core.workflowController.routeContext(context);
    const prepared = core.workflowController.prepareWorkflow(route);

    assert.equal(context.classification, "AMBIGUOUS");
    assert.equal(prepared.type, "WORKFLOW_ROUTE");
    assert.equal(prepared.classification, "AMBIGUOUS");
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT analysis does not generate proposal or permission", () => {
  const fixture = createFixture();
  try {
    createExistingProject(fixture);
    const core = initializeCore();
    const context = core.initializeContext({ targetPath: fixture });
    const analysis = core.workflowController.prepareWorkflow(
      core.workflowController.routeContext(context),
    );
    const proposal = core.workflowController.createProposal(analysis);

    assert.equal(analysis.type, "ADOPT_ANALYSIS_RESULT");
    assert.equal(proposal.proposal, null);
    assert.equal(proposal.permissionRequired, false);
    assert.deepEqual(analysis.candidateActions, []);
  } finally {
    removeFixture(fixture);
  }
});
