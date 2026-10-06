"use strict";

const { CLASSIFICATIONS } = require("./context-resolution");
const { analyzeCreateContext } = require("./create-analysis");
const { analyzeAdoptContext } = require("./adopt-analysis");
const { reconcileAdoptObjective } = require("./adopt-requirement");
const { generateAdoptProposal } = require("./adopt-proposal");
const { deriveAdoptActions } = require("./adopt-action-derivation");
const { generateCreateProposal } = require("./create-proposal");
const {
  CHANGE_STATUSES,
  captureProposalBaseline,
  detectProposalChanges,
} = require("./change-detection");
const {
  deriveApprovedScope,
  revalidateApprovedScope: revalidateScope,
} = require("./approved-scope");
const { executeApprovedAdoptScope } = require("./adopt-execution");
const { executeApprovedCreateScope } = require("./create-execution");
const { validateAdoptExecution } = require("./adopt-validation");
const { validateCreateExecution } = require("./create-validation");

const CREATE_WORKFLOW = CLASSIFICATIONS.CREATE;

const ROUTING_STATUSES = Object.freeze({
  ROUTED: "ROUTED",
  UNRESOLVED: "UNRESOLVED",
});

const PROPOSAL_STATUSES = Object.freeze({
  PROPOSED: "PROPOSED",
  UNRESOLVED: "UNRESOLVED",
});

const PERMISSION_STATUSES = Object.freeze({
  AUTHORIZED: "AUTHORIZED",
  REJECTED: "REJECTED",
  UNRESOLVED: "UNRESOLVED",
});

const EXECUTION_STATUSES = Object.freeze({
  NOT_STARTED: "NOT_STARTED",
  BLOCKED: "BLOCKED",
  FAILED: "FAILED",
  COMPLETED: "COMPLETED",
});

const VALIDATION_STATUSES = Object.freeze({
  NOT_RUN: "NOT_RUN",
  PASSED: "PASSED",
  FAILED: "FAILED",
});

const TERMINAL_STATUSES = Object.freeze({
  SUCCESS: "SUCCESS",
  EXECUTION_FAILED: "EXECUTION_FAILED",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  REJECTED: "REJECTED",
  UNRESOLVED: "UNRESOLVED",
});

const DEFERRED_ACTIONS = Object.freeze([
  "workflow execution",
  "filesystem mutation",
  "project modification",
  "dependency installation",
  "Git state changes",
  "workflow validation",
]);

function routeContext(contextResult) {
  if (!contextResult || typeof contextResult !== "object") {
    throw new TypeError("Workflow Controller requires a Core context result.");
  }

  const { classification } = contextResult;
  if (!Object.values(CLASSIFICATIONS).includes(classification)) {
    throw new TypeError(
      "Workflow Controller received an invalid Core context classification.",
    );
  }

  const unresolved = classification === CLASSIFICATIONS.AMBIGUOUS;

  return {
    type: "WORKFLOW_ROUTE",
    classification,
    route: unresolved ? "CONTEXT_RESOLUTION" : classification,
    routingStatus: unresolved
      ? ROUTING_STATUSES.UNRESOLVED
      : ROUTING_STATUSES.ROUTED,
    context: contextResult,
  };
}

function prepareWorkflow(routingResult) {
  validateRoutingResult(routingResult);

  if (routingResult.classification === CLASSIFICATIONS.CREATE) {
    return analyzeCreateContext(routingResult.context);
  }

  if (routingResult.classification === CLASSIFICATIONS.ADOPT) {
    return analyzeAdoptContext(routingResult.context);
  }

  return routingResult;
}

function prepareAdoptRequirements(analysisResult) {
  return reconcileAdoptObjective(analysisResult);
}

function deriveAdoptProposalActions(proposalResult) {
  return deriveAdoptActions(proposalResult);
}

