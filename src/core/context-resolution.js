"use strict";

const fs = require("node:fs");
const path = require("node:path");

const CLASSIFICATIONS = Object.freeze({
  CREATE: "CREATE",
  ADOPT: "ADOPT",
  AMBIGUOUS: "AMBIGUOUS",
});

const WORKFLOW_HINTS = Object.freeze({
  create: CLASSIFICATIONS.CREATE,
  adopt: CLASSIFICATIONS.ADOPT,
});

const SOURCE_DIRECTORIES = new Set([
  "api",
  "app",
  "client",
  "cmd",
  "internal",
  "lib",
  "server",
  "src",
]);

const KNOWLEDGE_DIRECTORIES = new Set([
  "agents",
  "config",
  "docs",
  "instructions",
  "prompts",
  "test",
  "tests",
]);

const SOURCE_EXTENSIONS = new Set([
  ".cjs",
  ".cs",
  ".dart",
  ".go",
  ".java",
  ".js",
  ".jsx",
  ".kt",
  ".mjs",
  ".php",
  ".py",
  ".rb",
  ".rs",
  ".swift",
  ".ts",
  ".tsx",
  ".vue",
  ".svelte",
]);

const METADATA_NAMES = new Set([
  ".ds_store",
  ".git",
  ".gitignore",
  ".gitkeep",
  ".gitattributes",
  "license",
  "license.md",
  "package-lock.json",
  "package.json",
  "pnpm-lock.yaml",
  "readme",
  "readme.md",
  "yarn.lock",
]);

const CONFIGURATION_NAMES = new Set([
  "cargo.toml",
  "go.mod",
  "pom.xml",
  "pyproject.toml",
  "requirements.txt",
  "tsconfig.json",
]);

function initializeContext(input = {}) {
  const userIntent = normalizeText(input.userIntent ?? input.intent);
  const adoptObjective = normalizeText(input.adoptObjective);
  const createRequirements = normalizeCreateRequirements(input);
  const resolvedDecisions = normalizeResolvedDecisions(input);
  const targetInput = normalizeText(input.targetPath ?? input.target);
  const targetPath = path.resolve(targetInput || process.cwd());
  const requestedWorkflow =
    normalizeWorkflowHint(input.workflowHint) || normalizeWorkflowHint(userIntent);
  const targetEvidence = inspectTarget(targetPath);
  const classificationResult = classifyContext(targetEvidence, requestedWorkflow);

  return createContextResult({
    userIntent,
    adoptObjective,
    createRequirements,
    resolvedDecisions,
    requestedWorkflow,
    targetPath,
    targetEvidence,
    classification: classificationResult.classification,
    unresolvedReasons: classificationResult.unresolvedReasons,
    clarification: {
      status: "not-requested",
      response: null,
    },
  });
}

function resolveClarification(context, response) {
  if (response === null || response === undefined) {
    return createContextResult({
      userIntent: context.userIntent,
      adoptObjective: context.adoptObjective,
      createRequirements: context.createRequirements,
      resolvedDecisions: context.resolvedDecisions,
      requestedWorkflow: context.requestedWorkflow,
      targetPath: context.targetPath,
      targetEvidence: context.targetEvidence,
      classification: CLASSIFICATIONS.AMBIGUOUS,
      clarification: {
        status: "unavailable",
        response: null,
      },
      unresolvedReasons: [
        ...context.unresolvedReasons,
        "No clarification response was available.",
      ],
    });
  }

  const rawResponse = normalizeText(response);
  const normalizedResponse = rawResponse?.toLowerCase();

  if (normalizedResponse === "esc") {
    return createContextResult({
      userIntent: context.userIntent,
      adoptObjective: context.adoptObjective,
      createRequirements: context.createRequirements,
      resolvedDecisions: context.resolvedDecisions,
      requestedWorkflow: context.requestedWorkflow,
      targetPath: context.targetPath,
      targetEvidence: context.targetEvidence,
      classification: CLASSIFICATIONS.AMBIGUOUS,
      clarification: {
        status: "exited",
        response: rawResponse,
      },
      unresolvedReasons: [
        ...context.unresolvedReasons,
        "Context selection was exited without choosing a workflow.",
      ],
    });
  }

  const selectedWorkflow = normalizeWorkflowHint(rawResponse);
  if (!selectedWorkflow) {
    return createContextResult({
      userIntent: context.userIntent,
      adoptObjective: context.adoptObjective,
      createRequirements: context.createRequirements,
      resolvedDecisions: context.resolvedDecisions,
      requestedWorkflow: context.requestedWorkflow,
      targetPath: context.targetPath,
      targetEvidence: context.targetEvidence,
      classification: CLASSIFICATIONS.AMBIGUOUS,
      clarification: {
        status: "invalid",
        response: rawResponse,
      },
      unresolvedReasons: [
        ...context.unresolvedReasons,
        "Context clarification must be Create, Adopt, or Esc.",
      ],
    });
  }

  const reevaluated = initializeContext({
    userIntent: context.userIntent,
    adoptObjective: context.adoptObjective,
    createRequirements: context.createRequirements,
    resolvedDecisions: context.resolvedDecisions,
    targetPath: context.targetPath,
    workflowHint: selectedWorkflow,
  });

  return {
    ...reevaluated,
    clarification: {
      ...reevaluated.clarification,
      status: "applied",
      response: rawResponse,
    },
  };
}

