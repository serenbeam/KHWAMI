"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { initializeCore } = require("../src/core/bootstrap");
const { captureProposalBaseline, detectProposalChanges } = require("../src/core/change-detection");
const { deriveApprovedScope } = require("../src/core/approved-scope");
const { executeApprovedCreateScope } = require("../src/core/create-execution");
const { validateCreateExecution } = require("../src/core/create-validation");

function createFixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "khwami-create-execution-test-"));
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function createProposal(targetPath, action, readiness = "READY") {
  return {
    type: "CREATE_PROPOSAL",
    version: 1,
    workflow: "CREATE",
    targetPath,
    readiness,
    actions: [action],
    preservedScope: [],
    validationExpectations: { ready: true },
    context: { targetPath, classification: "CREATE" },
  };
}

function authorize(proposal) {
  return {
    type: "PERMISSION_RESULT",
    status: "AUTHORIZED",
    proposal,
    context: proposal.context,
  };
}

function establishScope(proposal, permission) {
  const baselineResult = captureProposalBaseline(proposal);
  const changeDetectionResult = detectProposalChanges(baselineResult, proposal);
  const approvedScope = deriveApprovedScope({
    permissionResult: permission,
    proposal,
    baselineResult,
    changeDetectionResult,
  });
  return { baselineResult, changeDetectionResult, approvedScope };
}

test("a valid Approved Scope executes an exact CREATE file action", () => {
  const fixture = createFixture();
  try {
    const action = {
      type: "CREATE",
      path: "generated.txt",
      scope: "file",
      content: "generated content\n",
      status: "PROPOSED",
    };
    const proposal = createProposal(fixture, action);
    const permission = authorize(proposal);
    const scopeResult = establishScope(proposal, permission);
    const execution = executeApprovedCreateScope(scopeResult.approvedScope);
    const validation = validateCreateExecution(execution);

    assert.equal(scopeResult.approvedScope.status, "AUTHORIZED");
    assert.equal(execution.status, "COMPLETED");
    assert.equal(validation.status, "PASSED");
    assert.equal(fs.readFileSync(path.join(fixture, "generated.txt"), "utf8"), action.content);
  } finally {
    removeFixture(fixture);
  }
});

test("review-only actions cannot execute", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(
      fixture,
      { type: "REVIEW", path: fixture, scope: "architecture", status: "REVIEW" },
      "REVIEW_REQUIRED",
    );
    const permission = authorize(proposal);
    const scopeResult = establishScope(proposal, permission);
    const execution = executeApprovedCreateScope(scopeResult.approvedScope);

    assert.notEqual(scopeResult.approvedScope.status, "AUTHORIZED");
    assert.equal(execution.status, "BLOCKED");
    assert.equal(fs.readdirSync(fixture).length, 0);
  } finally {
    removeFixture(fixture);
  }
});

test("existing target file causes CREATE execution to fail without overwrite", () => {
  const fixture = createFixture();
  try {
    const targetPath = path.join(fixture, "generated.txt");
    fs.writeFileSync(targetPath, "existing\n");
    const proposal = createProposal(fixture, {
      type: "CREATE",
      path: "generated.txt",
      scope: "file",
      content: "new\n",
      status: "PROPOSED",
    });
    const permission = authorize(proposal);
    const scopeResult = establishScope(proposal, permission);
    const execution = executeApprovedCreateScope(scopeResult.approvedScope);

    assert.equal(execution.status, "BLOCKED");
    assert.equal(fs.readFileSync(targetPath, "utf8"), "existing\n");
  } finally {
    removeFixture(fixture);
  }
});

test("post-execution content change produces VALIDATION_FAILED", () => {
  const fixture = createFixture();
  try {
    const action = {
      type: "CREATE",
      path: "generated.txt",
      scope: "file",
      content: "expected\n",
      status: "PROPOSED",
    };
    const proposal = createProposal(fixture, action);
    const permission = authorize(proposal);
    const scopeResult = establishScope(proposal, permission);
    const execution = executeApprovedCreateScope(scopeResult.approvedScope);
    fs.writeFileSync(path.join(fixture, "generated.txt"), "unexpected\n");
    const validation = validateCreateExecution(execution);

    assert.equal(execution.status, "COMPLETED");
    assert.equal(validation.status, "FAILED");
  } finally {
    removeFixture(fixture);
  }
});

test("Workflow Controller executes only an authorized Approved Scope", () => {
  const fixture = createFixture();
  try {
    const action = {
      type: "CREATE",
      path: "generated.txt",
      scope: "file",
      content: "controller execution\n",
      status: "PROPOSED",
    };
    const proposal = createProposal(fixture, action);
    const permission = authorize(proposal);
    const scopeResult = establishScope(proposal, permission);
    const result = initializeCore().workflowController.processApprovedScope(
      permission,
      scopeResult.approvedScope,
      scopeResult,
    );

    assert.equal(result.executionResult.status, "COMPLETED");
    assert.equal(result.validationResult.status, "PASSED");
    assert.equal(result.terminalResult.status, "SUCCESS");
    assert.equal(fs.readFileSync(path.join(fixture, "generated.txt"), "utf8"), action.content);
  } finally {
    removeFixture(fixture);
  }
});
