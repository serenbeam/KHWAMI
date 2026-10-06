"use strict";

const path = require("node:path");
const { EXECUTION_STATUSES } = require("./create-execution");

/**
 * ADOPT currently establishes a read-only Approved Scope.  Keep an explicit
 * execution boundary for it so that an authorized scope cannot accidentally
 * fall through to the CREATE executor as the ADOPT workflow evolves.
 */
function executeApprovedAdoptScope(scope) {
  const actions = Array.isArray(scope?.actions) ? scope.actions : [];
  const baseResult = {
    type: "EXECUTION_RESULT",
    workflow: scope?.workflow ?? null,
    targetPath: scope?.targetPath ?? null,
    executionScope: scope || null,
    changedPaths: [],
    executedActions: [],
    skippedActions: [],
    failedActions: [],
  };

  if (!scope || scope.status !== "AUTHORIZED") {
    return blocked(
      baseResult,
      actions,
      "Approved ADOPT Scope is not authorized.",
    );
  }

  if (scope.workflow !== "ADOPT") {
    return blocked(
      baseResult,
      actions,
      "ADOPT execution requires an ADOPT Approved Scope.",
    );
  }

  if (scope.readOnly !== true || scope.executionAllowed !== false) {
    return blocked(
      baseResult,
      actions,
      "ADOPT execution requires a read-only Approved Scope.",
    );
  }

  if (scope.permission?.status !== "AUTHORIZED") {
    return blocked(
      baseResult,
      actions,
      "ADOPT execution requires authorized Permission bound to the Approved Scope.",
    );
  }

  if (actions.length === 0) {
    return blocked(
      baseResult,
      actions,
      "Approved ADOPT Scope contains no bounded actions.",
    );
  }

  for (const action of actions) {
    const invalidReason = validateAdoptAction(scope, action);
    if (invalidReason) {
      return blocked(baseResult, actions, invalidReason);
    }
  }

  // REVIEW is intentionally a non-executable observation.  There is no ADOPT
  // mutation handler yet, so even a valid authorized scope must stop here.
  return blocked(
    baseResult,
    actions,
    "ADOPT Approved Scope is read-only; REVIEW actions cannot execute.",
  );
}

function validateAdoptAction(scope, action) {
  if (
    !action ||
    action.type !== "REVIEW" ||
    action.status !== "REVIEW" ||
    action.executable !== false
  ) {
    return "ADOPT actions must remain REVIEW actions with executable=false.";
  }

  if (typeof scope.targetPath !== "string" || !scope.targetPath || !action.path) {
    return "ADOPT action requires a bounded target and path.";
  }

  let targetPath;
  let resolvedPath;
  try {
    targetPath = path.resolve(scope.targetPath);
    resolvedPath = path.resolve(targetPath, action.path);
  } catch {
    return "ADOPT action has an invalid target boundary or path.";
  }

  const relativePath = path.relative(targetPath, resolvedPath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return "ADOPT action is outside the approved target.";
  }

  if (action.targetPath !== undefined && typeof action.targetPath !== "string") {
    return "ADOPT action target does not match the approved target boundary.";
  }

  if (
    action.targetPath &&
    path.resolve(action.targetPath) !== resolvedPath
  ) {
    return "ADOPT action target does not match the approved target boundary.";
  }

  return null;
}

function blocked(baseResult, skippedActions, error) {
  return {
    ...baseResult,
    status: EXECUTION_STATUSES.BLOCKED,
    executionStarted: false,
    executionCompleted: false,
    skippedActions,
    error,
  };
}

module.exports = {
  EXECUTION_STATUSES,
  executeApprovedAdoptScope,
};