function classifyContext(targetEvidence, requestedWorkflow) {
  if (!targetEvidence.readable) {
    return {
      classification: CLASSIFICATIONS.AMBIGUOUS,
      unresolvedReasons: [
        "The target could not be inspected safely.",
      ],
    };
  }

  if (targetEvidence.kind === "file") {
    return {
      classification: CLASSIFICATIONS.AMBIGUOUS,
      unresolvedReasons: [
        "The target is a file rather than a bounded project directory.",
      ],
    };
  }

  if (targetEvidence.meaningfulProject && requestedWorkflow === CLASSIFICATIONS.CREATE) {
    return {
      classification: CLASSIFICATIONS.AMBIGUOUS,
      unresolvedReasons: [
        "Explicit CREATE intent conflicts with meaningful existing project evidence.",
      ],
    };
  }

  if (targetEvidence.meaningfulProject) {
    return {
      classification: CLASSIFICATIONS.ADOPT,
      unresolvedReasons: [],
    };
  }

  if (requestedWorkflow === CLASSIFICATIONS.ADOPT) {
    return {
      classification: CLASSIFICATIONS.AMBIGUOUS,
      unresolvedReasons: [
        "ADOPT requires sufficiently evidenced meaningful existing project work.",
      ],
    };
  }

  if (requestedWorkflow === CLASSIFICATIONS.CREATE && targetEvidence.newTargetCandidate) {
    return {
      classification: CLASSIFICATIONS.CREATE,
      unresolvedReasons: [],
    };
  }

  return {
    classification: CLASSIFICATIONS.AMBIGUOUS,
    unresolvedReasons: [
      "The available target evidence and intent are insufficient to distinguish CREATE from ADOPT.",
    ],
  };
}

function createContextResult({
  userIntent,
  adoptObjective,
  createRequirements,
  resolvedDecisions,
  requestedWorkflow,
  targetPath,
  targetEvidence,
  classification,
  clarification,
  unresolvedReasons,
}) {
  const reasons = unresolvedReasons ?? [];
  const evidence = [...targetEvidence.evidence];

  if (userIntent) {
    evidence.push(`Initial user intent: ${userIntent}`);
  } else {
    evidence.push("Initial user intent: not provided");
  }

  if (requestedWorkflow) {
    evidence.push(`Explicit workflow hint: ${requestedWorkflow}`);
  } else if (userIntent) {
    evidence.push("The initial intent does not provide an exact CREATE or ADOPT hint.");
  }

  return {
    classification,
    userIntent: userIntent || null,
    adoptObjective: adoptObjective || null,
    createRequirements,
    resolvedDecisions,
    requestedWorkflow: requestedWorkflow || null,
    targetPath,
    target: {
      exists: targetEvidence.exists,
      kind: targetEvidence.kind,
      readable: targetEvidence.readable,
      empty: targetEvidence.empty,
      metadataOnly: targetEvidence.metadataOnly,
      meaningfulProject: targetEvidence.meaningfulProject,
    },
    evidence,
    unresolvedReasons: reasons,
    clarificationRequired: classification === CLASSIFICATIONS.AMBIGUOUS && clarification.status !== "exited",
    clarificationOptions:
      classification === CLASSIFICATIONS.AMBIGUOUS && clarification.status !== "exited"
        ? ["Create", "Adopt", "Esc"]
        : [],
    clarification,
    targetEvidence,
  };
}

