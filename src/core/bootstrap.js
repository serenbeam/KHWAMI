"use strict";

const {
  initializeContext,
  resolveClarification,
} = require("./context-resolution");
const {
  routeContext,
  workflowController,
} = require("./workflow-controller");

/**
 * Initializes the Core boundary for the CLI runtime.
 *
 * Context classification remains Core-owned. The single Workflow Controller
 * consumes that result for routing only; lifecycle behavior remains deferred
 * to later Phase 10 work.
 */
function initializeCore() {
  return {
    initializeContext,
    resolveClarification,
    workflowController,
  };
}

module.exports = {
  initializeCore,
  initializeContext,
  resolveClarification,
  routeContext,
  workflowController,
};
