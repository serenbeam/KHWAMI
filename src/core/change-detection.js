"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const CHANGE_STATUSES = Object.freeze({
  NOT_RUN: "NOT_RUN",
  NO_CHANGE: "NO_CHANGE",
  MATERIAL_CHANGE: "MATERIAL_CHANGE",
  OUT_OF_SCOPE_CHANGE: "OUT_OF_SCOPE_CHANGE",
  REVIEW_REQUIRED: "REVIEW_REQUIRED",
});

const EXECUTABLE_ACTION_TYPES = new Set([
  "CREATE",
  "UPDATE",
  "RENAME",
  "DELETE",
]);

const ADOPT_SCOPE_ACTION_TYPES = new Set([
  ...EXECUTABLE_ACTION_TYPES,
  "REVIEW",
]);

function captureProposalBaseline(proposal) {
  const scope = getScopedActions(proposal);
  if (!scope.valid) {
    return {
      type: "BASELINE_RESULT",
      status: CHANGE_STATUSES.REVIEW_REQUIRED,
      baseline: null,
      reason: scope.reason,
    };
  }

  if (scope.actions.length === 0) {
    return {
      type: "BASELINE_RESULT",
      status: CHANGE_STATUSES.NOT_RUN,
      baseline: null,
      reason: "No concrete executable proposal actions are available for baseline capture.",
    };
  }

  const state = captureState(proposal.targetPath, scope.actions);
  if (!state.success) {
    return {
      type: "BASELINE_RESULT",
      status: CHANGE_STATUSES.REVIEW_REQUIRED,
      baseline: null,
      reason: state.reason,
    };
  }

  const proposalIdentity = createProposalIdentity(proposal, scope.actions);
  const baseline = {
    type: "TARGET_BASELINE",
    identity: createIdentity({ proposalIdentity, state: state.entries }),
    proposalIdentity,
    targetPath: path.resolve(proposal.targetPath),
    actions: scope.actions,
    state: state.entries,
  };

  return {
    type: "BASELINE_RESULT",
    status: "CAPTURED",
    baseline,
    reason: null,
  };
}

function detectProposalChanges(baselineResult, proposal) {
  if (!baselineResult || baselineResult.status !== "CAPTURED") {
    return {
      type: "CHANGE_DETECTION_RESULT",
      status: CHANGE_STATUSES.NOT_RUN,
      baseline: baselineResult?.baseline ?? null,
      currentState: null,
      changedPaths: [],
      reason: "Change Detection requires a captured proposal-relevant baseline.",
    };
  }

  const scope = getScopedActions(proposal);
  if (!scope.valid || scope.actions.length === 0) {
    return {
      type: "CHANGE_DETECTION_RESULT",
      status: CHANGE_STATUSES.REVIEW_REQUIRED,
      baseline: baselineResult.baseline,
      currentState: null,
      changedPaths: [],
      reason: scope.reason || "No concrete proposal scope is available.",
    };
  }

  const proposalIdentity = createProposalIdentity(proposal, scope.actions);
  if (proposalIdentity !== baselineResult.baseline.proposalIdentity) {
    return {
      type: "CHANGE_DETECTION_RESULT",
      status: CHANGE_STATUSES.REVIEW_REQUIRED,
      baseline: baselineResult.baseline,
      currentState: null,
      changedPaths: [],
      reason: "The proposal identity does not match the captured baseline.",
    };
  }

  const state = captureState(proposal.targetPath, scope.actions);
  if (!state.success) {
    return {
      type: "CHANGE_DETECTION_RESULT",
      status: CHANGE_STATUSES.REVIEW_REQUIRED,
      baseline: baselineResult.baseline,
      currentState: null,
      changedPaths: [],
      reason: state.reason,
    };
  }

  const baselineEntries = new Map(
    baselineResult.baseline.state.map((entry) => [entry.path, entry]),
  );
  const currentEntries = new Map(state.entries.map((entry) => [entry.path, entry]));
  const changedPaths = [];

  for (const pathName of new Set([...baselineEntries.keys(), ...currentEntries.keys()])) {
    if (JSON.stringify(baselineEntries.get(pathName)) !== JSON.stringify(currentEntries.get(pathName))) {
      changedPaths.push(pathName);
    }
  }

  return {
    type: "CHANGE_DETECTION_RESULT",
    status: changedPaths.length > 0
      ? CHANGE_STATUSES.MATERIAL_CHANGE
      : CHANGE_STATUSES.NO_CHANGE,
    baseline: baselineResult.baseline,
    currentState: state.entries,
    changedPaths,
    reason: changedPaths.length > 0
      ? "Proposal-relevant target state changed after baseline capture."
      : null,
  };
}

