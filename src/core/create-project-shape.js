"use strict";

const fs = require("node:fs");
const path = require("node:path");

const TECHNOLOGY_DIRECTIONS = [
  {
    match: /react[\s-]*native/i,
    technology: "React Native",
    runtime: "JavaScript/TypeScript ecosystem",
  },
  {
    match: /typescript/i,
    technology: "TypeScript",
    runtime: "Node.js or browser JavaScript ecosystem",
  },
  {
    match: /javascript/i,
    technology: "JavaScript",
    runtime: "JavaScript runtime ecosystem",
  },
  {
    match: /node(?:\.js)?/i,
    technology: "Node.js",
    runtime: "Node.js",
  },
  {
    match: /python/i,
    technology: "Python",
    runtime: "Python",
  },
  {
    match: /rust/i,
    technology: "Rust",
    runtime: "Rust runtime/toolchain",
  },
  {
    match: /\bgo\b/i,
    technology: "Go",
    runtime: "Go runtime/toolchain",
  },
];

function analyzeCreateProjectShape(context, requirements) {
  const explicitRequirements = new Map(
    (requirements?.explicit || []).map((item) => [item.key, item]),
  );
  const projectType = explicitRequirements.get("projectType")?.value || "";
  const targetEvidence = inspectTargetEvidence(context);
  const projectShape = {
    application: deriveApplication(projectType),
    platform: derivePlatform(projectType),
    technology: deriveTechnology(projectType, targetEvidence),
    runtime: deriveRuntime(projectType, targetEvidence),
    sourceOrganization: deriveSourceOrganization(targetEvidence),
    architecture: unresolvedShape(
      "architecture",
      "Architecture direction is not established by the current requirements or target evidence.",
      false,
    ),
    dependencies: deriveDependencies(targetEvidence),
    testing: deriveExpectation(
      explicitRequirements,
      "testing",
      "Testing expectations are not established by the current CREATE inputs.",
    ),
    documentation: deriveExpectation(
      explicitRequirements,
      "documentation",
      "Documentation expectations are not established by the current CREATE inputs.",
    ),
  };

  const unresolvedDecisions = [];
  const deferredDecisions = [];
  const blockingDecisions = [];

  for (const [key, value] of Object.entries(projectShape)) {
    if (value.status !== "unresolved") {
      continue;
    }

    const decision = {
      key,
      reason: value.reason,
      blocking: value.blocking === true,
    };
    unresolvedDecisions.push(decision);

    if (decision.blocking) {
      blockingDecisions.push(decision);
    } else {
      deferredDecisions.push(decision);
    }
  }

  return {
    projectShape,
    targetEvidence,
    unresolvedDecisions,
    deferredDecisions,
    blockingDecisions,
    assumptions: [],
    proposalInputs: {
      projectShape,
      targetEvidence,
      unresolvedDecisions,
      deferredDecisions,
    },
  };
}

function deriveApplication(projectType) {
  const normalized = projectType.toLowerCase();
  const knownTypes = [
    ["mobile", "mobile application"],
    ["web", "web application"],
    ["browser", "web application"],
    ["cli", "CLI application"],
    ["command-line", "CLI application"],
    ["backend", "backend/service"],
    ["service", "backend/service"],
    ["library", "library"],
    ["workspace", "workspace"],
  ];

  const match = knownTypes.find(([token]) => normalized.includes(token));
  if (match) {
    return establishedShape(match[1], "explicit-requirement", "projectType");
  }

  if (projectType) {
    return establishedShape(projectType, "explicit-requirement", "projectType");
  }

  return unresolvedShape(
    "application",
    "Application type is not established by the current requirements.",
    true,
  );
}

function derivePlatform(projectType) {
  const normalized = projectType.toLowerCase();
  const platforms = [
    ["mobile", "mobile"],
    ["web", "web"],
    ["browser", "web"],
    ["desktop", "desktop"],
    ["cli", "command-line"],
    ["command-line", "command-line"],
    ["backend", "server"],
    ["service", "server"],
  ];
  const match = platforms.find(([token]) => normalized.includes(token));

  if (!match) {
    return unresolvedShape(
      "platform",
      "Target platform is not established by the current project type.",
      true,
    );
  }

  return establishedShape(match[1], "derived-from-requirement", "projectType");
}

