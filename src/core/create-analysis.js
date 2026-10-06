"use strict";

const { analyzeCreateProjectShape } = require("./create-project-shape");

const CREATE_WORKFLOW = "CREATE";

const REQUIRED_INPUTS = Object.freeze([
  {
    key: "projectPurpose",
    prompt: "Project purpose",
    reason: "The CREATE contract requires a project purpose before proposal preparation.",
  },
  {
    key: "projectType",
    prompt: "Project type (application, service, library, or workspace)",
    reason: "The CREATE contract requires the intended project shape to be understood.",
  },
  {
    key: "initialScope",
    prompt: "Initial functionality and scope",
    reason: "The CREATE contract requires an initial scope and explicit boundaries.",
  },
]);

function analyzeCreateContext(context) {
  if (!context || context.classification !== CREATE_WORKFLOW) {
    return {
      type: "CREATE_ANALYSIS_RESULT",
      workflow: CREATE_WORKFLOW,
      context: context || null,
      resolvedDecisions: context?.resolvedDecisions || null,
      sufficientForProposal: false,
      requiredInputs: REQUIRED_INPUTS,
      evidence: [],
      requirements: emptyRequirements(),
      projectShape: {},
      projectShapeAnalysis: null,
      proposalInputs: null,
      assumptions: [],
      unresolvedDecisions: [
        {
          key: "createContext",
          reason: "CREATE analysis requires a resolved CREATE context.",
        },
      ],
      deferredDecisions: [],
      candidateActions: [],
      risks: ["CREATE analysis cannot continue without a resolved CREATE context."],
      validationExpectations: {
        ready: false,
        reason: "Validation expectations require a concrete proposal.",
      },
    };
  }

  const target = context.target || {};
  const targetEvidence = context.targetEvidence || {};
  const collected = context.createRequirements || {};
  const evidence = Array.isArray(context.evidence) ? [...context.evidence] : [];
  const projectCharacteristics = {
    targetPath: context.targetPath,
    exists: target.exists ?? null,
    kind: target.kind ?? null,
    readable: target.readable ?? null,
    empty: target.empty ?? null,
    metadataOnly: target.metadataOnly ?? null,
    meaningfulProject: target.meaningfulProject ?? null,
    meaningfulSignals: Array.isArray(targetEvidence.meaningfulSignals)
      ? [...targetEvidence.meaningfulSignals]
      : [],
  };

  const explicitRequirements = [];
  if (context.userIntent) {
    explicitRequirements.push({
      key: "initialUserIntent",
      value: context.userIntent,
      source: "CLI workflow input",
      note: "This selects CREATE; it is not a complete project specification.",
    });
  }

  for (const input of REQUIRED_INPUTS) {
    const value = collected[input.key];
    if (value) {
      explicitRequirements.push({
        key: input.key,
        value,
        source: "CLI CREATE requirement input",
      });
    }
  }

  const evidenceDerivedRequirements = [
    {
      key: "targetBoundary",
      value: context.targetPath,
      source: "Core context resolution",
    },
    {
      key: "targetState",
      value: projectCharacteristics,
      source: "Core context evidence",
    },
  ];

  const constraints = [
    {
      key: "analysisMode",
      value: "read-only",
      source: "KHWAMI_CREATE.md",
    },
    {
      key: "execution",
      value: "deferred until proposal, Change Detection, Permission, and Approved Scope",
      source: "KHWAMI_OPERATING_CONTRACT.md",
    },
  ];

  const missingRequirements = REQUIRED_INPUTS.filter(
    (input) => !collected[input.key],
  ).map((input) => ({
    key: input.key,
    prompt: input.prompt,
    reason: input.reason,
  }));
  const requirements = {
    explicit: explicitRequirements,
    evidenceDerived: evidenceDerivedRequirements,
    constraints,
    assumptions: [],
    missing: missingRequirements,
  };

  const projectShapeAnalysis = analyzeCreateProjectShape(context, requirements);
  const unresolvedDecisions = [
    ...missingRequirements,
    ...projectShapeAnalysis.unresolvedDecisions,
  ];
  const sufficientForProposal =
    missingRequirements.length === 0 &&
    projectShapeAnalysis.blockingDecisions.length === 0;
  const deferredDecisions = missingRequirements.length === 0
    ? projectShapeAnalysis.deferredDecisions
    : [];
  const candidateActions = deferredDecisions.map((decision) => ({
    action: "REVIEW",
    key: decision.key,
    summary: decision.reason,
    supportingEvidence: decision.supportingEvidence,
  }));

  return {
    type: "CREATE_ANALYSIS_RESULT",
    workflow: CREATE_WORKFLOW,
    context,
    resolvedDecisions: context.resolvedDecisions || null,
    target: {
      path: context.targetPath,
      characteristics: projectCharacteristics,
    },
    evidence,
    requiredInputs: REQUIRED_INPUTS,
    requirements,
    projectShape: projectShapeAnalysis.projectShape,
    projectShapeAnalysis,
    proposalInputs: {
      requirements,
      projectShape: projectShapeAnalysis.projectShape,
      evidence,
      unresolvedDecisions,
      candidateActions,
    },
    projectCharacteristics,
    assumptions: projectShapeAnalysis.assumptions,
    unresolvedDecisions,
    deferredDecisions,
    candidateActions,
    risks: sufficientForProposal
      ? [
          "Concrete project actions are not inferred from project shape alone; proposal preparation must resolve actions without inventing defaults.",
        ]
      : [
          "Concrete proposal preparation is blocked by unresolved requirements or project-shape decisions.",
        ],
    validationExpectations: {
      ready: false,
      reason: "Validation expectations depend on concrete proposal actions.",
    },
    sufficientForProposal,
  };
}

function emptyRequirements() {
  return {
    explicit: [],
    evidenceDerived: [],
    constraints: [],
    assumptions: [],
    missing: [],
  };
}

module.exports = {
  REQUIRED_INPUTS,
  analyzeCreateContext,
};
