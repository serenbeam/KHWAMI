"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { initializeCore } = require("../src/core/bootstrap");
const { analyzeCreateContext } = require("../src/core/create-analysis");

function createFixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "khwami-create-analysis-test-"));
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

test("CREATE analysis reports missing project requirements without inventing actions", () => {
  const fixture = createFixture();
  try {
    const target = path.join(fixture, "new-target");
    fs.mkdirSync(target);
    fs.writeFileSync(path.join(target, "README.md"), "# placeholder\n");
    fs.writeFileSync(path.join(target, "package.json"), "{}\n");
    const before = fs.readdirSync(target).sort();
    const core = initializeCore();
    const context = core.initializeContext({
      targetPath: target,
      userIntent: "create",
    });

    assert.equal(context.classification, "CREATE");
    const analysis = analyzeCreateContext(context);

    assert.equal(analysis.type, "CREATE_ANALYSIS_RESULT");
    assert.equal(analysis.workflow, "CREATE");
    assert.equal(analysis.sufficientForProposal, false);
    assert.equal(analysis.candidateActions.length, 0);
    assert.ok(analysis.unresolvedDecisions.length > 0);
    assert.deepEqual(fs.readdirSync(target).sort(), before);
  } finally {
    removeFixture(fixture);
  }
});

test("complete minimum CREATE requirements become sufficient for proposal preparation", () => {
  const fixture = createFixture();
  try {
    const core = initializeCore();
    const context = core.initializeContext({
      targetPath: fixture,
      userIntent: "create",
      projectPurpose: "Provide a local command-line tool",
      projectType: "React Native mobile application",
      initialScope: "Accept input and report analysis results",
    });
    const analysis = analyzeCreateContext(context);
    const proposal = core.workflowController.createProposal(
      core.workflowController.prepareWorkflow(core.workflowController.routeContext(context)),
    );

    assert.equal(analysis.sufficientForProposal, true);
    assert.equal(analysis.requirements.missing.length, 0);
    assert.ok(analysis.candidateActions.length > 0);
    assert.equal(analysis.candidateActions.every((action) => action.action === "REVIEW"), true);
    assert.equal(proposal.status, "PROPOSED");
    assert.equal(proposal.permissionRequired, false);
  } finally {
    removeFixture(fixture);
  }
});

test("concrete CREATE proposal is generated from completed analysis", () => {
  const fixture = createFixture();
  try {
    const core = initializeCore();
    const context = core.initializeContext({
      targetPath: fixture,
      userIntent: "create",
      projectPurpose: "Check clipboard grammar",
      projectType: "React Native mobile application",
      initialScope: "Analyze clipboard text",
    });
    const analysis = core.workflowController.prepareWorkflow(
      core.workflowController.routeContext(context),
    );
    const result = core.workflowController.createProposal(analysis);

    assert.equal(result.proposal.type, "CREATE_PROPOSAL");
    assert.match(result.proposal.summary, /Check clipboard grammar/);
    assert.ok(result.proposal.actions.length > 0);
    assert.equal(result.proposal.actions.every((action) => action.type === "REVIEW"), true);
    assert.equal(result.proposal.actions.every((action) => action.source), true);
    assert.ok(result.proposal.preservedScope.length > 0);
    assert.ok(result.proposal.unresolvedReviewItems.length > 0);
    assert.equal(result.proposal.readiness, "BLOCKED");
    assert.equal(result.permissionRequired, false);
    assert.equal("executionActions" in result.proposal, false);
  } finally {
    removeFixture(fixture);
  }
});