function getScopedActions(proposal) {
  if (!proposal || typeof proposal !== "object") {
    return { valid: false, actions: [], reason: "A proposal is required." };
  }

  if (!proposal.targetPath) {
    return { valid: false, actions: [], reason: "A proposal target is required." };
  }

  const isAdopt = proposal.workflow === "ADOPT" || proposal.type === "ADOPT_PROPOSAL";
  const sourceActions = isAdopt
    ? Array.isArray(proposal.actions) && proposal.actions.length > 0
      ? proposal.actions
      : Array.isArray(proposal.candidateActions)
        ? proposal.candidateActions
        : []
    : Array.isArray(proposal.actions)
      ? proposal.actions
      : [];
  const allowedActionTypes = isAdopt
    ? ADOPT_SCOPE_ACTION_TYPES
    : EXECUTABLE_ACTION_TYPES;
  if (isAdopt) {
    const unsupportedAction = sourceActions.find(
      (action) => !allowedActionTypes.has(action?.type),
    );
    if (unsupportedAction) {
      return {
        valid: false,
        actions: [],
        reason: "An ADOPT action is not a supported bounded review or change action.",
      };
    }
  }
  const actions = isAdopt
    ? sourceActions
    : sourceActions.filter((action) => allowedActionTypes.has(action?.type));

  for (const action of actions) {
    if (!action.path || !isWithinTarget(proposal.targetPath, action.path)) {
      return {
        valid: false,
        actions: [],
        reason: "A proposal action is outside the target boundary or lacks a path.",
      };
    }

    if (
      isAdopt &&
      action.targetPath &&
      path.resolve(action.targetPath) !== resolveTargetPath(proposal.targetPath, action.path)
    ) {
      return {
        valid: false,
        actions: [],
        reason: "An ADOPT action target does not match the bounded proposal target.",
      };
    }
  }

  return { valid: true, actions };
}

function captureState(targetPath, actions) {
  const entries = [];
  const seen = new Set();

  try {
    for (const action of actions) {
      const resolvedPath = resolveTargetPath(targetPath, action.path);
      if (seen.has(resolvedPath)) {
        continue;
      }
      seen.add(resolvedPath);
      entries.push(snapshotPath(targetPath, resolvedPath));
    }
  } catch (error) {
    return {
      success: false,
      entries: [],
      reason: error instanceof Error ? error.message : "Target state could not be captured.",
    };
  }

  entries.sort((left, right) => left.path.localeCompare(right.path));
  return { success: true, entries };
}

function snapshotPath(targetPath, resolvedPath) {
  const relativePath = path.relative(path.resolve(targetPath), resolvedPath) || ".";

  try {
    const stats = fs.lstatSync(resolvedPath);
    if (stats.isDirectory()) {
      return {
        path: relativePath,
        exists: true,
        kind: "directory",
        fingerprint: fingerprintDirectory(resolvedPath),
      };
    }

    if (stats.isFile()) {
      return {
        path: relativePath,
        exists: true,
        kind: "file",
        fingerprint: hash(fs.readFileSync(resolvedPath)),
      };
    }

    return {
      path: relativePath,
      exists: true,
      kind: "other",
      fingerprint: `${stats.mode}:${stats.size}`,
    };
  } catch (error) {
    if (error.code === "ENOENT") {
      return {
        path: relativePath,
        exists: false,
        kind: "missing",
        fingerprint: null,
      };
    }
    throw new Error(`Relevant target state could not be read for ${relativePath}.`);
  }
}

function createProposalIdentity(proposal, actions) {
  return createIdentity({
    workflow: proposal.workflow,
    targetPath: path.resolve(proposal.targetPath),
    actions: actions.map((action) => ({
      type: action.type,
      operation: action.operation ?? null,
      path: action.path,
      scope: action.scope ?? null,
      targetPath: action.targetPath ?? null,
    })),
  });
}

function fingerprintDirectory(directoryPath) {
  const entries = [];

  function visit(currentPath, relativePrefix) {
    const children = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const child of children.sort((left, right) => left.name.localeCompare(right.name))) {
      const relativePath = path.join(relativePrefix, child.name);
      const childPath = path.join(currentPath, child.name);
      if (child.isDirectory()) {
        entries.push({ path: relativePath, kind: "directory" });
        visit(childPath, relativePath);
      } else if (child.isFile()) {
        entries.push({
          path: relativePath,
          kind: "file",
          fingerprint: hash(fs.readFileSync(childPath)),
        });
      } else {
        const stats = fs.lstatSync(childPath);
        entries.push({
          path: relativePath,
          kind: "other",
          fingerprint: `${stats.mode}:${stats.size}`,
        });
      }
    }
  }

  visit(directoryPath, "");
  return hash(JSON.stringify(entries));
}

function createIdentity(value) {
  return hash(JSON.stringify(value));
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function resolveTargetPath(targetPath, actionPath) {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedAction = path.resolve(resolvedTarget, actionPath);
  if (!isWithinTarget(resolvedTarget, resolvedAction)) {
    throw new Error("Proposal action is outside the target boundary.");
  }
  return resolvedAction;
}

function isWithinTarget(targetPath, candidatePath) {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedCandidate = path.resolve(resolvedTarget, candidatePath);
  const relative = path.relative(resolvedTarget, resolvedCandidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

module.exports = {
  CHANGE_STATUSES,
  captureProposalBaseline,
  detectProposalChanges,
  getScopedActions,
};
