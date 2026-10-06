"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { initializeCore } = require("../src/core/bootstrap");
const {
  CHANGE_STATUSES,
  captureProposalBaseline,
  detectProposalChanges,
} = require("../src/core/change-detection");
const {
  APPROVED_SCOPE_STATUSES,
  deriveApprovedScope,
} = require("../src/core/approved-scope");

function createFixture(area = "sales") {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "khwami-adopt-action-test-"));
  fs.writeFileSync(path.join(fixture, "package.json"), JSON.stringify({ name: "existing" }));
  fs.mkdirSync(path.join(fixture, "src", "modules", area), { recursive: true });
  fs.writeFileSync(path.join(fixture, "src", "modules", area, "index.js"), "module.exports = {};\n");
  fs.writeFileSync(path.join(fixture, "README.md"), "# Existing\n");
  return fixture;
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function getProposal(fixture, objective) {
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
    requirements,
    proposal: core.workflowController.createProposal(requirements),
  };
}

test("grounded ADOPT proposal derives non-executable review actions", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const result = core.workflowController.deriveAdoptProposalActions(proposal);

    assert.equal(proposal.proposal.status, "READY");
    assert.equal(result.status, "DERIVED");
    assert.equal(result.executable, false);
    assert.equal(result.candidateActions.length, 1);
    assert.equal(result.candidateActions[0].type, "REVIEW");
    assert.equal(result.candidateActions[0].operation, "REVIEW_EXISTING_AREA");
    assert.ok(result.candidateActions[0].path.includes("sales"));
    assert.ok(result.candidateActions[0].evidence.length > 0);
  } finally {
    removeFixture(fixture);
  }
});

test("non-ready ADOPT proposal cannot derive candidate actions", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(fixture, null);
    const result = core.workflowController.deriveAdoptProposalActions(proposal);

    assert.equal(proposal.proposal.status, "BLOCKED");
    assert.equal(result.status, "BLOCKED");
    assert.deepEqual(result.candidateActions, []);
    assert.equal(result.executable, false);
  } finally {
    removeFixture(fixture);
  }
});

test("conflicting ADOPT proposal remains review-required", () => {
  const fixture = createFixture("server");
  try {
    const { core, proposal } = getProposal(fixture, "Update the mobile frontend");
    const result = core.workflowController.deriveAdoptProposalActions(proposal);

    assert.equal(proposal.proposal.status, "REVIEW_REQUIRED");
    assert.equal(result.status, "REVIEW_REQUIRED");
    assert.deepEqual(result.candidateActions, []);
    assert.equal(result.executable, false);
  } finally {
    removeFixture(fixture);
  }
});

test("out-of-scope ADOPT areas remain unresolved", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    proposal.proposal.proposedChangeAreas = [
      {
        area: "../outside",
        intent: "Modify outside target",
        rationale: "Test scope boundary",
        source: "test",
      },
    ];
    const result = core.workflowController.deriveAdoptProposalActions(proposal);

    assert.equal(result.status, "REVIEW_REQUIRED");
    assert.deepEqual(result.candidateActions, []);
    assert.ok(result.unresolvedDecisions.length > 0);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT action derivation does not mutate the target", () => {
  const fixture = createFixture();
  try {
    const before = fs.readdirSync(fixture, { recursive: true }).sort();
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    core.workflowController.deriveAdoptProposalActions(proposal);
    const after = fs.readdirSync(fixture, { recursive: true }).sort();

    assert.deepEqual(after, before);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT Change Detection captures NO_CHANGE for the derived bounded scope", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const baseline = captureProposalBaseline(actionResult.proposal);
    const detection = detectProposalChanges(baseline, actionResult.proposal);
    const scopeResult = core.workflowController.prepareAdoptScope(actionResult);

    assert.equal(baseline.status, "CAPTURED");
    assert.equal(detection.status, CHANGE_STATUSES.NO_CHANGE);
    assert.deepEqual(detection.changedPaths, []);
    assert.equal(scopeResult.changeDetectionResult.status, CHANGE_STATUSES.NO_CHANGE);
    assert.equal(scopeResult.approvedScope.status, APPROVED_SCOPE_STATUSES.NOT_ESTABLISHED);
    assert.equal(actionResult.proposal.actions[0].type, "REVIEW");
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT Change Detection reports a material change inside the bounded scope", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const baseline = captureProposalBaseline(actionResult.proposal);
    fs.writeFileSync(
      path.join(fixture, "src", "modules", "sales", "index.js"),
      "module.exports = { changed: true };\n",
    );
    const detection = detectProposalChanges(baseline, actionResult.proposal);

    assert.equal(detection.status, CHANGE_STATUSES.MATERIAL_CHANGE);
    assert.deepEqual(detection.changedPaths, [path.join("src", "modules", "sales")]);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT proposal identity conflict requires review", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const baseline = captureProposalBaseline(actionResult.proposal);
    const conflictingProposal = {
      ...actionResult.proposal,
      actions: actionResult.proposal.actions.map((action) => ({
        ...action,
        scope: "different-reviewed-scope",
      })),
    };
    const detection = detectProposalChanges(baseline, conflictingProposal);

    assert.equal(detection.status, CHANGE_STATUSES.REVIEW_REQUIRED);
    assert.match(detection.reason, /proposal identity/i);
  } finally {
    removeFixture(fixture);
  }
});