function prepareAdoptScope(actionResult) {
  if (!actionResult || actionResult.type !== "ADOPT_ACTION_RESULT") {
    throw new TypeError("ADOPT scope preparation requires an ADOPT action result.");
  }

  const proposal = actionResult.proposal;
  const baselineResult = captureProposalBaseline(proposal);
  const changeDetectionResult = detectProposalChanges(baselineResult, proposal);
  const boundedScopeReady =
    actionResult.status === "DERIVED" &&
    proposal?.status === "READY" &&
    baselineResult.status === "CAPTURED" &&
    changeDetectionResult.status === CHANGE_STATUSES.NO_CHANGE;
  const permissionProposal = boundedScopeReady
    ? {
        type: "PROPOSAL_RESULT",
        status: PROPOSAL_STATUSES.PROPOSED,
        permissionRequired: true,
        proposal,
        context: proposal.context,
        analysis: actionResult,
        adoptScopeReady: true,
        reason: null,
      }
    : null;
  const approvedScope = deriveApprovedScope({
    permissionResult: null,
    proposal,
    baselineResult,
    changeDetectionResult,
  });

  return {
    type: "ADOPT_SCOPE_RESULT",
    workflow: "ADOPT",
    proposal,
    actionResult,
    baselineResult,
    changeDetectionResult,
    approvedScope,
    permissionProposal,
    permissionRequired: Boolean(permissionProposal),
    executionDeferred: true,
    reason: boundedScopeReady
      ? "ADOPT Permission is required for the bounded reviewed scope."
      : "ADOPT Permission is unavailable until the bounded scope is valid.",
  };
}

function resolveAdoptPermission(scopeResult, response) {
  const permissionResult = resolvePermission(
    scopeResult?.permissionProposal || {
      type: "PROPOSAL_RESULT",
      status: PROPOSAL_STATUSES.UNRESOLVED,
      permissionRequired: false,
      proposal: scopeResult?.proposal || null,
      context: scopeResult?.proposal?.context || null,
      adoptScopeReady: false,
    },
    response,
  );

  if (!scopeResult?.permissionRequired) {
    return {
      ...permissionResult,
      approvedScope: scopeResult?.approvedScope || null,
      baselineResult: scopeResult?.baselineResult || null,
      changeDetectionResult: scopeResult?.changeDetectionResult || null,
    };
  }

  const approvedScope = deriveApprovedScope({
    permissionResult,
    proposal: scopeResult.proposal,
    baselineResult: scopeResult.baselineResult,
    changeDetectionResult: scopeResult.changeDetectionResult,
  });

  return {
    ...permissionResult,
    approvedScope,
    baselineResult: scopeResult.baselineResult,
    changeDetectionResult: scopeResult.changeDetectionResult,
  };
}

function createProposal(workflowResult) {
  if (workflowResult?.type === "CREATE_ANALYSIS_RESULT") {
    return createProposalFromAnalysis(workflowResult);
  }

  if (workflowResult?.type === "ADOPT_REQUIREMENT_RESULT") {
    const proposal = generateAdoptProposal(workflowResult);
    return {
      type: "PROPOSAL_RESULT",
      status: proposal.status,
      permissionRequired: false,
      proposal,
      context: workflowResult.context,
      analysis: workflowResult,
      reason: null,
    };
  }

  if (workflowResult?.type === "ADOPT_ANALYSIS_RESULT") {
    return {
      type: "PROPOSAL_RESULT",
      status: PROPOSAL_STATUSES.UNRESOLVED,
      permissionRequired: false,
      proposal: null,
      context: workflowResult.context,
      analysis: workflowResult,
      reason: "ADOPT requirement reconciliation is required before proposal generation.",
    };
  }

  validateRoutingResult(workflowResult);

  if (
    workflowResult.routingStatus !== ROUTING_STATUSES.ROUTED ||
    workflowResult.classification === CLASSIFICATIONS.AMBIGUOUS
  ) {
    return {
      type: "PROPOSAL_RESULT",
      status: PROPOSAL_STATUSES.UNRESOLVED,
      permissionRequired: false,
      proposal: null,
      context: workflowResult.context,
      reason: "Workflow context remains unresolved; no proposal was generated.",
    };
  }

  const workflow = workflowResult.classification;
  const context = workflowResult.context;
  const intendedAction =
    workflow === CLASSIFICATIONS.CREATE
      ? "Perform the CREATE workflow analysis for the bounded target in a later phase."
      : "Perform preservation-first ADOPT workflow analysis for the bounded target in a later phase.";

  const proposal = Object.freeze({
    type: "WORKFLOW_PROPOSAL",
    version: 1,
    workflow,
    targetPath: context.targetPath,
    context,
    scope: Object.freeze({
      type: "WORKFLOW_BOUNDARY",
      workflow,
      targetPath: context.targetPath,
    }),
    intendedActions: Object.freeze([intendedAction]),
    excludedActions: DEFERRED_ACTIONS,
    executionDeferred: true,
    reviewRequired: true,
  });

  return {
    type: "PROPOSAL_RESULT",
    status: PROPOSAL_STATUSES.PROPOSED,
    permissionRequired: true,
    proposal,
    context,
    reason: null,
  };
}

