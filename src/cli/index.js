#!/usr/bin/env node
"use strict";

const readline = require("node:readline");
const { initializeCore } = require("../core/bootstrap");

async function main() {
  let input;

  try {
    input = parseArguments(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
    return;
  }

  const core = initializeCore();
  process.stdout.write("KHWAMI CLI initialized.\n");

  let context = core.initializeContext(input);
  let routingResult = core.workflowController.routeContext(context);
  renderContext(context);
  renderControllerResult(routingResult);

  if (context.clarificationRequired) {
    const clarificationResponse = await requestInput("Context selection: ");
    context = core.resolveClarification(context, clarificationResponse);
    routingResult = core.workflowController.routeContext(context);
    renderContext(context);
    renderControllerResult(routingResult);
  }

  let workflowResult = core.workflowController.prepareWorkflow(routingResult);

  if (
    workflowResult.type === "CREATE_ANALYSIS_RESULT" &&
    !workflowResult.sufficientForProposal
  ) {
    const collectedRequirements = await collectCreateRequirements(
      workflowResult,
      context.createRequirements,
    );

    if (requirementsChanged(context.createRequirements, collectedRequirements)) {
      context = core.initializeContext({
        userIntent: context.userIntent,
        targetPath: context.targetPath,
        createRequirements: collectedRequirements,
      });
      routingResult = core.workflowController.routeContext(context);
      workflowResult = core.workflowController.prepareWorkflow(routingResult);
    }
  }

  if (workflowResult.type === "ADOPT_ANALYSIS_RESULT") {
    workflowResult = core.workflowController.prepareAdoptRequirements(workflowResult);
  }

  renderWorkflowAnalysis(workflowResult);

  let proposalResult = core.workflowController.createProposal(workflowResult);
  renderProposalResult(proposalResult);

  if (proposalResult.proposal?.type === "ADOPT_PROPOSAL") {
    const adoptActionResult = core.workflowController.deriveAdoptProposalActions(
      proposalResult,
    );
    renderAdoptActionResult(adoptActionResult);
    const adoptScopeResult = core.workflowController.prepareAdoptScope(adoptActionResult);
    renderAdoptScopeResult(adoptScopeResult);

    if (adoptScopeResult.permissionRequired) {
      const permissionResponse = await requestInput("Permission (y/yes/n/no): ");
      const permissionResult = core.workflowController.resolveAdoptPermission(
        adoptScopeResult,
        permissionResponse,
      );
      renderPermissionResult(permissionResult);
      renderApprovedScopeResult(permissionResult.approvedScope);

      const adoptExecution = core.workflowController.processApprovedScope(
        permissionResult,
        permissionResult.approvedScope,
        adoptScopeResult,
      );
      renderExecutionResult(adoptExecution.executionResult);
      renderValidationResult(adoptExecution.validationResult);
      renderTerminalResult(adoptExecution.terminalResult);
    }

    return;
  }

  if (shouldCollectConcreteCreateAction(proposalResult, context)) {
    const resolvedDecisions = await collectConcreteCreateAction(
      proposalResult,
      context.resolvedDecisions,
    );

    if (JSON.stringify(resolvedDecisions) !== JSON.stringify(context.resolvedDecisions)) {
      context = core.initializeContext({
        userIntent: context.userIntent,
        targetPath: context.targetPath,
        createRequirements: context.createRequirements,
        resolvedDecisions,
      });
      routingResult = core.workflowController.routeContext(context);
      workflowResult = core.workflowController.prepareWorkflow(routingResult);
      renderWorkflowAnalysis(workflowResult);
      proposalResult = core.workflowController.createProposal(workflowResult);
      renderProposalResult(proposalResult);
    }
  }

  if (!proposalResult.permissionRequired) {
    return;
  }

  const permissionResponse = await requestInput("Permission (y/yes/n/no): ");
  const permissionResult = core.workflowController.resolvePermission(
    proposalResult,
    permissionResponse,
  );
  renderPermissionResult(permissionResult);

  const scopeResult = core.workflowController.prepareApprovedScope(
    permissionResult,
  );
  renderChangeDetectionResult(scopeResult.changeDetectionResult);
  renderApprovedScopeResult(scopeResult.approvedScope);

  const executionResult = core.workflowController.processApprovedScope(
    permissionResult,
    scopeResult.approvedScope,
    scopeResult,
  );
  renderExecutionResult(executionResult.executionResult);
  renderValidationResult(executionResult.validationResult);
  renderTerminalResult(executionResult.terminalResult);
}

function parseArguments(argumentsList) {
  const input = {};
  const optionNames = {
    "--intent": "userIntent",
    "--target": "targetPath",
    "--purpose": "projectPurpose",
    "--project-type": "projectType",
    "--scope": "initialScope",
    "--create-path": "createActionPath",
    "--create-content": "createActionContent",
    "--adopt-objective": "adoptObjective",
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    const inputName = optionNames[argument];

    if (!inputName) {
      throw new Error(
        `Unknown argument ${argument}. Supported arguments: --intent <create|adopt>, --target <path>, --purpose <text>, --project-type <type>, --scope <text>, --create-path <path>, --create-content <text>, --adopt-objective <text>.`,
      );
    }

    if (Object.hasOwn(input, inputName)) {
      throw new Error(`Argument ${argument} was provided more than once.`);
    }

    const value = argumentsList[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Argument ${argument} requires a value.`);
    }

    input[inputName] = value;
    index += 1;
  }

  return input;
}

function renderContext(context) {
  const lines = [
    "",
    "KHWAMI Context Detection",
    "",
    `Target: ${context.targetPath}`,
    `Detected Type: ${context.classification}`,
    "",
    "Evidence:",
    ...context.evidence.map((item) => `- ${item}`),
  ];

  if (context.unresolvedReasons.length > 0) {
    lines.push("", "Unresolved:");
    lines.push(...context.unresolvedReasons.map((item) => `- ${item}`));
  }

  if (context.clarification.status === "invalid") {
    lines.push("", "The clarification response was not recognized.");
  } else if (context.clarification.status === "unavailable") {
    lines.push("", "Clarification input was unavailable.");
  } else if (context.clarification.status === "exited") {
    lines.push("", "Context selection was exited. No workflow was selected.");
  }

  if (context.clarificationRequired) {
    lines.push(
      "",
      "The available evidence is insufficient to determine the workflow.",
      "Please choose:",
    );

    for (const option of context.clarificationOptions) {
      lines.push(`- [${option}] ${describeClarificationOption(option)}`);
    }
  }

  lines.push("", "No workflow was executed.", "");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderControllerResult(result) {
  const lines = [
    "",
    "Workflow Controller",
    `Classification: ${result.classification}`,
    `Route: ${result.route}`,
    `Routing status: ${result.routingStatus}`,
    "No workflow was executed.",
    "",
  ];

  process.stdout.write(lines.join("\n"));
}

async function collectCreateRequirements(analysis, currentRequirements = {}) {
  const collected = { ...currentRequirements };

  if (!process.stdin.isTTY) {
    return collected;
  }

  for (const input of analysis.requiredInputs || []) {
    if (collected[input.key]) {
      continue;
    }

    const response = await requestInput(`${input.prompt}: `);
    if (!response) {
      break;
    }

    collected[input.key] = response;
  }

  return collected;
}

function requirementsChanged(previous = {}, next = {}) {
  return ["projectPurpose", "projectType", "initialScope"].some(
    (key) => previous[key] !== next[key],
  );
}

function shouldCollectConcreteCreateAction(proposalResult) {
  return (
    process.stdin.isTTY &&
    proposalResult?.proposal?.workflow === "CREATE" &&
    proposalResult.proposal.readiness === "BLOCKED" &&
    proposalResult.proposal.unresolvedReviewItems.some(
      (item) => item.topic === "concreteActions",
    )
  );
}

async function collectConcreteCreateAction(proposalResult, currentDecisions) {
  const currentAction = currentDecisions?.concreteActions?.[0] || {};
  const pathValue = currentAction.path || await requestInput("Concrete CREATE file path: ");
  if (!pathValue) {
    return currentDecisions || null;
  }

  const contentValue = currentAction.content ?? await requestInput("Concrete CREATE file content: ");
  if (contentValue === null || contentValue === undefined || contentValue === "") {
    return currentDecisions || null;
  }

  return {
    concreteActions: [
      {
        type: "CREATE",
        path: pathValue,
        content: contentValue,
        source: "explicit-requirement",
        requirement: "resolved-create-action-input",
      },
    ],
  };
}

function renderWorkflowAnalysis(result) {
  if (result?.type === "ADOPT_ANALYSIS_RESULT") {
    renderAdoptAnalysis(result);
    return;
  }

  if (result?.type === "ADOPT_REQUIREMENT_RESULT") {
    renderAdoptRequirementResult(result);
    return;
  }

  if (result?.type !== "CREATE_ANALYSIS_RESULT") {
    return;
  }

  const lines = [
    "",
    "CREATE Analysis Result",
    `Sufficient for proposal: ${result.sufficientForProposal}`,
    "",
    "Evidence:",
    ...result.evidence.map((item) => `- ${item}`),
    "",
    "Project characteristics:",
    ...formatAnalysisItems(Object.entries(result.projectCharacteristics).map(([key, value]) => ({ key, value }))),
    "",
    "Project shape:",
    ...formatAnalysisItems(Object.entries(result.projectShape || {}).map(([key, value]) => ({ key, value }))),
    "",
    "Requirements:",
    ...formatAnalysisItems(result.requirements.explicit),
    ...formatAnalysisItems(result.requirements.evidenceDerived),
    ...formatAnalysisItems(result.requirements.constraints),
    "",
    "Unresolved decisions:",
    ...formatAnalysisItems(result.unresolvedDecisions),
    "",
    "Candidate actions:",
    ...formatAnalysisItems(result.candidateActions),
    "",
    "Risks:",
    ...formatAnalysisItems(result.risks.map((reason) => ({ reason }))),
    "",
  ];

  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderAdoptRequirementResult(result) {
  const lines = [
    "",
    "ADOPT Requirement Result",
    `Objective: ${result.adoptObjective.status}`,
    `Requirement reconciliation: ${result.requirementReconciliation.status}`,
    `Proposal readiness: ${result.proposalReadiness.sufficient}`,
    "",
    "Relevant existing areas:",
    ...formatAnalysisItems(result.requirementReconciliation.relevantExistingAreas),
    "",
    "Conflicts:",
    ...formatAnalysisItems(result.requirementReconciliation.conflicts),
    "",
    "Unresolved decisions:",
    ...formatAnalysisItems(result.unresolvedDecisions),
    "",
  ];

  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderAdoptAnalysis(result) {
  const lines = [
    "",
    "ADOPT Analysis Result",
    `Sufficient for proposal: ${result.sufficientForProposal}`,
    "",
    "Evidence:",
    ...formatAnalysisItems(result.evidence),
    "",
    "Project understanding:",
    `- ${JSON.stringify(result.projectUnderstanding)}`,
    "",
    "Preservation scope:",
    ...formatAnalysisItems(result.preservationScope),
    "",
    "Requirement reconciliation:",
    `- ${JSON.stringify(result.requirementReconciliation)}`,
    "",
    "Unresolved decisions:",
    ...formatAnalysisItems(result.unresolvedDecisions),
    "",
    "Candidate actions:",
    ...formatAnalysisItems(result.candidateActions),
    "",
    "No ADOPT proposal, permission, or execution was performed.",
    "",
  ];

  process.stdout.write(`${lines.join("\n")}\n`);
}

function formatAnalysisItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return ["- None identified"];
  }

  return items.map((item) => {
    if (typeof item === "string") {
      return `- ${item}`;
    }

    const key = item.key || item.action || item.summary || "item";
    const value = item.value ?? item.reason ?? item.description ?? item.path;
    return `- ${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`;
  });
}

function renderAdoptActionResult(result) {
  const lines = [
    "",
    "ADOPT Action Derivation",
    `Status: ${result.status}`,
    `Executable: ${result.executable === true}`,
    "",
    "Candidate actions:",
    ...formatAnalysisItems(result.candidateActions),
    "",
    "Unresolved decisions:",
    ...formatAnalysisItems(result.unresolvedDecisions),
    "",
    "No ADOPT actions were executed.",
    "",
  ];

  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderAdoptScopeResult(result) {
  const lines = [
    "",
    "ADOPT Change Detection + Approved Scope",
    `Baseline: ${result.baselineResult.status}`,
    `Change Detection: ${result.changeDetectionResult.status}`,
    `Approved Scope: ${result.approvedScope.status}`,
    `Reason: ${result.reason}`,
    "",
    "No ADOPT permission, execution, or validation was performed.",
    "",
  ];

  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderProposalResult(result) {
  const lines = ["", "Workflow Proposal", `Proposal status: ${result.status}`];

  if (!result.proposal) {
    lines.push(
      `Reason: ${result.reason}`,
      "No proposal was generated.",
      "No permission was requested.",
      "",
    );
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  const proposal = result.proposal;
  lines.push(
    `Workflow: ${proposal.workflow}`,
    `Target: ${proposal.targetPath}`,
    `Readiness: ${proposal.readiness || proposal.status || "REVIEW_REQUIRED"}`,
    `Executable: ${proposal.executable === true}`,
    "",
    `Summary: ${proposal.summary || proposal.objective?.value || "No summary provided."}`,
    "",
    "Actions:",
    ...formatAnalysisItems(proposal.actions || proposal.proposedChangeAreas),
    "",
    "Preserved scope:",
    ...formatAnalysisItems(proposal.preservedScope),
    "",
    "Risks:",
    ...formatAnalysisItems(proposal.risks),
    "",
    "Dependencies:",
    ...formatAnalysisItems(
      proposal.dependencies && typeof proposal.dependencies === "object"
        ? [proposal.dependencies]
        : proposal.dependencies,
    ),
    "",
    "Validation expectations:",
    ...formatAnalysisItems(
      proposal.validationExpectations && typeof proposal.validationExpectations === "object"
        ? [proposal.validationExpectations]
        : proposal.validationExpectations,
    ),
    "",
    "Unresolved review items:",
    ...formatAnalysisItems(proposal.unresolvedReviewItems),
    "",
    "Review the proposal above before permission is requested.",
    "Execution is deferred to Phase 10.5.",
    "",
  );

  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderPermissionResult(result) {
  const lines = ["", "Permission Result", `Status: ${result.status}`];

  if (result.nextPhase) {
    lines.push(`Next boundary: Phase ${result.nextPhase}`);
  }

  if (result.reason) {
    lines.push(`Reason: ${result.reason}`);
  }

  lines.push("");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderChangeDetectionResult(result) {
  const lines = ["", "Change Detection"];

  if (!result) {
    lines.push("Status: NOT_RUN", "Change Detection did not run.", "");
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  lines.push(`Status: ${result.status}`, `Changed paths: ${result.changedPaths.length}`);
  if (result.reason) {
    lines.push(`Reason: ${result.reason}`);
  }
  lines.push("");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderApprovedScopeResult(scope) {
  const lines = ["", "Approved Scope"];

  if (!scope) {
    lines.push("Status: NOT_ESTABLISHED", "No Approved Scope was created.", "");
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  lines.push(`Status: ${scope.status}`, `Actions: ${scope.actions.length}`);
  if (scope.reason) {
    lines.push(`Reason: ${scope.reason}`);
  }
  lines.push("");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderExecutionScope(scope) {
  const lines = ["", "Execution Scope"];

  if (!scope) {
    lines.push("Status: NOT_ESTABLISHED", "No execution scope was created.", "");
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  lines.push(
    `Status: ${scope.status}`,
    `Workflow: ${scope.workflow}`,
    `Target: ${scope.targetPath}`,
    `Actions: ${scope.actions.length}`,
  );

  if (scope.reason) {
    lines.push(`Reason: ${scope.reason}`);
  }

  lines.push("");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderExecutionResult(result) {
  const lines = ["", "Execution Result"];

  if (!result) {
    lines.push("Status: NOT_STARTED", "No execution result was created.", "");
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  lines.push(
    `Status: ${result.status}`,
    `Execution started: ${result.executionStarted}`,
    `Execution completed: ${result.executionCompleted}`,
    `Changed paths: ${result.changedPaths.length}`,
  );

  if (result.error) {
    lines.push(`Error: ${result.error}`);
  }

  lines.push("");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderValidationResult(result) {
  const lines = ["", "Validation Result"];

  if (!result) {
    lines.push("Status: NOT_RUN", "Validation was not started.", "");
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  lines.push(`Status: ${result.status}`, `Checked paths: ${result.checkedPaths.length}`);

  if (result.error) {
    lines.push(`Error: ${result.error}`);
  }

  lines.push("");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function renderTerminalResult(result) {
  const lines = ["", "Terminal Result", `Status: ${result.status}`, "Stopped: true"];

  if (result.reason) {
    lines.push(`Reason: ${result.reason}`);
  }

  lines.push("");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function describeClarificationOption(option) {
  if (option === "Create") {
    return "Treat as a new project";
  }

  if (option === "Adopt") {
    return "Treat as an existing project";
  }

  return "Exit without workflow selection";
}

async function requestInput(prompt) {
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }

    const response = chunks.join("").trim();
    return response || null;
  }

  const interfaceHandle = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    let settled = false;

    const finish = (response) => {
      if (settled) {
        return;
      }

      settled = true;
      interfaceHandle.close();
      resolve(response);
    };

    interfaceHandle.once("close", () => finish(null));
    interfaceHandle.question(prompt, (response) => finish(response));
  });
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
