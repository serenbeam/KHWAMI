"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { executeApprovedAdoptScope } = require("../src/core/adopt-execution");
const { captureProposalBaseline } = require("../src/core/change-detection");
const { initializeCore } = require("../src/core/bootstrap");
const { validateAdoptExecution } = require("../src/core/adopt-validation");

function createFixture() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "khwami-adopt-execution-test-"));
  fs.mkdirSync(path.join(fixture, "src", "modules", "sales"), { recursive: true });
  fs.writeFileSync(path.join(fixture, "src", "modules", "sales", "index.js"), "module.exports = {};\n");
  return fixture;
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function createReadOnlyScope(fixture, action) {
  const proposal = {
    type: "ADOPT_PROPOSAL",
    workflow: "ADOPT",
    targetPath: fixture,
    context: { targetPath: fixture, classification: "ADOPT" },
    actions: [action],
  };
  const permission = {
    type: "PERMISSION_RESULT",
    status: "AUTHORIZED",
    proposal,
    context: proposal.context,
  };
  const baselineResult = captureProposalBaseline(proposal);

  return {
    type: "APPROVED_SCOPE",
    status: "AUTHORIZED",
    workflow: "ADOPT",
    targetPath: fixture,
    proposal,
    permission,
    baseline: baselineResult.baseline,
    readOnly: true,
    executionAllowed: false,
    actions: [action],
  };
}

test("authorized read-only ADOPT REVIEW scope is blocked without mutation", () => {
  const fixture = createFixture();
  try {
    const target = path.join(fixture, "src", "modules", "sales", "index.js");
    const before = fs.readFileSync(target, "utf8");
    const action = {
      type: "REVIEW",
      operation: "REVIEW_EXISTING_AREA",
      path: path.join("src", "modules", "sales"),
      targetPath: path.join(fixture, "src", "modules", "sales"),
      status: "REVIEW",
      executable: false,
    };
    const execution = executeApprovedAdoptScope(createReadOnlyScope(fixture, action));

    assert.equal(execution.status, "BLOCKED");
    assert.equal(execution.executionStarted, false);
    assert.deepEqual(execution.executedActions, []);
    assert.deepEqual(execution.changedPaths, []);
    assert.equal(fs.readFileSync(target, "utf8"), before);
  } finally {
    removeFixture(fixture);
  }
});

test("unauthorized ADOPT scope is blocked before action handling", () => {
  const fixture = createFixture();
  try {
    const action = {
      type: "REVIEW",
      path: "src/modules/sales",
      status: "REVIEW",
      executable: false,
    };
    const scope = createReadOnlyScope(fixture, action);
    scope.status = "NOT_ESTABLISHED";
    scope.permission.status = "REJECTED";
    const execution = executeApprovedAdoptScope(scope);

    assert.equal(execution.status, "BLOCKED");
    assert.equal(execution.executionStarted, false);
    assert.deepEqual(execution.skippedActions, [action]);
  } finally {
    removeFixture(fixture);
  }
});

test("invalid or executable ADOPT actions cannot fall through to CREATE execution", () => {
  const fixture = createFixture();
  try {
    const target = path.join(fixture, "src", "modules", "sales", "index.js");
    const before = fs.readFileSync(target, "utf8");
    const action = {
      type: "CREATE",
      path: path.join("src", "modules", "sales", "index.js"),
      content: "must not overwrite\n",
      status: "PROPOSED",
      executable: true,
    };
    const execution = executeApprovedAdoptScope(createReadOnlyScope(fixture, action));

    assert.equal(execution.status, "BLOCKED");
    assert.equal(execution.executionStarted, false);
    assert.equal(fs.readFileSync(target, "utf8"), before);
  } finally {
    removeFixture(fixture);
  }
});

test("valid blocked ADOPT execution passes read-only validation", () => {
  const fixture = createFixture();
  try {
    const action = {
      type: "REVIEW",
      operation: "REVIEW_EXISTING_AREA",
      path: "src/modules/sales",
      targetPath: path.join(fixture, "src/modules/sales"),
      status: "REVIEW",
      executable: false,
    };
    const execution = executeApprovedAdoptScope(createReadOnlyScope(fixture, action));
    const validation = validateAdoptExecution(execution);

    assert.equal(execution.status, "BLOCKED");
    assert.equal(validation.status, "PASSED");
    assert.deepEqual(validation.checkedPaths, [path.join("src", "modules", "sales")]);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT validation fails when the target changes after blocked execution", () => {
  const fixture = createFixture();
  try {
    const action = {
      type: "REVIEW",
      operation: "REVIEW_EXISTING_AREA",
      path: "src/modules/sales",
      targetPath: path.join(fixture, "src/modules/sales"),
      status: "REVIEW",
      executable: false,
    };
    const execution = executeApprovedAdoptScope(createReadOnlyScope(fixture, action));
    fs.writeFileSync(
      path.join(fixture, "src/modules/sales/index.js"),
      "module.exports = { changed: true };\n",
    );
    const validation = validateAdoptExecution(execution);

    assert.equal(validation.status, "FAILED");
    assert.deepEqual(validation.checkedPaths, [path.join("src", "modules", "sales")]);
    assert.match(validation.error, /target state changed/i);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT validation fails closed for an unauthorized execution result", () => {
  const fixture = createFixture();
  try {
    const action = {
      type: "REVIEW",
      path: "src/modules/sales",
      status: "REVIEW",
      executable: false,
    };
    const scope = createReadOnlyScope(fixture, action);
    scope.status = "NOT_ESTABLISHED";
    scope.permission.status = "REJECTED";
    const execution = executeApprovedAdoptScope(scope);
    const validation = validateAdoptExecution(execution);

    assert.equal(execution.status, "BLOCKED");
    assert.equal(validation.status, "FAILED");
    assert.match(validation.error, /unauthorized|non-read-only/i);
  } finally {
    removeFixture(fixture);
  }
});

test("Workflow Controller validates the blocked ADOPT boundary", () => {
  const fixture = createFixture();
  try {
    const core = initializeCore();
    const action = {
      type: "REVIEW",
      operation: "REVIEW_EXISTING_AREA",
      path: "src/modules/sales",
      targetPath: path.join(fixture, "src/modules/sales"),
      status: "REVIEW",
      executable: false,
    };
    const scope = createReadOnlyScope(fixture, action);
    const result = core.workflowController.processApprovedScope(
      scope.permission,
      scope,
    );

    assert.equal(result.executionResult.status, "BLOCKED");
    assert.equal(result.validationResult.status, "PASSED");
    assert.equal(result.terminalResult.status, "UNRESOLVED");
  } finally {
    removeFixture(fixture);
  }
});