function createProposalFromAnalysis(analysisResult) {
  if (!analysisResult.sufficientForProposal) {
    return {
      type: "PROPOSAL_RESULT",
      status: PROPOSAL_STATUSES.UNRESOLVED,
      permissionRequired: false,
      proposal: null,
      context: analysisResult.context,
      analysis: analysisResult,
      reason:
        "CREATE analysis has unresolved requirements or project-shape decisions; no proposal was generated.",
    };
  }

  const proposal = generateCreateProposal(analysisResult);
  const permissionRequired = proposal.actions.some(
    (action) => !["KEEP", "REVIEW"].includes(action.type),
  );

  return {
    type: "PROPOSAL_RESULT",
    status: PROPOSAL_STATUSES.PROPOSED,
    permissionRequired,
    proposal,
    context: analysisResult.context,
    analysis: analysisResult,
    reason: permissionRequired
      ? null
      : "CREATE proposal contains review-only actions; permission was not requested.",
  };
}

function resolvePermission(proposalResult, response) {
  const proposal = proposalResult?.proposal ?? null;
  const context = proposalResult?.context ?? proposal?.context ?? null;

  if (
    !proposalResult ||
    proposalResult.status !== PROPOSAL_STATUSES.PROPOSED ||
    !proposal ||
    (proposal.workflow === "ADOPT" && proposalResult.adoptScopeReady !== true)
  ) {
    return createPermissionResult({
      status: PERMISSION_STATUSES.UNRESOLVED,
      response,
      proposal,
      context,
      reason:
        proposal?.workflow === "ADOPT"
          ? "ADOPT Permission requires completed review and Change Detection for the bounded scope."
          : "Permission cannot be requested without a resolved proposal.",
    });
  }

  const normalizedResponse = normalizePermissionResponse(response);
  let status;
  let reason = null;

  if (normalizedResponse === "y" || normalizedResponse === "yes") {
    status = PERMISSION_STATUSES.AUTHORIZED;
  } else if (normalizedResponse === "n" || normalizedResponse === "no") {
    status = PERMISSION_STATUSES.REJECTED;
  } else {
    status = PERMISSION_STATUSES.UNRESOLVED;
    reason = "Permission requires y/yes or n/no; no authorization was inferred.";
  }

  return createPermissionResult({
    status,
    response,
    proposal,
    context,
    reason,
  });
}

function createPermissionResult({
  status,
  response,
  proposal,
  context,
  reason,
}) {
  return {
    type: "PERMISSION_RESULT",
    status,
    response: typeof response === "string" ? response.trim() : null,
    proposal,
    context,
    executionDeferred: true,
    nextPhase: "10.5",
    reason,
  };
}

