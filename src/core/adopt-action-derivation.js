"use strict";

const path = require("node:path");

function deriveAdoptActions(proposalResult) {
  if (!proposalResult || proposalResult.proposal?.type !== "ADOPT_PROPOSAL") {
    return {
      type: "ADOPT_ACTION_RESULT",
      status: "BLOCKED",
      workflow: "ADOPT",
      proposal: proposalResult?.proposal || null,
      candidateActions: [],
      unresolvedDecisions: [
        {
          key: "adoptProposal",
          reason: "ADOPT action derivation requires an ADOPT proposal.",
          blocking: true,
        },
      ],
      executable: false,
    };
  }

  const proposal = proposalResult.proposal;
  if (proposal.status !== "READY") {
    return {
      type: "ADOPT_ACTION_RESULT",
      status: proposal.status,
      workflow: "ADOPT",
      proposal: createScopedProposal(proposal, [], proposal.status),
      candidateActions: [],
      unresolvedDecisions: proposal.unresolvedReviewItems || [],
      executable: false,
    };
  }

  const candidateActions = [];
  const unresolvedDecisions = [];

  for (const changeArea of proposal.proposedChangeAreas || []) {
    const areaPath = changeArea.area;
    if (!areaPath || !isWithinTarget(proposal.targetPath, areaPath)) {
      unresolvedDecisions.push({
        key: areaPath || "missing-area",
        reason: "The proposed ADOPT area is outside the bounded target or is missing.",
        blocking: true,
      });
      continue;
    }

    candidateActions.push({
      type: "REVIEW",
      operation: "REVIEW_EXISTING_AREA",
      path: areaPath,
      targetPath: path.resolve(proposal.targetPath, areaPath),
      scope: areaPath,
      purpose: changeArea.intent,
      rationale: changeArea.rationale,
      evidence: [changeArea.source],
      provenance: {
        source: changeArea.source,
        objective: proposal.objective,
      },
      status: "REVIEW",
      executable: false,
    });
  }

  if (candidateActions.length === 0 && unresolvedDecisions.length === 0) {
    unresolvedDecisions.push({
      key: "adoptChangeAreas",
      reason: "No bounded existing-project area supports an ADOPT candidate action.",
      blocking: true,
    });
  }

  const actionStatus = unresolvedDecisions.some((item) => item.blocking)
    ? "REVIEW_REQUIRED"
    : "DERIVED";

  return {
    type: "ADOPT_ACTION_RESULT",
    status: actionStatus,
    workflow: "ADOPT",
    proposal: createScopedProposal(proposal, candidateActions, actionStatus),
    candidateActions,
    unresolvedDecisions,
    executable: false,
  };
}

function createScopedProposal(proposal, candidateActions, actionStatus) {
  return {
    ...proposal,
    status: actionStatus === "REVIEW_REQUIRED" ? "REVIEW_REQUIRED" : proposal.status,
    actions: candidateActions.map((action) => ({ ...action })),
    candidateActions: candidateActions.map((action) => ({ ...action })),
    actionDerivation: {
      type: "ADOPT_ACTION_RESULT",
      status: actionStatus,
      executable: false,
    },
  };
}

function isWithinTarget(targetPath, candidatePath) {
  const target = path.resolve(targetPath);
  const candidate = path.resolve(target, candidatePath);
  const relative = path.relative(target, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

module.exports = {
  deriveAdoptActions,
};