test("project-shape analysis derives technology, platform, and runtime provenance", () => {
  const fixture = createFixture();
  try {
    const context = initializeCore().initializeContext({
      targetPath: fixture,
      userIntent: "create",
      projectPurpose: "Check clipboard grammar",
      projectType: "React Native mobile application",
      initialScope: "Analyze clipboard text",
    });
    const analysis = analyzeCreateContext(context);

    assert.equal(analysis.projectShape.application.value, "mobile application");
    assert.equal(analysis.projectShape.application.source, "explicit-requirement");
    assert.equal(analysis.projectShape.platform.value, "mobile");
    assert.equal(analysis.projectShape.platform.source, "derived-from-requirement");
    assert.equal(analysis.projectShape.technology.value, "React Native");
    assert.equal(analysis.projectShape.runtime.value, "JavaScript/TypeScript ecosystem");
    assert.equal(analysis.sufficientForProposal, true);
  } finally {
    removeFixture(fixture);
  }
});

test("blocking project-shape decisions prevent proposal generation", () => {
  const fixture = createFixture();
  try {
    const core = initializeCore();
    const context = core.initializeContext({
      targetPath: fixture,
      userIntent: "create",
      projectPurpose: "Build a local tool",
      projectType: "application",
      initialScope: "Process input",
    });
    const analysis = core.workflowController.prepareWorkflow(
      core.workflowController.routeContext(context),
    );
    const result = core.workflowController.createProposal(analysis);

    assert.equal(analysis.sufficientForProposal, false);
    assert.equal(result.proposal, null);
    assert.equal(result.permissionRequired, false);
  } finally {
    removeFixture(fixture);
  }
});

test("empty target does not receive an invented project template", () => {
  const fixture = createFixture();
  try {
    const context = initializeCore().initializeContext({
      targetPath: fixture,
      userIntent: "create",
      projectPurpose: "Build a local tool",
      projectType: "application",
      initialScope: "Process input",
    });
    const analysis = analyzeCreateContext(context);

    assert.equal(analysis.projectShape.sourceOrganization.status, "unresolved");
    assert.equal(analysis.projectShape.architecture.status, "unresolved");
    assert.equal(analysis.candidateActions.every((action) => action.action === "REVIEW"), true);
    assert.equal(fs.readdirSync(fixture).length, 0);
  } finally {
    removeFixture(fixture);
  }
});

test("target package evidence is derived and is not an explicit requirement", () => {
  const fixture = createFixture();
  try {
    fs.writeFileSync(
      path.join(fixture, "package.json"),
      JSON.stringify({ dependencies: { "react-native": "1.0.0" } }),
    );
    const context = initializeCore().initializeContext({
      targetPath: fixture,
      userIntent: "create",
      projectPurpose: "Build a mobile tool",
      projectType: "mobile application",
      initialScope: "Process text",
    });
    const analysis = analyzeCreateContext(context);

    assert.equal(analysis.projectShape.technology.value, "React Native");
    assert.equal(analysis.projectShape.technology.source, "target-evidence");
    assert.equal(
      analysis.requirements.explicit.some((item) => item.key === "technology"),
      false,
    );
    assert.equal(fs.readFileSync(path.join(fixture, "package.json"), "utf8").includes("react-native"), true);
  } finally {
    removeFixture(fixture);
  }
});

test("unresolved architecture decisions remain explicit", () => {
  const fixture = createFixture();
  try {
    const context = initializeCore().initializeContext({
      targetPath: fixture,
      userIntent: "create",
      projectPurpose: "Build a mobile tool",
      projectType: "React Native mobile application",
      initialScope: "Process text",
    });
    const analysis = analyzeCreateContext(context);

    assert.equal(analysis.projectShape.architecture.status, "unresolved");
    assert.ok(analysis.unresolvedDecisions.some((item) => item.key === "architecture"));
    assert.equal(analysis.projectShape.sourceOrganization.status, "unresolved");
  } finally {
    removeFixture(fixture);
  }
});