function normalizePermissionResponse(response) {
  return typeof response === "string" ? response.trim().toLowerCase() : null;
}

function prepareApprovedScope(permissionResult) {
  if (permissionResult?.status !== PERMISSION_STATUSES.AUTHORIZED) {
    return {
      baselineResult: null,
      changeDetectionResult: {
        type: "CHANGE_DETECTION_RESULT",
        status: "NOT_RUN",
        baseline: null,
        currentState: null,
        changedPaths: [],
        reason: "Change Detection requires valid authorization.",
      },
      approvedScope: deriveApprovedScope({ permissionResult }),
    };
  }

  const proposal = permissionResult.proposal;
  const baselineResult = captureProposalBaseline(proposal);
  const changeDetectionResult = detectProposalChanges(baselineResult, proposal);
  const approvedScope = deriveApprovedScope({
    permissionResult,
    proposal,
    baselineResult,
    changeDetectionResult,
  });

  return {
    baselineResult,
    changeDetectionResult,
    approvedScope,
  };
}

function revalidateApprovedScope(approvedScope, context) {
  return revalidateScope(approvedScope, context);
}

function processPermissionResult(permissionResult) {
  const scopeResult = prepareApprovedScope(permissionResult);
  return processApprovedScope(
    permissionResult,
    scopeResult.approvedScope,
    scopeResult,
  );
}

function processApprovedScope(permissionResult, approvedScope, scopeResult = {}) {
  if (isAdoptScope(approvedScope, permissionResult)) {
    return processApprovedAdoptScope(permissionResult, approvedScope, scopeResult);
  }

  let executionResult;

  try {
    executionResult = executeApprovedScope(approvedScope);
  } catch (error) {
    executionResult = createExecutionFailure(
      permissionResult,
      approvedScope,
      error,
    );
  }

  let validationResult;
  try {
    validationResult = validateCreateExecution(executionResult);
  } catch (error) {
    validationResult = createValidationFailure(executionResult, error);
  }

  const terminalResult = createTerminalResult({
    permissionResult,
    executionScope: approvedScope,
    executionResult,
    validationResult,
  });

  return {
    ...scopeResult,
    executionScope: approvedScope,
    executionResult,
    validationResult,
    terminalResult,
  };
}

function processApprovedAdoptScope(
  permissionResult,
  approvedScope,
  scopeResult = {},
) {
  let executionResult;

  try {
    executionResult = executeApprovedAdoptScope(approvedScope);
  } catch (error) {
    executionResult = createExecutionFailure(
      permissionResult,
      approvedScope,
      error,
    );
  }

  let validationResult;
  try {
    validationResult = validateAdoptExecution(
      executionResult,
      scopeResult.baselineResult,
    );
  } catch (error) {
    validationResult = createValidationFailure(executionResult, error);
  }
  const terminalResult = createTerminalResult({
    permissionResult,
    executionScope: approvedScope,
    executionResult,
    validationResult,
  });

  return {
    ...scopeResult,
    executionScope: approvedScope,
    executionResult,
    validationResult,
    terminalResult,
  };
}

function executeApprovedScope(approvedScope) {
  return isAdoptScope(approvedScope)
    ? executeApprovedAdoptScope(approvedScope)
    : executeApprovedCreateScope(approvedScope);
}

function isAdoptScope(scope, permissionResult = null) {
  return (
    scope?.workflow === "ADOPT" ||
    scope?.proposal?.workflow === "ADOPT" ||
    permissionResult?.proposal?.workflow === "ADOPT"
  );
}

function validateApprovedExecution(executionResult, baselineResult = null) {
  return executionResult?.workflow === "ADOPT" ||
    executionResult?.executionScope?.workflow === "ADOPT"
    ? validateAdoptExecution(executionResult, baselineResult)
    : validateCreateExecution(executionResult);
}

