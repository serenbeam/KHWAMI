"use strict";

const fs = require("node:fs");
const path = require("node:path");

const VALIDATION_STATUSES = Object.freeze({
  NOT_RUN: "NOT_RUN",
  PASSED: "PASSED",
  FAILED: "FAILED",
});

function validateCreateExecution(executionResult) {
  if (!executionResult || executionResult.status !== "COMPLETED") {
    return {
      type: "VALIDATION_RESULT",
      status: VALIDATION_STATUSES.NOT_RUN,
      executionResult,
      checkedPaths: [],
      error: "Validation did not run because CREATE execution did not complete.",
    };
  }

  const scope = executionResult.executionScope;
  const actions = Array.isArray(executionResult.executedActions)
    ? executionResult.executedActions
    : [];
  const checkedPaths = [];

  for (const action of actions) {
    if (action.type !== "CREATE" || typeof action.content !== "string") {
      return failedValidation(
        executionResult,
        checkedPaths,
        "Validation encountered an unsupported CREATE action.",
      );
    }

    const resolvedPath = path.resolve(scope.targetPath, action.path);
    const relativePath = path.relative(scope.targetPath, resolvedPath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      return failedValidation(
        executionResult,
        checkedPaths,
        "Validation detected a path outside the approved target.",
      );
    }

    try {
      const actualContent = fs.readFileSync(resolvedPath, "utf8");
      if (actualContent !== action.content) {
        return failedValidation(
          executionResult,
          checkedPaths,
          `Validation content mismatch: ${relativePath}.`,
        );
      }
      checkedPaths.push(relativePath);
    } catch (error) {
      return failedValidation(
        executionResult,
        checkedPaths,
        error instanceof Error ? error.message : `Validation could not read ${relativePath}.`,
      );
    }
  }

  return {
    type: "VALIDATION_RESULT",
    status: VALIDATION_STATUSES.PASSED,
    executionResult,
    checkedPaths,
    error: null,
  };
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
  validateCreateExecution,
};
