"use strict";

const BROAD_OBJECTIVES = new Set([
  "improve the app",
  "improve the application",
  "improve the project",
  "update the app",
  "update the application",
  "fix the app",
  "fix the application",
  "fix the project",
  "make changes",
  "adopt this project",
]);

function reconcileAdoptObjective(analysisResult) {
  const context = analysisResult?.context;
  const objectiveValue = context?.adoptObjective || null;
  const projectUnderstanding = analysisResult?.projectUnderstanding || {};
  const relevantPaths = projectUnderstanding.relevantPaths?.value || [];
  const relevantExistingAreas = findRelevantAreas(objectiveValue, relevantPaths);
  const unresolvedDecisions = [];
  const conflicts = [];

  if (!objectiveValue) {
    unresolvedDecisions.push({
      key: "adoptObjective",
      reason: "An explicit developer objective is required before ADOPT proposal preparation.",
      blocking: true,
    });
  } else if (isBroadObjective(objectiveValue)) {
    unresolvedDecisions.push({
      key: "adoptObjective",
      reason: "The ADOPT objective is too broad to establish a bounded change target.",
      blocking: true,
    });
  }

  const conflict = detectTargetConflict(objectiveValue, relevantPaths);
  if (conflict) {
    conflicts.push(conflict);
    unresolvedDecisions.push({
      key: "targetBoundary",
      reason: conflict.reason,
      blocking: true,
    });
  }

  const hasBroadObjective = objectiveValue && isBroadObjective(objectiveValue);
  const explicitContext = objectiveValue
    ? [
        {
          key: "adoptObjective",
          value: objectiveValue,
          source: "explicit",
        },
      ]
    : [];
  const status = conflicts.length > 0 || hasBroadObjective
    ? "REVIEW_REQUIRED"
    : unresolvedDecisions.length > 0
      ? "BLOCKED"
      : "RESOLVED";

  return {
    type: "ADOPT_REQUIREMENT_RESULT",
    workflow: "ADOPT",
    context,
    adoptObjective: {
      status: objectiveValue && !isBroadObjective(objectiveValue) ? "RESOLVED" : "UNRESOLVED",
      source: objectiveValue ? "explicit" : "none",
      value: objectiveValue,
    },
    existingProjectUnderstanding: projectUnderstanding,
    requirementReconciliation: {
      status,
      objective: objectiveValue,
      explicit: explicitContext,
      supportingEvidence: analysisResult?.evidence || [],
      relevantExistingAreas,
      conflicts,
      unresolvedDecisions,
    },
    proposalReadiness: {
      sufficient: status === "RESOLVED",
      blockingReasons: unresolvedDecisions.map((item) => item.reason),
    },
    evidence: analysisResult?.evidence || [],
    supportingEvidence: analysisResult?.evidence || [],
    preservationScope: analysisResult?.preservationScope || [],
    assumptions: [],
    unresolvedDecisions,
    candidateActions: [],
    risks: analysisResult?.risks || [],
    validationExpectations: analysisResult?.validationExpectations || {
      ready: false,
      expectations: [],
    },
  };
}

function isBroadObjective(value) {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  return BROAD_OBJECTIVES.has(normalized) || normalized.length < 12;
}

function findRelevantAreas(objective, paths) {
  if (!objective) {
    return [];
  }

  const ignoredTokens = new Set([
    "add",
    "change",
    "existing",
    "introduce",
    "module",
    "offline",
    "support",
    "update",
  ]);
  const tokens = objective
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !ignoredTokens.has(token));

  return paths.filter((candidate) => {
    const segments = candidate.toLowerCase().split(/[\\/]/);
    return tokens.some((token) => segments.includes(token));
  });
}

function detectTargetConflict(objective, paths) {
  if (!objective) {
    return null;
  }

  const normalized = objective.toLowerCase();
  const normalizedPaths = paths.map((value) => value.toLowerCase());
  const targetedAreas = [
    ["frontend", ["frontend", "client", "web", "app"]],
    ["backend", ["backend", "server", "api", "service"]],
    ["mobile", ["mobile", "ios", "android"]],
    ["authentication", ["auth", "authentication", "login"]],
  ];

  for (const [term, evidenceTerms] of targetedAreas) {
    if (!normalized.includes(term)) {
      continue;
    }
    if (!evidenceTerms.some((evidenceTerm) => normalizedPaths.some((candidate) => candidate.includes(evidenceTerm)))) {
      return {
        topic: term,
        reason: `The objective refers to ${term}, but the bounded existing-project evidence does not identify a matching area.`,
        source: "objective/evidence reconciliation",
      };
    }
  }

  return null;
}

module.exports = {
  reconcileAdoptObjective,
};