function deriveTechnology(projectType, targetEvidence) {
  const requirementMatch = TECHNOLOGY_DIRECTIONS.find(({ match }) =>
    match.test(projectType),
  );

  if (requirementMatch) {
    return establishedShape(
      requirementMatch.technology,
      "derived-from-requirement",
      "projectType",
    );
  }

  if (targetEvidence.packageTechnology) {
    return establishedShape(
      targetEvidence.packageTechnology,
      "target-evidence",
      targetEvidence.packageEvidence,
    );
  }

  return unresolvedShape(
    "technology",
    "Technology direction is not established by explicit requirements or target evidence.",
    true,
  );
}

function deriveRuntime(projectType, targetEvidence) {
  const requirementMatch = TECHNOLOGY_DIRECTIONS.find(({ match }) =>
    match.test(projectType),
  );

  if (requirementMatch) {
    return establishedShape(
      requirementMatch.runtime,
      "derived-from-requirement",
      "projectType",
    );
  }

  if (targetEvidence.packageRuntime) {
    return establishedShape(
      targetEvidence.packageRuntime,
      "target-evidence",
      targetEvidence.packageEvidence,
    );
  }

  return unresolvedShape(
    "runtime",
    "Runtime direction is not established by explicit requirements or target evidence.",
    false,
  );
}

function deriveSourceOrganization(targetEvidence) {
  if (targetEvidence.sourceDirectory) {
    return establishedShape(
      `Existing ${targetEvidence.sourceDirectory} source boundary detected`,
      "target-evidence",
      `target directory: ${targetEvidence.sourceDirectory}`,
    );
  }

  return unresolvedShape(
    "sourceOrganization",
    "Source/module organization is not established; exact directories must not be invented.",
    false,
  );
}

function deriveDependencies(targetEvidence) {
  if (targetEvidence.packageManifest) {
    return establishedShape(
      "Existing package manifest is present",
      "target-evidence",
      targetEvidence.packageEvidence,
    );
  }

  return unresolvedShape(
    "dependencies",
    "Dependency direction is not established by the current requirements or target evidence.",
    false,
  );
}

function deriveExpectation(explicitRequirements, key, unresolvedReason) {
  const requirement = explicitRequirements.get(key);
  if (requirement?.value) {
    return establishedShape(requirement.value, "explicit-requirement", key);
  }

  return unresolvedShape(key, unresolvedReason, false);
}

function inspectTargetEvidence(context) {
  const targetPath = context?.targetPath;
  if (!targetPath || context?.target?.exists !== true || context.target.kind !== "directory") {
    return {};
  }

  let entries;
  try {
    entries = fs.readdirSync(targetPath, { withFileTypes: true });
  } catch {
    return {};
  }

  const sourceDirectory = entries.find(
    (entry) =>
      entry.isDirectory() &&
      ["src", "app", "lib", "server", "client"].includes(entry.name.toLowerCase()),
  );
  const packageEntry = entries.find(
    (entry) => entry.isFile() && entry.name.toLowerCase() === "package.json",
  );

  const evidence = {
    sourceDirectory: sourceDirectory?.name || null,
    packageManifest: Boolean(packageEntry),
  };

  if (packageEntry) {
    const packagePath = path.join(targetPath, packageEntry.name);
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
      const dependencyNames = [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {}),
      ];
      const dependencyText = dependencyNames.join(" ");
      const packageMatch = TECHNOLOGY_DIRECTIONS.find(({ match }) =>
        match.test(dependencyText),
      );
      if (packageMatch) {
        evidence.packageTechnology = packageMatch.technology;
        evidence.packageRuntime = packageMatch.runtime;
      }
      evidence.packageEvidence = "target package.json";
    } catch {
      evidence.packageEvidence = "target package.json could not be parsed";
    }
  }

  return evidence;
}

function establishedShape(value, source, evidence) {
  return {
    status: "established",
    value,
    source,
    evidence,
  };
}

function unresolvedShape(key, reason, blocking) {
  return {
    key,
    status: "unresolved",
    value: null,
    source: "unresolved",
    reason,
    blocking,
  };
}

module.exports = {
  analyzeCreateProjectShape,
};