test("valid ADOPT NO_CHANGE establishes a bounded read-only Approved Scope", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const permission = {
      type: "PERMISSION_RESULT",
      status: "AUTHORIZED",
      proposal: actionResult.proposal,
      context: actionResult.proposal.context,
    };
    const baseline = captureProposalBaseline(actionResult.proposal);
    const detection = detectProposalChanges(baseline, actionResult.proposal);
    const approvedScope = deriveApprovedScope({
      permissionResult: permission,
      proposal: actionResult.proposal,
      baselineResult: baseline,
      changeDetectionResult: detection,
    });

    assert.equal(approvedScope.status, APPROVED_SCOPE_STATUSES.AUTHORIZED);
    assert.equal(approvedScope.workflow, "ADOPT");
    assert.equal(approvedScope.readOnly, true);
    assert.equal(approvedScope.executionAllowed, false);
    assert.deepEqual(approvedScope.actions.map((action) => action.path), [
      path.join("src", "modules", "sales"),
    ]);
  } finally {
    removeFixture(fixture);
  }
});

test("out-of-scope ADOPT action is rejected before baseline or Approved Scope", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const outOfScopeProposal = {
      ...actionResult.proposal,
      actions: [
        {
          ...actionResult.proposal.actions[0],
          path: "../outside",
          targetPath: path.resolve(fixture, "..", "outside"),
        },
      ],
    };
    const baseline = captureProposalBaseline(outOfScopeProposal);
    const detection = detectProposalChanges(baseline, outOfScopeProposal);
    const approvedScope = deriveApprovedScope({
      permissionResult: {
        type: "PERMISSION_RESULT",
        status: "AUTHORIZED",
        proposal: outOfScopeProposal,
      },
      proposal: outOfScopeProposal,
      baselineResult: baseline,
      changeDetectionResult: detection,
    });

    assert.equal(baseline.status, CHANGE_STATUSES.REVIEW_REQUIRED);
    assert.equal(detection.status, CHANGE_STATUSES.NOT_RUN);
    assert.equal(approvedScope.status, APPROVED_SCOPE_STATUSES.NOT_ESTABLISHED);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT Permission accepts yes only after the bounded scope is ready", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    assert.equal(proposal.permissionRequired, false);
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const scopeResult = core.workflowController.prepareAdoptScope(actionResult);
    const permission = core.workflowController.resolveAdoptPermission(scopeResult, "yes");

    assert.equal(scopeResult.permissionRequired, true);
    assert.equal(permission.status, "AUTHORIZED");
    assert.equal(permission.approvedScope.status, APPROVED_SCOPE_STATUSES.AUTHORIZED);
    assert.equal(permission.approvedScope.readOnly, true);
    assert.equal(permission.approvedScope.executionAllowed, false);
    assert.equal(permission.approvedScope.actions[0].type, "REVIEW");
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT Permission rejects no without authorizing the scope", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const scopeResult = core.workflowController.prepareAdoptScope(actionResult);
    const permission = core.workflowController.resolveAdoptPermission(scopeResult, "no");

    assert.equal(permission.status, "REJECTED");
    assert.equal(permission.approvedScope.status, APPROVED_SCOPE_STATUSES.NOT_ESTABLISHED);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT Permission is unavailable before review and Change Detection", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const earlyPermission = core.workflowController.resolvePermission(proposal, "yes");
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const scopeResult = core.workflowController.prepareAdoptScope(actionResult);

    assert.equal(earlyPermission.status, "UNRESOLVED");
    assert.equal(scopeResult.permissionRequired, true);
    assert.equal(scopeResult.changeDetectionResult.status, CHANGE_STATUSES.NO_CHANGE);
  } finally {
    removeFixture(fixture);
  }
});

test("rejected or invalid ADOPT scope cannot receive authorization", () => {
  const fixture = createFixture();
  try {
    const { core, proposal } = getProposal(
      fixture,
      "Add offline support to the existing sales module",
    );
    const actionResult = core.workflowController.deriveAdoptProposalActions(proposal);
    const invalidProposal = {
      ...actionResult.proposal,
      actions: [
        {
          ...actionResult.proposal.actions[0],
          path: "../outside",
          targetPath: path.resolve(fixture, "..", "outside"),
        },
      ],
    };
    const invalidActionResult = {
      ...actionResult,
      proposal: invalidProposal,
    };
    const scopeResult = core.workflowController.prepareAdoptScope(invalidActionResult);
    const permission = core.workflowController.resolveAdoptPermission(scopeResult, "yes");

    assert.equal(scopeResult.permissionRequired, false);
    assert.equal(permission.status, "UNRESOLVED");
    assert.equal(permission.approvedScope.status, APPROVED_SCOPE_STATUSES.NOT_ESTABLISHED);
  } finally {
    removeFixture(fixture);
  }
});
