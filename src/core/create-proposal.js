"use strict";

const { deriveCreateActions } = require("./create-action-derivation");

const REVIEW_ACTION = "REVIEW";

const EXCLUDED_ACTIONS = Object.freeze([
  "workflow execution",
  "filesystem mutation",
  "project modification",
  "dependency installation",
  "Git state changes",
  "Change Detection",
  "Approved Scope",
]);

function generateCreateProposal(analysisResult) {
  if (
    !analysisResult ||
    analysisResult.type !== "CREATE_ANALYSIS_RESULT" ||
    !analysisResult.context
  ) {
    throw new TypeError("CREATE proposal generation requires a CREATE Analysis Result.");
  }

  const actionDerivation = deriveCreateActions({
    analysisResult,
    projectShape: analysisResult.projectShape,
    resolvedDecisions: analysisResult.resolvedDecisions,
  });
  const actions = [
    ...actionDerivation.actions,
    ...createProposalActions(analysisResult),
  ];
  const unresolvedReviewItems = mergeReviewItems([
    ...createReviewItems(analysisResult),
    ...actionDerivation.reviewItems,
  ]);
  const blockingReviewItems = unresolvedReviewItems.filter(
    (item) => item.blocking === true,
  );
  const readiness = actionDerivation.readiness === "READY" && blockingReviewItems.length === 0
    ? "READY"
    : blockingReviewItems.length > 0
      ? "BLOCKED"
      : "REVIEW_REQUIRED";

  const proposal = {
    type: "CREATE_PROPOSAL",
    version: 1,
    workflow: "CREATE",
    summary: createSummary(analysisResult),
    targetPath: analysisResult.context.targetPath,
    context: analysisResult.context,
    analysis: analysisResult,
    actions,
    actionDerivation,
    preservedScope: [
      {
        type: "TARGET_BOUNDARY",
        path: analysisResult.context.targetPath,
        rationale:
          "Existing target material outside explicitly reviewed actions remains preserved.",
        source: "KHWAMI_CREATE.md / KHWAMI_OPERATING_CONTRACT.md",
      },
    ],
    risks: Array.isArray(analysisResult.risks)
      ? [...analysisResult.risks]
      : [],
    dependencies: analysisResult.projectShape?.dependencies || {
      status: "unresolved",
      reason: "Dependency direction is not established by the current analysis.",
    },
    validationExpectations: analysisResult.validationExpectations,
    unresolvedReviewItems,
    readiness,
    intendedActions: actions.map((action) => action.rationale),
    excludedActions: EXCLUDED_ACTIONS,
    executionDeferred: true,
    reviewRequired: true,
  };

  return proposal;
}

function createProposalActions(analysisResult) {
  const candidateActions = Array.isArray(analysisResult.candidateActions)
    ? analysisResult.candidateActions
    : [];

  return candidateActions.map((candidate) => ({
    type: candidate.action || REVIEW_ACTION,
    path: analysisResult.context.targetPath,
    scope: candidate.key || "CREATE project shape",
    rationale:
      candidate.summary ||
      candidate.reason ||
      "Review the unresolved CREATE project-shape decision.",
    source: candidate.supportingEvidence || ["CREATE Analysis Result"],
    status: "REVIEW",
  }));
}

function mergeReviewItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.topic || item.key || item.reason;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function createReviewItems(analysisResult) {
  const decisions = Array.isArray(analysisResult.unresolvedDecisions)
    ? analysisResult.unresolvedDecisions
    : [];
  const seen = new Set();

  return decisions
    .filter((decision) => {
      if (seen.has(decision.key)) {
        return false;
      }
      seen.add(decision.key);
      return true;
    })
    .map((decision) => ({
      topic: decision.key,
      reason: decision.reason,
      blocking: decision.blocking === true,
      source: decision.supportingEvidence || ["CREATE Analysis Result"],
    }));
}

function createSummary(analysisResult) {
  const explicit = new Map(
    (analysisResult.requirements?.explicit || []).map((item) => [item.key, item.value]),
  );
  const purpose = explicit.get("projectPurpose") || "CREATE project";
  const projectType = explicit.get("projectType");
  const scope = explicit.get("initialScope");
  const details = [projectType, scope].filter(Boolean).join(" — ");

  return details ? `${purpose}: ${details}` : purpose;
}

module.exports = {
  generateCreateProposal,
};