function inspectTarget(targetPath) {
  let targetStat;

  try {
    targetStat = fs.statSync(targetPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return {
        exists: false,
        kind: "missing",
        readable: true,
        empty: true,
        metadataOnly: false,
        meaningfulProject: false,
        newTargetCandidate: true,
        evidence: [
          `Target does not exist yet: ${targetPath}`,
          "No existing project evidence was found at the target.",
        ],
      };
    }

    return {
      exists: false,
      kind: "unavailable",
      readable: false,
      empty: false,
      metadataOnly: false,
      meaningfulProject: false,
      newTargetCandidate: false,
      evidence: [
        `Target inspection failed with ${error.code || "an unknown filesystem error"}.`,
      ],
    };
  }

  if (!targetStat.isDirectory()) {
    return {
      exists: true,
      kind: "file",
      readable: true,
      empty: false,
      metadataOnly: false,
      meaningfulProject: false,
      newTargetCandidate: false,
      evidence: [`Target exists but is not a directory: ${targetPath}`],
    };
  }

  let entries;
  try {
    entries = fs.readdirSync(targetPath, { withFileTypes: true });
  } catch (error) {
    return {
      exists: true,
      kind: "directory",
      readable: false,
      empty: false,
      metadataOnly: false,
      meaningfulProject: false,
      newTargetCandidate: false,
      evidence: [
        `Target directory could not be read with ${error.code || "an unknown filesystem error"}.`,
      ],
    };
  }

  const meaningfulSignals = collectMeaningfulSignals(targetPath, entries);
  const metadataOnly =
    entries.length > 0 && entries.every((entry) => isMetadataName(entry.name));
  const empty = entries.length === 0;
  const meaningfulProject = meaningfulSignals.length > 0;
  const newTargetCandidate = empty || metadataOnly;
  const evidence = [
    `Target exists and is a directory: ${targetPath}`,
    empty
      ? "Target directory is empty."
      : `Target contains ${entries.length} top-level entr${entries.length === 1 ? "y" : "ies"}.`,
    metadataOnly
      ? "Observed target entries are limited to metadata or project-container artifacts."
      : "Target is not metadata-only based on the inspected top-level evidence.",
    meaningfulProject
      ? `Meaningful project signals: ${meaningfulSignals.join(", ")}.`
      : "No established meaningful project signal was found in the inspected target evidence.",
  ];

  return {
    exists: true,
    kind: "directory",
    readable: true,
    empty,
    metadataOnly,
    meaningfulProject,
    newTargetCandidate,
    evidence,
    meaningfulSignals,
  };
}

function collectMeaningfulSignals(targetPath, entries) {
  const signals = [];

  for (const entry of entries) {
    const normalizedName = entry.name.toLowerCase();

    if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(normalizedName))) {
      signals.push(`source file ${entry.name}`);
      continue;
    }

    if (!entry.isDirectory() || !hasMeaningfulChildren(path.join(targetPath, entry.name))) {
      continue;
    }

    if (SOURCE_DIRECTORIES.has(normalizedName)) {
      signals.push(`source directory ${entry.name}`);
    } else if (KNOWLEDGE_DIRECTORIES.has(normalizedName)) {
      signals.push(`project knowledge directory ${entry.name}`);
    }
  }

  return signals;
}

function hasMeaningfulChildren(directoryPath) {
  try {
    const children = fs.readdirSync(directoryPath, { withFileTypes: true });
    return children.some((child) => !isMetadataName(child.name));
  } catch {
    return false;
  }
}

function isMetadataName(name) {
  const normalizedName = name.toLowerCase();
  return (
    METADATA_NAMES.has(normalizedName) ||
    CONFIGURATION_NAMES.has(normalizedName) ||
    normalizedName.endsWith(".lock")
  );
}

function normalizeCreateRequirements(input) {
  const source = input.createRequirements || input;

  return {
    projectPurpose: normalizeText(source.projectPurpose),
    projectType: normalizeText(source.projectType),
    initialScope: normalizeText(source.initialScope),
  };
}

function normalizeResolvedDecisions(input) {
  const source = input.resolvedDecisions || {};
  const concreteActions = Array.isArray(source.concreteActions)
    ? [...source.concreteActions]
    : [];
  const actionPath = normalizeText(input.createActionPath ?? source.createActionPath);
  const actionContent = input.createActionContent ?? source.createActionContent;

  if ((actionPath || actionContent !== undefined) && concreteActions.length === 0) {
    concreteActions.push({
      type: "CREATE",
      path: actionPath,
      content: typeof actionContent === "string" ? actionContent : null,
      source: "explicit-requirement",
      requirement: "resolved-create-action-input",
    });
  }

  return concreteActions.length > 0 ? { concreteActions } : null;
}

function normalizeWorkflowHint(value) {
  const normalizedValue = normalizeText(value)?.toLowerCase();
  return normalizedValue ? WORKFLOW_HINTS[normalizedValue] || null : null;
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue || null;
}

module.exports = {
  CLASSIFICATIONS,
  initializeContext,
  resolveClarification,
};
