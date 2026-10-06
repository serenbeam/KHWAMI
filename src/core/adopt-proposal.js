"use strict";

const EXCLUDED_ACTIONS = Object.freeze([
  "executable action derivation",
  "permission",
  "Approved Scope",
  "execution",
  "validation",
]);

function generateAdoptProposal(requirementResult) {
  if (
    !requirementResult ||
    requirementResult.type !== "ADOPT_REQUIREMENT_RESULT"
  ) {
    throw new TypeError("ADOPT proposal generation requires an ADOPT requirement result.");
  }

  const blockingItems = requirementResult.unresolvedDecisions.filter(
    (item) => item.blocking === true,
  );
  const relevantAreas = requirementResult.requirementReconciliation.relevantExistingAreas || [];
  const unresolvedReviewItems = requirementResult.unresolvedDecisions.map((item) => ({
    topic: item.key,
    reason: item.reason,
    blocking: item.blocking === true,
    source: "ADOPT requirement reconciliation",
  }));

  if (relevantAreas.length === 0 && requirementResult.proposalReadiness.sufficient) {
    unresolvedReviewItems.push({
      topic: "relevantExistingArea",
      reason: "The explicit objective is not yet bounded to a relevant existing project area.",
      blocking: true,
      source: "ADOPT target understanding",
    });
  }

  const readiness = blockingItems.length > 0 || relevantAreas.length === 0
    ? requirementResult.requirementReconciliation.status === "REVIEW_REQUIRED"
      ? "REVIEW_REQUIRED"
      : "BLOCKED"
    : "READY";
  const proposedChangeAreas = relevantAreas.map((area) => ({
    area,
    intent: requirementResult.adoptObjective.value,
    rationale: "Relevant existing area identified by bounded target evidence.",
    source: "target-evidence",
    executable: false,
  }));

  return {
    type: "ADOPT_PROPOSAL",
    version: 1,
    workflow: "ADOPT",
    status: readiness,
    objective: {
      value: requirementResult.adoptObjective.value,
      source: requirementResult.adoptObjective.source,
    },
    targetPath: requirementResult.context?.targetPath || null,
    context: requirementResult.context,
    target: {
      understanding: requirementResult.existingProjectUnderstanding,
      relevantAreas,
    },
    evidence: requirementResult.evidence,
    preservationScope: requirementResult.preservationScope,
    proposedChangeAreas,
    risks: requirementResult.risks,
    dependencies: {
      status: "unresolved",
      reason: "ADOPT action dependencies are deferred to action derivation.",
    },
    validationExpectations: requirementResult.validationExpectations,
    unresolvedReviewItems,
    candidateActions: [],
    executable: false,
    executionDeferred: true,
    reviewRequired: true,
    scope: {
      type: "ADOPT_BOUNDARY",
      targetPath: requirementResult.context?.targetPath || null,
    },
    intendedActions: proposedChangeAreas.map((area) => area.intent),
    excludedActions: EXCLUDED_ACTIONS,
  };
}

module.exports = {
  generateAdoptProposal,
};
