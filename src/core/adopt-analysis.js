"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ADOPT_WORKFLOW = "ADOPT";
const SOURCE_EXTENSIONS = new Set([
  ".cjs",
  ".go",
  ".java",
  ".js",
  ".jsx",
  ".mjs",
  ".py",
  ".rb",
  ".rs",
  ".ts",
  ".tsx",
]);

function analyzeAdoptContext(context) {
  if (!context || context.classification !== ADOPT_WORKFLOW) {
    return createUnresolvedResult(context, "ADOPT analysis requires a resolved ADOPT context.");
  }

  const inspection = inspectTarget(context.targetPath);
  if (!inspection.readable) {
    return createUnresolvedResult(
      context,
      "The ADOPT target could not be inspected safely.",
      inspection.evidence,
    );
  }

  const explicitContext = context.requestedWorkflow === ADOPT_WORKFLOW
    ? [
        {
          key: "workflowSelection",
          value: "ADOPT",
          source: "explicit-context-selection",
        },
      ]
    : [];
  const unresolvedDecisions = [
    {
      key: "adoptObjective",
      reason: "The current CLI context does not establish which change objective should be reconciled with the existing project.",
      blocking: true,
    },
  ];

  return {
    type: "ADOPT_ANALYSIS_RESULT",
    workflow: ADOPT_WORKFLOW,
    context,
    evidence: inspection.evidence,
    projectUnderstanding: inspection.projectUnderstanding,
    preservationScope: [
      {
        type: "EXISTING_TARGET",
        path: context.targetPath,
        source: "target-evidence",
        rationale: "Existing project material is preserved during ADOPT analysis.",
      },
      {
        type: "UNRELATED_TARGET_CONTENT",
        path: context.targetPath,
        source: "KHWAMI_ADOPT.md",
        rationale: "Unrelated existing content remains outside any future proposal until explicitly analyzed and approved.",
      },
    ],
    requirementReconciliation: {
      explicit: explicitContext,
      satisfied: [],
      missing: unresolvedDecisions,
      conflicts: [],
      assumptions: [],
    },
    assumptions: [],
    unresolvedDecisions,
    candidateActions: [],
    risks: [
      "ADOPT proposal generation cannot proceed until the current change objective is established.",
    ],
    validationExpectations: {
      ready: false,
      expectations: [
        {
          key: "preservation",
          status: "unresolved",
          reason: "Concrete preservation checks require a future bounded ADOPT proposal.",
        },
      ],
    },
    sufficientForProposal: false,
  };
}

function createUnresolvedResult(context, reason, evidence = []) {
  return {
    type: "ADOPT_ANALYSIS_RESULT",
    workflow: ADOPT_WORKFLOW,
    context: context || null,
    evidence,
    projectUnderstanding: {},
    preservationScope: [],
    requirementReconciliation: {
      explicit: [],
      satisfied: [],
      missing: [{ key: "adoptContext", reason }],
      conflicts: [],
      assumptions: [],
    },
    assumptions: [],
    unresolvedDecisions: [{ key: "adoptContext", reason, blocking: true }],
    candidateActions: [],
    risks: [reason],
    validationExpectations: { ready: false, expectations: [] },
    sufficientForProposal: false,
  };
}

