"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { initializeCore } = require("../src/core/bootstrap");
const { deriveCreateActions } = require("../src/core/create-action-derivation");
const { analyzeCreateContext } = require("../src/core/create-analysis");

function createFixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "khwami-action-derivation-test-"));
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function analyze(fixture, projectType, resolvedDecisions = null) {
  const context = initializeCore().initializeContext({
    targetPath: fixture,
    userIntent: "create",
    projectPurpose: "Create a minimal command-line application",
    projectType,
    initialScope: "Read a text file and print a summary",
  });
  const analysis = analyzeCreateContext(context);
  if (resolvedDecisions) {
    analysis.resolvedDecisions = resolvedDecisions;
  }
  return analysis;
}

test("technology recommendation remains review-only when technology is unresolved", () => {
  const fixture = createFixture();
  try {
    const analysis = analyze(fixture, "CLI application");
    const result = deriveCreateActions({
      analysisResult: analysis,
      projectShape: analysis.projectShape,
      resolvedDecisions: analysis.resolvedDecisions,
    });

    assert.equal(result.readiness, "REVIEW_REQUIRED");
    assert.equal(result.actions.length, 0);
    assert.ok(result.recommendations.length > 0);
    assert.equal(result.recommendations[0].topic, "technology");
  } finally {
    removeFixture(fixture);
  }
});

test("technology without a concrete artifact remains review-only", () => {
  const fixture = createFixture();
  try {
    const analysis = analyze(fixture, "Go CLI application");
    const result = deriveCreateActions({
      analysisResult: analysis,
      projectShape: analysis.projectShape,
      resolvedDecisions: {},
    });

    assert.equal(result.actions.length, 0);
    assert.equal(result.readiness, "REVIEW_REQUIRED");
    assert.ok(result.reviewItems.some((item) => item.topic === "concreteActions"));
  } finally {
    removeFixture(fixture);
  }
});

test("explicit technology and resolved concrete action derive an executable action", () => {
  const fixture = createFixture();
  try {
    const analysis = analyze(fixture, "Go CLI application", {
      concreteActions: [
        {
          type: "CREATE",
          path: "cmd/app/main.go",
          content: "package main\n\nfunc main() {}\n",
          rationale: "Explicit initial entry-point decision.",
          source: "explicit-requirement",
          requirement: "initialScope",
        },
      ],
    });
    const result = deriveCreateActions({
      analysisResult: analysis,
      projectShape: analysis.projectShape,
      resolvedDecisions: analysis.resolvedDecisions,
    });

    assert.equal(result.readiness, "READY");
    assert.equal(result.actions.length, 1);
    assert.equal(result.actions[0].type, "CREATE");
    assert.equal(result.actions[0].path, "cmd/app/main.go");
    assert.equal(result.actions[0].content.includes("package main"), true);
    assert.equal(result.actions[0].provenance.source, "explicit-requirement");
  } finally {
    removeFixture(fixture);
  }
});

test("out-of-scope concrete action remains review-only", () => {
  const fixture = createFixture();
  try {
    const analysis = analyze(fixture, "Go CLI application", {
      concreteActions: [
        {
          type: "CREATE",
          path: "../outside.go",
          content: "package main\n",
          source: "explicit-requirement",
        },
      ],
    });
    const result = deriveCreateActions({
      analysisResult: analysis,
      projectShape: analysis.projectShape,
      resolvedDecisions: analysis.resolvedDecisions,
    });

    assert.equal(result.actions.length, 0);
    assert.equal(result.readiness, "REVIEW_REQUIRED");
    assert.ok(result.reviewItems.some((item) => item.topic === "../outside.go"));
  } finally {
    removeFixture(fixture);
  }
});

test("normal CLI flow resolves a concrete CREATE action and reaches terminal success", () => {
  const fixture = createFixture();
  try {
    const cliPath = path.resolve(__dirname, "../src/cli/index.js");
    const result = childProcess.spawnSync(
      process.execPath,
      [
        cliPath,
        "--target",
        fixture,
        "--intent",
        "create",
        "--purpose",
        "Create a minimal command-line application",
        "--project-type",
        "Go CLI application",
        "--scope",
        "Create the initial application entry point at main.go",
        "--create-path",
        "main.go",
        "--create-content",
        "package main\n",
      ],
      { input: "yes\n", encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Status: SUCCESS/);
    assert.equal(fs.readFileSync(path.join(fixture, "main.go"), "utf8"), "package main\n");
  } finally {
    removeFixture(fixture);
  }
});

test("full concrete CREATE pipeline reaches execution and validation", () => {
  const fixture = createFixture();
  try {
    const target = path.join(fixture, "cmd", "app");
    fs.mkdirSync(target, { recursive: true });
    const core = initializeCore();
    const context = core.initializeContext({
      targetPath: target,
      userIntent: "create",
      projectPurpose: "Create a minimal command-line application",
      projectType: "Go CLI application",
      initialScope: "Create the initial application entry point at main.go",
    });
    const analysis = core.workflowController.prepareWorkflow(
      core.workflowController.routeContext(context),
    );
    analysis.resolvedDecisions = {
      concreteActions: [
        {
          type: "CREATE",
          path: "main.go",
          content: "package main\n\nfunc main() {}\n",
          rationale: "Explicit initial entry-point decision.",
          source: "explicit-requirement",
          requirement: "initialScope",
        },
      ],
    };
    const proposalResult = core.workflowController.createProposal(analysis);
    const permission = core.workflowController.resolvePermission(proposalResult, "yes");
    const scopeResult = core.workflowController.prepareApprovedScope(permission);
    const result = core.workflowController.processApprovedScope(
      permission,
      scopeResult.approvedScope,
      scopeResult,
    );

    assert.equal(proposalResult.permissionRequired, true);
    assert.equal(scopeResult.approvedScope.status, "AUTHORIZED");
    assert.equal(result.executionResult.status, "COMPLETED");
    assert.equal(result.validationResult.status, "PASSED");
    assert.equal(result.terminalResult.status, "SUCCESS");
    assert.equal(
      fs.readFileSync(path.join(target, "main.go"), "utf8"),
      "package main\n\nfunc main() {}\n",
    );
  } finally {
    removeFixture(fixture);
  }
});