function createExecutionScope(permissionResult) {
  const proposal = permissionResult?.proposal ?? null;
  const context = permissionResult?.context ?? proposal?.context ?? null;
  const workflow = proposal?.workflow ?? context?.classification ?? null;
  const targetPath = proposal?.targetPath ?? context?.targetPath ?? null;
  const actions = Array.isArray(proposal?.executionActions)
    ? proposal.executionActions
    : [];
  const reason =
    actions.length === 0
      ? "No concrete CREATE/ADOPT execution actions were established by the authorized proposal."
      : "Phase 10.5 has no execution handler for the supplied workflow actions.";

  return {
    type: "EXECUTION_SCOPE",
    workflow,
    targetPath,
    proposal,
    permission: permissionResult,
    actions,
    status: "UNRESOLVED",
    reason,
  };
}

function executeAuthorized(permissionResult, executionScope) {
  const workflow =
    executionScope?.workflow ?? permissionResult?.proposal?.workflow ?? null;
  const targetPath =
    executionScope?.targetPath ?? permissionResult?.proposal?.targetPath ?? null;

  if (permissionResult?.status !== PERMISSION_STATUSES.AUTHORIZED) {
    return {
      type: "EXECUTION_RESULT",
      status: EXECUTION_STATUSES.NOT_STARTED,
      workflow,
      targetPath,
      executionScope,
      changedPaths: [],
      executionStarted: false,
      executionCompleted: false,
      error: "Execution requires an AUTHORIZED permission result.",
    };
  }

  if (
    !executionScope ||
    executionScope.permission !== permissionResult ||
    executionScope.proposal !== permissionResult.proposal
  ) {
    return {
      type: "EXECUTION_RESULT",
      status: EXECUTION_STATUSES.BLOCKED,
      workflow,
      targetPath,
      executionScope,
      changedPaths: [],
      executionStarted: false,
      executionCompleted: false,
      error: "Execution scope does not match the authorized proposal and permission result.",
    };
  }

  return {
    type: "EXECUTION_RESULT",
    status: EXECUTION_STATUSES.BLOCKED,
    workflow,
    targetPath,
    executionScope,
    changedPaths: [],
    executionStarted: false,
    executionCompleted: false,
    error:
      executionScope?.reason ||
      "Concrete execution scope could not be established.",
  };
}

function createExecutionFailure(permissionResult, executionScope, error) {
  const proposal = permissionResult?.proposal ?? executionScope?.proposal ?? null;

  return {
    type: "EXECUTION_RESULT",
    status: EXECUTION_STATUSES.FAILED,
    workflow: proposal?.workflow ?? executionScope?.workflow ?? null,
    targetPath: proposal?.targetPath ?? executionScope?.targetPath ?? null,
    executionScope,
    changedPaths: [],
    executionStarted: true,
    executionCompleted: false,
    error: normalizeError(error),
  };
}

function createValidationFailure(executionResult, error) {
  return {
    type: "VALIDATION_RESULT",
    status: VALIDATION_STATUSES.FAILED,
    executionResult,
    checkedPaths: [],
    error: normalizeError(error),
  };
}

function validateExecution(executionResult) {
  if (!executionResult || executionResult.status !== EXECUTION_STATUSES.COMPLETED) {
    return {
      type: "VALIDATION_RESULT",
      status: VALIDATION_STATUSES.NOT_RUN,
      executionResult,
      checkedPaths: [],
      error: "Validation did not run because execution did not complete.",
    };
  }

  if (!executionResult.executionStarted || !executionResult.executionCompleted) {
    return {
      type: "VALIDATION_RESULT",
      status: VALIDATION_STATUSES.FAILED,
      executionResult,
      checkedPaths: [],
      error: "Execution reported completion without a complete execution record.",
    };
  }

  return {
    type: "VALIDATION_RESULT",
    status: VALIDATION_STATUSES.PASSED,
    executionResult,
    checkedPaths: [...executionResult.changedPaths],
    error: null,
  };
}