test("partial CREATE requirements remain unresolved", () => {
  const fixture = createFixture();
  try {
    const context = initializeCore().initializeContext({
      targetPath: fixture,
      userIntent: "create",
      projectPurpose: "Provide a local command-line tool",
    });
    const analysis = analyzeCreateContext(context);
    const missingKeys = analysis.unresolvedDecisions.map((item) => item.key);

    assert.equal(analysis.sufficientForProposal, false);
    assert.ok(missingKeys.includes("projectType"));
    assert.ok(missingKeys.includes("initialScope"));
  } finally {
    removeFixture(fixture);
  }
});

test("CREATE analysis represents incomplete input explicitly", () => {
  const fixture = createFixture();
  try {
    const context = initializeCore().initializeContext({
      targetPath: fixture,
      userIntent: "create",
    });
    const analysis = analyzeCreateContext(context);
    const unresolvedKeys = analysis.unresolvedDecisions.map((item) => item.key);

    assert.ok(unresolvedKeys.includes("projectPurpose"));
    assert.ok(unresolvedKeys.includes("projectType"));
    assert.ok(unresolvedKeys.includes("initialScope"));
    assert.deepEqual(analysis.assumptions, []);
  } finally {
    removeFixture(fixture);
  }
});

test("existing project evidence remains ADOPT and does not enter CREATE analysis", () => {
  const fixture = createFixture();
  try {
    const target = path.join(fixture, "existing");
    fs.mkdirSync(target);
    fs.writeFileSync(path.join(target, "index.js"), "module.exports = {};\n");
    const core = initializeCore();
    const context = core.initializeContext({ targetPath: target });
    const route = core.workflowController.routeContext(context);
    const prepared = core.workflowController.prepareWorkflow(route);

    assert.equal(context.classification, "ADOPT");
    assert.equal(prepared.type, "ADOPT_ANALYSIS_RESULT");
    assert.equal(prepared.workflow, "ADOPT");
    assert.deepEqual(prepared.candidateActions, []);
  } finally {
    removeFixture(fixture);
  }
});

test("conflicting CREATE evidence remains AMBIGUOUS and produces no proposal", () => {
  const fixture = createFixture();
  try {
    const target = path.join(fixture, "existing");
    fs.mkdirSync(target);
    fs.writeFileSync(path.join(target, "index.js"), "module.exports = {};\n");
    const core = initializeCore();
    const context = core.initializeContext({
      targetPath: target,
      userIntent: "create",
    });
    const route = core.workflowController.routeContext(context);
    const prepared = core.workflowController.prepareWorkflow(route);
    const proposal = core.workflowController.createProposal(prepared);

    assert.equal(context.classification, "AMBIGUOUS");
    assert.equal(prepared.classification, "AMBIGUOUS");
    assert.equal(proposal.proposal, null);
    assert.equal(proposal.permissionRequired, false);
  } finally {
    removeFixture(fixture);
  }
});

test("CREATE analysis reaches the existing controller boundary without execution", () => {
  const fixture = createFixture();
  try {
    const core = initializeCore();
    const context = core.initializeContext({
      targetPath: fixture,
      userIntent: "create",
    });
    const route = core.workflowController.routeContext(context);
    const analysis = core.workflowController.prepareWorkflow(route);
    const proposal = core.workflowController.createProposal(analysis);

    assert.equal(analysis.type, "CREATE_ANALYSIS_RESULT");
    assert.equal(proposal.status, "UNRESOLVED");
    assert.equal(proposal.permissionRequired, false);
    assert.equal(proposal.proposal, null);
  } finally {
    removeFixture(fixture);
  }
});

test("CREATE analysis does not authorize candidate actions", () => {
  const fixture = createFixture();
  try {
    const context = initializeCore().initializeContext({
      targetPath: fixture,
      userIntent: "create",
    });
    const analysis = analyzeCreateContext(context);

    for (const action of analysis.candidateActions) {
      assert.ok(action.evidence || action.supportingEvidence || action.reason);
      assert.notEqual(action.approved, true);
      assert.notEqual(action.authorized, true);
    }
  } finally {
    removeFixture(fixture);
  }
});
