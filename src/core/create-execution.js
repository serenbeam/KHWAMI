"use strict";

const fs = require("node:fs");
const path = require("node:path");

const EXECUTION_STATUSES = Object.freeze({
  NOT_STARTED: "NOT_STARTED",
  BLOCKED: "BLOCKED",
  FAILED: "FAILED",
  COMPLETED: "COMPLETED",
});

function executeApprovedCreateScope(scope) {
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
    return {
      ...baseResult,
      status: EXECUTION_STATUSES.BLOCKED,
      executionStarted: false,
      executionCompleted: false,
      error: "Approved Scope is not authorized.",
    };
  }

  if (
    scope.workflow === "ADOPT" ||
    scope.proposal?.workflow === "ADOPT" ||
    scope.readOnly === true
  ) {
    return {
      ...baseResult,
      status: EXECUTION_STATUSES.BLOCKED,
      executionStarted: false,
      executionCompleted: false,
      skippedActions: Array.isArray(scope.actions) ? scope.actions : [],
      error: "CREATE execution cannot execute an ADOPT or read-only Approved Scope.",
    };
  }

  if (!Array.isArray(scope.actions) || scope.actions.length === 0) {
    return {
      ...baseResult,
      status: EXECUTION_STATUSES.BLOCKED,
      executionStarted: false,
      executionCompleted: false,
      error: "Approved Scope contains no concrete executable actions.",
    };
  }

  const preflight = preflightActions(scope);
  if (!preflight.valid) {
    return {
      ...baseResult,
      status: EXECUTION_STATUSES.BLOCKED,
      executionStarted: false,
      executionCompleted: false,
      skippedActions: scope.actions,
      error: preflight.reason,
    };
  }

  const executedActions = [];
  const changedPaths = [];

  for (const preparedAction of preflight.actions) {
    try {
      fs.writeFileSync(preparedAction.path, preparedAction.action.content, {
        encoding: "utf8",
        flag: "wx",
      });
      executedActions.push(preparedAction.action);
      changedPaths.push(preparedAction.relativePath);
    } catch (error) {
      return {
        ...baseResult,
        status: EXECUTION_STATUSES.FAILED,
        executionStarted: true,
        executionCompleted: false,
        executedActions,
        skippedActions: scope.actions.slice(executedActions.length + 1),
        failedActions: [preparedAction.action],
        changedPaths,
        error: error instanceof Error ? error.message : "CREATE execution failed.",
      };
    }
  }

  return {
    ...baseResult,
    status: EXECUTION_STATUSES.COMPLETED,
    executionStarted: true,
    executionCompleted: true,
    executedActions,
    changedPaths,
    error: null,
  };
}

function preflightActions(scope) {
  const prepared = [];
  const targetPath = path.resolve(scope.targetPath);

  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) {
    return { valid: false, actions: [], reason: "Execution target is not an available directory." };
  }

  for (const action of scope.actions) {
    if (action.type !== "CREATE") {
      return { valid: false, actions: [], reason: `Unsupported CREATE action type: ${action.type}.` };
    }

    if (action.status === "REVIEW") {
      return { valid: false, actions: [], reason: "Review-only actions cannot execute." };
    }

    if (typeof action.content !== "string" || !action.path) {
      return { valid: false, actions: [], reason: "CREATE action requires a path and content." };
    }

    const resolvedPath = path.resolve(targetPath, action.path);
    const relativePath = path.relative(targetPath, resolvedPath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      return { valid: false, actions: [], reason: "CREATE action is outside the approved target." };
    }

    if (fs.existsSync(resolvedPath)) {
      return { valid: false, actions: [], reason: `CREATE target already exists: ${relativePath}.` };
    }

    const parentPath = path.dirname(resolvedPath);
    if (!fs.existsSync(parentPath) || !fs.statSync(parentPath).isDirectory()) {
      return { valid: false, actions: [], reason: `CREATE parent directory is unavailable: ${parentPath}.` };
    }

    prepared.push({ action, path: resolvedPath, relativePath });
  }

  return { valid: true, actions: prepared };
}

module.exports = {
  EXECUTION_STATUSES,
  executeApprovedCreateScope,
};