function inspectTarget(targetPath) {
  const evidence = [];
  let entries;

  try {
    const stats = fs.statSync(targetPath);
    if (!stats.isDirectory()) {
      return {
        readable: false,
        evidence: [`Target is not a directory: ${targetPath}`],
        projectUnderstanding: {},
      };
    }
    entries = fs.readdirSync(targetPath, { withFileTypes: true });
  } catch (error) {
    return {
      readable: false,
      evidence: [`ADOPT target inspection failed: ${error.code || "unknown error"}`],
      projectUnderstanding: {},
    };
  }

  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const sourceFiles = files.filter((file) => SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const relevantPaths = collectBoundedPaths(targetPath, entries);
  const packageEntry = entries.find(
    (entry) => entry.isFile() && entry.name.toLowerCase() === "package.json",
  );
  const readme = files.find((file) => file.toLowerCase() === "readme.md" || file.toLowerCase() === "readme");
  const docsDirectory = directories.find((directory) => directory.toLowerCase() === "docs");

  evidence.push({
    kind: "target",
    source: "target-evidence",
    value: `Existing directory with ${files.length} files and ${directories.length} directories.`,
  });
  evidence.push({
    kind: "files",
    source: "target-evidence",
    value: files,
  });
  evidence.push({
    kind: "directories",
    source: "target-evidence",
    value: directories,
  });
  evidence.push({
    kind: "relevant-paths",
    source: "target-evidence",
    value: relevantPaths,
  });

  const projectUnderstanding = {
    target: {
      path: targetPath,
      exists: true,
      kind: "directory",
      readable: true,
    },
    existingFiles: {
      value: files,
      source: "target-evidence",
    },
    existingDirectories: {
      value: directories,
      source: "target-evidence",
    },
    relevantPaths: {
      value: relevantPaths,
      source: "target-evidence",
    },
    sourceFiles: {
      value: sourceFiles,
      source: "target-evidence",
    },
    documentation: {
      value: Boolean(readme || docsDirectory),
      source: "target-evidence",
    },
    sourceOrganization: directories.length > 0
      ? {
          value: directories.filter((name) => ["src", "app", "lib", "server", "client"].includes(name.toLowerCase())),
          source: "target-evidence",
        }
      : {
          status: "unresolved",
          source: "unresolved",
          reason: "No source organization can be established from the target entries.",
        },
    technology: {
      status: "unresolved",
      source: "unresolved",
      reason: "Technology evidence requires inspection of relevant project metadata or source files.",
    },
    runtime: {
      status: "unresolved",
      source: "unresolved",
      reason: "Runtime evidence is not established by directory names alone.",
    },
    relevantMetadata: [],
    entryPoints: [],
  };

  if (packageEntry) {
    const packageEvidence = readPackageEvidence(path.join(targetPath, packageEntry.name));
    projectUnderstanding.relevantMetadata.push(packageEvidence);
    evidence.push(packageEvidence);
    if (packageEvidence.technology) {
      projectUnderstanding.technology = {
        value: packageEvidence.technology,
        source: "derived-from-evidence",
        evidence: packageEntry.name,
      };
    }
    if (packageEvidence.runtime) {
      projectUnderstanding.runtime = {
        value: packageEvidence.runtime,
        source: "derived-from-evidence",
        evidence: packageEntry.name,
      };
    }
  }

  if (sourceFiles.length > 0) {
    projectUnderstanding.entryPoints = {
      value: sourceFiles,
      source: "target-evidence",
    };
  }

  return {
    readable: true,
    evidence,
    projectUnderstanding,
  };
}

function collectBoundedPaths(targetPath, entries) {
  const paths = [];

  function visit(directoryPath, relativePrefix, depth) {
    if (depth > 2) {
      return;
    }

    let children;
    try {
      children = fs.readdirSync(directoryPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const child of children) {
      const relativePath = path.join(relativePrefix, child.name);
      paths.push(relativePath);
      if (child.isDirectory()) {
        visit(path.join(directoryPath, child.name), relativePath, depth + 1);
      }
    }
  }

  for (const entry of entries) {
    const relativePath = entry.name;
    paths.push(relativePath);
    if (entry.isDirectory()) {
      visit(path.join(targetPath, entry.name), relativePath, 1);
    }
  }

  return [...new Set(paths)].sort();
}

function readPackageEvidence(packagePath) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const dependencies = [
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {}),
    ];
    const technology = dependencies.find((name) =>
      /react-native|react|typescript|node/i.test(name),
    );
    return {
      kind: "package-manifest",
      source: "target-evidence",
      file: path.basename(packagePath),
      name: packageJson.name || null,
      technology: technology || null,
      runtime: packageJson.engines?.node ? "Node.js" : null,
      dependencyNames: dependencies,
    };
  } catch {
    return {
      kind: "package-manifest",
      source: "target-evidence",
      file: path.basename(packagePath),
      status: "unresolved",
      reason: "Package metadata could not be parsed.",
    };
  }
}

module.exports = {
  analyzeAdoptContext,
};
