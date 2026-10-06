"use strict";

const { CHANGE_STATUSES, detectProposalChanges } = require("./change-detection");

const VALIDATION_STATUSES = Object.freeze({
  NOT_RUN: "NOT_RUN",
  PASSED: "PASSED",
  FAILED: "FAILED",
});

/**
 * Validate the current ADOPT MVP outcome: execution must have been blocked and
 * the approved, read-only target must still match its pre-authorization state.
 */
function validateAdoptExecution(executionResult, baselineResult = null) {
  const invalidReason = invalidExecutionReason(executionResult);
  if (invalidReason) {
    return failedValidation(executionResult, [], invalidReason);
  }

  const scope = executionResult.executionScope;
  const capturedBaseline = getCapturedBaseline(scope, baselineResult);
  if (!capturedBaseline) {
    return failedValidation(
      executionResult,
      [],
      "ADOPT validation requires a captured target baseline.",
    );
  }

  if (
    scope.baselineIdentity &&
    capturedBaseline.baseline.identity !== scope.baselineIdentity
  ) {
    return failedValidation(
      executionResult,
      [],
      "ADOPT validation received a baseline that does not match the Approved Scope.",
    );
  }

  const changeDetection = detectProposalChanges(
    capturedBaseline,
    scope.proposal,
  );
  if (changeDetection.status !== CHANGE_STATUSES.NO_CHANGE) {
    return failedValidation(
      executionResult,
      changeDetection.changedPaths,
      changeDetection.reason || "ADOPT target state changed after authorization.",
    );
  }

  return {
    type: "VALIDATION_RESULT",
    status: VALIDATION_STATUSES.PASSED,
    executionResult,
    checkedPaths: changeDetection.currentState.map((entry) => entry.path),
    error: null,
  };
}

function invalidExecutionReason(executionResult) {
  if (!executionResult || executionResult.status !== "BLOCKED") {
    return "ADOPT validation requires a BLOCKED execution result.";
  }

  if (
    executionResult.workflow !== "ADOPT" ||
    executionResult.executionStarted !== false ||
    executionResult.executionCompleted !== false
  ) {
    return "ADOPT validation received an invalid execution boundary.";
  }

  if (
    !Array.isArray(executionResult.executedActions) ||
    executionResult.executedActions.length > 0 ||
    !Array.isArray(executionResult.changedPaths) ||
    executionResult.changedPaths.length > 0 ||
    !Array.isArray(executionResult.failedActions) ||
    executionResult.failedActions.length > 0
  ) {
    return "ADOPT validation detected an execution result that reports mutation.";
  }

  const scope = executionResult.executionScope;
  if (
    !scope ||
    scope.status !== "AUTHORIZED" ||
    scope.workflow !== "ADOPT" ||
    scope.readOnly !== true ||
    scope.executionAllowed !== false ||
    scope.permission?.status !== "AUTHORIZED" ||
    executionResult.targetPath !== scope.targetPath
  ) {
    return "ADOPT validation received an unauthorized or non-read-only scope.";
  }

  if (!scope.proposal || scope.proposal.workflow !== "ADOPT") {
    return "ADOPT validation requires the authorized ADOPT proposal.";
  }

  if (
    !Array.isArray(scope.actions) ||
    scope.actions.length === 0 ||
    scope.actions.some(
      (action) =>
        !action ||
        action.type !== "REVIEW" ||
        action.status !== "REVIEW" ||
        action.executable !== false,
    )
  ) {
    return "ADOPT validation requires non-executable REVIEW actions.";
  }

  if (
    !Array.isArray(executionResult.skippedActions) ||
    executionResult.skippedActions.length !== scope.actions.length
  ) {
    return "ADOPT validation received an incomplete blocked execution record.";
  }

  return null;
}

function getCapturedBaseline(scope, baselineResult) {
  if (baselineResult?.status === "CAPTURED" && baselineResult.baseline) {
    return baselineResult;
  }

  if (scope?.baseline) {
    return {
      type: "BASELINE_RESULT",
      status: "CAPTURED",
      baseline: scope.baseline,
      reason: null,
    };
  }

  return null;
}

function failedValidation(executionResult, checkedPaths, error) {
  return {
    type: "VALIDATION_RESULT",
    status: VALIDATION_STATUSES.FAILED,
    executionResult,
    checkedPaths,
    error,
  };
}

module.exports = {
  VALIDATION_STATUSES,
  validateAdoptExecution,
};
