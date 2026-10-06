"use strict";

const { getScopedActions } = require("./change-detection");

const APPROVED_SCOPE_STATUSES = Object.freeze({
  NOT_ESTABLISHED: "NOT_ESTABLISHED",
  AUTHORIZED: "AUTHORIZED",
  INVALIDATED: "INVALIDATED",
});

function deriveApprovedScope({
  permissionResult,
  proposal,
  baselineResult,
  changeDetectionResult,
}) {
  if (permissionResult?.status !== "AUTHORIZED") {
    return notEstablished("Valid authorization is required for Approved Scope.");
  }

  if (!proposal || !baselineResult?.baseline) {
    return notEstablished("A reviewed proposal and captured baseline are required.");
  }

  if (changeDetectionResult?.status !== "NO_CHANGE") {
    return notEstablished(
      "Approved Scope requires a successful NO_CHANGE result from Change Detection.",
    );
  }

  const readiness = proposal.readiness ?? proposal.status;
  if (readiness !== "READY") {
    return notEstablished(
      "Approved Scope requires a proposal with READY readiness.",
    );
  }

  const scopedActions = getScopedActions(proposal);
  if (!scopedActions.valid) {
    return notEstablished(scopedActions.reason);
  }

  if (scopedActions.actions.length === 0) {
    return notEstablished(
      "Approved Scope requires at least one bounded proposal action.",
    );
  }

  const readOnly = proposal.workflow === "ADOPT" && scopedActions.actions.every(
    (action) => action.type === "REVIEW",
  );

  return {
    type: "APPROVED_SCOPE",
    status: APPROVED_SCOPE_STATUSES.AUTHORIZED,
    workflow: proposal.workflow,
    targetPath: proposal.targetPath,
    proposal,
    proposalIdentity: baselineResult.baseline.proposalIdentity,
    baselineIdentity: baselineResult.baseline.identity,
    baseline: baselineResult.baseline,
    permission: permissionResult,
    actions: scopedActions.actions.map((action) => ({ ...action })),
    preservedScope: proposal.preservedScope || [],
    validationExpectations: proposal.validationExpectations,
    readOnly,
    executionAllowed: !readOnly,
    invalidationConditions: [
      "proposal identity changes",
      "baseline identity changes",
      "proposal-relevant target state changes",
      "authorized action scope changes",
    ],
    reason: null,
  };
}

function revalidateApprovedScope(scope, {
  permissionResult,
  proposal,
  baselineResult,
  changeDetectionResult,
}) {
  if (!scope || scope.status !== APPROVED_SCOPE_STATUSES.AUTHORIZED) {
    return scope || notEstablished("Approved Scope is not authorized.");
  }

  if (permissionResult?.status !== "AUTHORIZED") {
    return invalidate(scope, "Authorization is no longer valid.");
  }

  if (scope.proposalIdentity !== baselineResult?.baseline?.proposalIdentity) {
    return invalidate(scope, "Proposal identity no longer matches Approved Scope.");
  }

  if (scope.baselineIdentity !== baselineResult?.baseline?.identity) {
    return invalidate(scope, "Baseline identity no longer matches Approved Scope.");
  }

  if (proposal !== scope.proposal) {
    return invalidate(scope, "Proposal object no longer matches Approved Scope.");
  }

  if (changeDetectionResult?.status !== "NO_CHANGE") {
    return invalidate(scope, "Proposal-relevant target state changed after authorization.");
  }

  return scope;
}

function invalidate(scope, reason) {
  return {
    ...scope,
    status: APPROVED_SCOPE_STATUSES.INVALIDATED,
    actions: [],
    reason,
  };
}

function notEstablished(reason) {
  return {
    type: "APPROVED_SCOPE",
    status: APPROVED_SCOPE_STATUSES.NOT_ESTABLISHED,
    workflow: null,
    targetPath: null,
    proposal: null,
    proposalIdentity: null,
    baselineIdentity: null,
    baseline: null,
    permission: null,
    actions: [],
    preservedScope: [],
    validationExpectations: null,
    readOnly: false,
    executionAllowed: false,
    invalidationConditions: [],
    reason,
  };
}

module.exports = {
  APPROVED_SCOPE_STATUSES,
  deriveApprovedScope,
  revalidateApprovedScope,
};