function createTerminalResult({
  permissionResult,
  executionScope,
  executionResult,
  validationResult,
}) {
  let status;
  let reason = null;

  if (permissionResult?.status === PERMISSION_STATUSES.REJECTED) {
    status = TERMINAL_STATUSES.REJECTED;
    reason = "Permission was rejected; execution did not start.";
  } else if (permissionResult?.status !== PERMISSION_STATUSES.AUTHORIZED) {
    status = TERMINAL_STATUSES.UNRESOLVED;
    reason = "Permission was unresolved; execution did not start.";
  } else if (executionResult?.status === EXECUTION_STATUSES.FAILED) {
    status = TERMINAL_STATUSES.EXECUTION_FAILED;
    reason = executionResult.error;
  } else if (validationResult?.status === VALIDATION_STATUSES.FAILED) {
    status = TERMINAL_STATUSES.VALIDATION_FAILED;
    reason = validationResult.error;
  } else if (
    executionResult?.status === EXECUTION_STATUSES.COMPLETED &&
    validationResult?.status === VALIDATION_STATUSES.PASSED
  ) {
    status = TERMINAL_STATUSES.SUCCESS;
  } else {
    status = TERMINAL_STATUSES.UNRESOLVED;
    reason =
      executionResult?.error ||
      validationResult?.error ||
      "Execution and validation did not establish a terminal success result.";
  }

  return {
    type: "TERMINAL_RESULT",
    status,
    workflow:
      permissionResult?.proposal?.workflow ?? executionScope?.workflow ?? null,
    targetPath:
      permissionResult?.proposal?.targetPath ?? executionScope?.targetPath ?? null,
    permissionResult,
    executionScope,
    executionResult,
    validationResult,
    stopped: true,
    reason,
  };
}

function normalizeError(error) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unspecified execution or validation error occurred.";
}

function validateRoutingResult(routingResult) {
  if (!routingResult || typeof routingResult !== "object") {
    throw new TypeError("Workflow Controller requires a routing result.");
  }

  if (!Object.values(CLASSIFICATIONS).includes(routingResult.classification)) {
    throw new TypeError("Workflow Controller received an invalid route classification.");
  }

  if (!routingResult.context || typeof routingResult.context !== "object") {
    throw new TypeError("Workflow Controller requires the preserved context result.");
  }
}

const workflowController = Object.freeze({
  routeContext,
  prepareWorkflow,
  prepareAdoptRequirements,
  deriveAdoptProposalActions,
  prepareAdoptScope,
  resolveAdoptPermission,
  createProposal,
  resolvePermission,
  processPermissionResult,
  createExecutionFailure,
  createExecutionScope,
  executeAuthorized,
  createValidationFailure,
  validateExecution,
  createTerminalResult,
  prepareApprovedScope,
  revalidateApprovedScope,
  processApprovedScope,
  processApprovedAdoptScope,
  executeApprovedScope,
  executeApprovedAdoptScope,
  validateAdoptExecution,
  validateApprovedExecution,
});

module.exports = {
  EXECUTION_STATUSES,
  PERMISSION_STATUSES,
  PROPOSAL_STATUSES,
  ROUTING_STATUSES,
  TERMINAL_STATUSES,
  VALIDATION_STATUSES,
  createExecutionFailure,
  createExecutionScope,
  createProposal,
  prepareWorkflow,
  prepareAdoptRequirements,
  deriveAdoptProposalActions,
  prepareAdoptScope,
  resolveAdoptPermission,
  createTerminalResult,
  createValidationFailure,
  executeAuthorized,
  prepareApprovedScope,
  processPermissionResult,
  processApprovedScope,
  processApprovedAdoptScope,
  executeApprovedScope,
  executeApprovedAdoptScope,
  validateAdoptExecution,
  validateApprovedExecution,
  revalidateApprovedScope,
  resolvePermission,
  routeContext,
  validateExecution,
  workflowController,
};
