"use strict";

const path = require("node:path");

const EXECUTABLE_ACTION_TYPES = new Set(["CREATE"]);

function deriveCreateActions({ analysisResult, projectShape, resolvedDecisions }) {
  const decisions = resolvedDecisions || analysisResult?.resolvedDecisions || {};
  const actions = [];
  const reviewItems = [];
  const recommendations = [];

  const technology = projectShape?.technology;
  if (technology?.status === "unresolved") {
    const candidates = recommendTechnology(analysisResult);
    recommendations.push({
      topic: "technology",
      status: "REVIEW_REQUIRED",
      candidates,
      source: candidates.length > 0 ? "available-runtime-evidence" : "insufficient-evidence",
      reason: "Technology must be explicitly resolved before technology-dependent actions are executable.",
    });
    reviewItems.push({
      topic: "technology",
      reason: "Technology direction is unresolved; no technology-dependent action was derived.",
      blocking: true,
      source: ["CREATE project-shape analysis"],
    });
  }

  const concreteActions = Array.isArray(decisions.concreteActions)
    ? decisions.concreteActions
    : [];

  for (const action of concreteActions) {
    const result = normalizeConcreteAction(action, analysisResult);
    if (result.action) {
      actions.push(result.action);
    }
    if (result.reviewItem) {
      reviewItems.push(result.reviewItem);
    }
  }

  if (concreteActions.length === 0) {
    reviewItems.push({
      topic: "concreteActions",
      reason: "No explicit resolved CREATE action with complete execution data was supplied.",
      blocking: true,
      source: ["CREATE requirements and project-shape analysis"],
    });
  }

  const blockingReviewItems = reviewItems.filter((item) => item.blocking === true);

  return {
    type: "CREATE_ACTION_DERIVATION_RESULT",
    actions,
    reviewItems,
    recommendations,
    readiness: actions.length > 0 && blockingReviewItems.length === 0
      ? "READY"
      : "REVIEW_REQUIRED",
  };
}

function normalizeConcreteAction(action, analysisResult) {
  if (!action || !EXECUTABLE_ACTION_TYPES.has(action.type)) {
    return {
      action: null,
      reviewItem: {
        topic: "actionType",
        reason: "Only explicitly supported CREATE file actions can be executable.",
        blocking: true,
        source: ["resolved proposal decision"],
      },
    };
  }

  if (!action.path || typeof action.content !== "string") {
    return {
      action: null,
      reviewItem: {
        topic: action.path || "CREATE action",
        reason: "CREATE execution requires a bounded path and complete file content.",
        blocking: true,
        source: ["resolved proposal decision"],
      },
    };
  }

  if (!isWithinTarget(analysisResult.context.targetPath, action.path)) {
    return {
      action: null,
      reviewItem: {
        topic: action.path,
        reason: "CREATE action is outside the resolved target boundary.",
        blocking: true,
        source: ["resolved proposal decision", "target boundary"],
      },
    };
  }

  return {
    action: {
      type: action.type,
      path: action.path,
      scope: action.scope || "file",
      content: action.content,
      rationale: action.rationale || "Explicitly resolved CREATE file action.",
      source: action.source || "explicit-requirement",
      provenance: action.provenance || {
        source: action.source || "resolved-proposal-decision",
        requirement: action.requirement || null,
      },
      status: "PROPOSED",
    },
    reviewItem: null,
  };
}

function recommendTechnology(analysisResult) {
  const projectType = analysisResult.requirements?.explicit?.find(
    (item) => item.key === "projectType",
  )?.value?.toLowerCase();

  if (projectType?.includes("cli") || projectType?.includes("command-line")) {
    return [
      {
        value: "Node.js",
        source: "available-runtime-evidence",
        reason: "Node.js is available in the current KHWAMI runtime; explicit target-project selection is still required.",
      },
    ];
  }

  return [];
}

function isWithinTarget(targetPath, actionPath) {
  const target = path.resolve(targetPath);
  const candidate = path.resolve(target, actionPath);
  const relative = path.relative(target, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

module.exports = {
  deriveCreateActions,
};
