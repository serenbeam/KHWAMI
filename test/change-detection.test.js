"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  CHANGE_STATUSES,
  captureProposalBaseline,
  detectProposalChanges,
} = require("../src/core/change-detection");
const {
  APPROVED_SCOPE_STATUSES,
  deriveApprovedScope,
  revalidateApprovedScope,
} = require("../src/core/approved-scope");
const { initializeCore } = require("../src/core/bootstrap");

function createFixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "khwami-change-detection-test-"));
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function createPermission(proposal, status = "AUTHORIZED") {
  return {
    type: "PERMISSION_RESULT",
    status,
    proposal,
    context: proposal.context || null,
  };
}

function createProposal(targetPath, actions, readiness = "READY") {
  return {
    type: "CREATE_PROPOSAL",
    version: 1,
    workflow: "CREATE",
    targetPath,
    readiness,
    actions,
    preservedScope: [],
    validationExpectations: { ready: false },
    context: { targetPath, classification: "CREATE" },
  };
}

test("captures a deterministic baseline and detects NO_CHANGE", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(fixture, [
      { type: "CREATE", path: "generated.js", scope: "file", status: "PROPOSED" },
    ]);
    const baseline = captureProposalBaseline(proposal);
    const secondBaseline = captureProposalBaseline(proposal);
    const detection = detectProposalChanges(baseline, proposal);

    assert.equal(baseline.status, "CAPTURED");
    assert.equal(baseline.baseline.identity, secondBaseline.baseline.identity);
    assert.equal(detection.status, CHANGE_STATUSES.NO_CHANGE);
    assert.deepEqual(detection.changedPaths, []);
  } finally {
    removeFixture(fixture);
  }
});

test("proposal-relevant target changes produce MATERIAL_CHANGE", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(fixture, [
      { type: "CREATE", path: "generated.js", scope: "file", status: "PROPOSED" },
    ]);
    const baseline = captureProposalBaseline(proposal);
    fs.writeFileSync(path.join(fixture, "generated.js"), "changed by another actor\n");
    const detection = detectProposalChanges(baseline, proposal);

    assert.equal(detection.status, CHANGE_STATUSES.MATERIAL_CHANGE);
    assert.deepEqual(detection.changedPaths, ["generated.js"]);
  } finally {
    removeFixture(fixture);
  }
});

test("unrelated changes do not invalidate a bounded proposal scope", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(fixture, [
      { type: "CREATE", path: "generated.js", scope: "file", status: "PROPOSED" },
    ]);
    const baseline = captureProposalBaseline(proposal);
    fs.writeFileSync(path.join(fixture, "unrelated.md"), "unrelated\n");
    const detection = detectProposalChanges(baseline, proposal);

    assert.equal(detection.status, CHANGE_STATUSES.NO_CHANGE);
  } finally {
    removeFixture(fixture);
  }
});

test("review-only proposals cannot establish an Approved Scope", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(fixture, [
      { type: "REVIEW", path: fixture, scope: "architecture", status: "REVIEW" },
    ], "REVIEW_REQUIRED");
    const permission = createPermission(proposal);
    const baseline = captureProposalBaseline(proposal);
    const scope = deriveApprovedScope({
      permissionResult: permission,
      proposal,
      baselineResult: baseline,
      changeDetectionResult: { status: CHANGE_STATUSES.NO_CHANGE },
    });

    assert.notEqual(baseline.status, "CAPTURED");
    assert.equal(scope.status, APPROVED_SCOPE_STATUSES.NOT_ESTABLISHED);
  } finally {
    removeFixture(fixture);
  }
});

test("valid NO_CHANGE and permission establish an immutable bounded scope", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(fixture, [
      { type: "CREATE", path: "generated.js", scope: "file", status: "PROPOSED" },
    ]);
    const permission = createPermission(proposal);
    const baseline = captureProposalBaseline(proposal);
    const detection = detectProposalChanges(baseline, proposal);
    const scope = deriveApprovedScope({
      permissionResult: permission,
      proposal,
      baselineResult: baseline,
      changeDetectionResult: detection,
    });

    assert.equal(scope.status, APPROVED_SCOPE_STATUSES.AUTHORIZED);
    assert.deepEqual(scope.actions.map((action) => action.path), ["generated.js"]);
    assert.equal(scope.proposalIdentity, baseline.baseline.proposalIdentity);
    assert.equal(scope.baselineIdentity, baseline.baseline.identity);
  } finally {
    removeFixture(fixture);
  }
});

test("post-authorization proposal mismatch invalidates Approved Scope", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(fixture, [
      { type: "CREATE", path: "generated.js", scope: "file", status: "PROPOSED" },
    ]);
    const permission = createPermission(proposal);
    const baseline = captureProposalBaseline(proposal);
    const detection = detectProposalChanges(baseline, proposal);
    const scope = deriveApprovedScope({
      permissionResult: permission,
      proposal,
      baselineResult: baseline,
      changeDetectionResult: detection,
    });
    const changedProposal = createProposal(fixture, [
      { type: "CREATE", path: "different.js", scope: "file", status: "PROPOSED" },
    ]);
    const invalidated = revalidateApprovedScope(scope, {
      permissionResult: permission,
      proposal: changedProposal,
      baselineResult: baseline,
      changeDetectionResult: { status: CHANGE_STATUSES.NO_CHANGE },
    });

    assert.equal(invalidated.status, APPROVED_SCOPE_STATUSES.INVALIDATED);
    assert.deepEqual(invalidated.actions, []);
  } finally {
    removeFixture(fixture);
  }
});

test("Workflow Controller exposes the Approved Scope boundary without execution", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(fixture, [
      { type: "CREATE", path: "generated.js", scope: "file", status: "PROPOSED" },
    ]);
    const core = initializeCore();
    const result = core.workflowController.prepareApprovedScope(
      createPermission(proposal),
    );

    assert.equal(result.changeDetectionResult.status, CHANGE_STATUSES.NO_CHANGE);
    assert.equal(result.approvedScope.status, APPROVED_SCOPE_STATUSES.AUTHORIZED);
    assert.deepEqual(result.approvedScope.actions.map((action) => action.path), ["generated.js"]);
  } finally {
    removeFixture(fixture);
  }
});

test("rejected permission cannot establish Approved Scope", () => {
  const fixture = createFixture();
  try {
    const proposal = createProposal(fixture, [
      { type: "CREATE", path: "generated.js", scope: "file", status: "PROPOSED" },
    ]);
    const scope = deriveApprovedScope({
      permissionResult: createPermission(proposal, "REJECTED"),
      proposal,
      baselineResult: captureProposalBaseline(proposal),
      changeDetectionResult: { status: CHANGE_STATUSES.NO_CHANGE },
    });

    assert.equal(scope.status, APPROVED_SCOPE_STATUSES.NOT_ESTABLISHED);
  } finally {
    removeFixture(fixture);
  }
});
