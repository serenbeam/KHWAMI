# Repository Architecture

## Purpose

Describe KHWAMI's documentation architecture: its responsibility layers, their relationships, and the paths AI assistants should consult for repository-level context.

## Context

KHWAMI is a documentation-first repository with a minimal Node.js CLI input, context-initialization, workflow-routing, proposal, permission-result, safe execution-boundary, and bounded error-handling runtime. Its architecture organizes reusable engineering assets by responsibility while keeping the CLI presentation boundary separate from Core context resolution and the single Workflow Controller.

`ROADMAP.md` owns KHWAMI's phase plan and history, while `WORKSPACE_STATE.md` owns the current operational snapshot. This document complements `docs/repository-overview.md` by describing relationships and boundaries rather than repeating the repository inventory.

## Scope

This document covers the architecture of KHWAMI's Markdown documentation and its conceptual information flows.

It excludes detailed CLI workflow architecture, lifecycle implementation, deployment, and workflow authority. The CLI bootstrap boundary is recorded here only as a repository component; its authoritative workflow and CLI contract remains in `KHWAMI_WORKFLOW_CONTROL.md`.

## Information

### Responsibility Layers

| Layer | Primary responsibility | Authoritative location | Boundary |
| --- | --- | --- | --- |
| Personal standards | Defines durable engineering principles and AI collaboration expectations. | `agents/PERSONAL_AGENTS.md` | Does not define repository-specific knowledge. |
| Global instructions | Defines reusable AI workflows, prompting, exploration, tool selection, and RTK usage. | `instructions/global/` | Does not replace project-specific rules or repository facts. |
| Repository instruction template | Provides a starting structure for repository-specific AI guidance. | `instructions/repository/copilot_instructions-template.md` | Does not replace source-of-truth implementation or repository-intelligence documents. |
| Prompt library | Defines reusable task-request structures for engineering activities, languages, and technologies. | `prompts/` | Does not define persistent repository knowledge. |
| Repository intelligence | Records concise, evidence-based knowledge about a repository. | `docs/` | Does not define AI behavior, workflows, or task-specific instructions. |
| KHWAMI governance | Defines KHWAMI operating rules and records KHWAMI direction, phase status, priorities, and environment. | `KHWAMI_OPERATING_CONTRACT.md`, `ROADMAP.md`, `WORKSPACE_STATE.md` | Does not duplicate the detailed content owned by the layers above. |
| CLI bootstrap runtime | Provides the minimal command entry point and CLI-to-Core initialization seam. | `package.json`, `src/cli/`, `src/core/` | Does not own workflow authority, governance, lifecycle state, permission, execution, or validation. |
| Core context resolution | Collects bounded target evidence and applies shared CREATE/ADOPT/AMBIGUOUS context rules. | `src/core/context-resolution.js`, `KHWAMI_OPERATING_CONTRACT.md` | Does not implement full CREATE/ADOPT workflows or replace the Workflow Controller. |
| CREATE workflow analysis | Converts resolved CREATE context evidence and available input into a structured, read-only CREATE Analysis Result. | `src/core/create-analysis.js`, `KHWAMI_CREATE.md` | Does not invent requirements, authorize actions, or execute the workflow. |
| ADOPT workflow analysis | Converts resolved ADOPT target evidence into a bounded, read-only ADOPT Analysis Result. | `src/core/adopt-analysis.js`, `KHWAMI_ADOPT.md` | Does not generate proposals, derive executable actions, authorize, or execute. |
| ADOPT requirement reconciliation | Reconciles an explicit ADOPT objective with existing-project understanding and returns proposal readiness without proposing or executing. | `src/core/adopt-requirement.js`, `KHWAMI_ADOPT.md` | Does not generate proposals, actions, Approved Scope, or permission. |
| ADOPT proposal generation | Converts resolved ADOPT requirement results into a non-executable, reviewable ADOPT proposal. | `src/core/adopt-proposal.js`, `KHWAMI_ADOPT.md` | Does not derive executable actions, authorize, create Approved Scope, or execute. |
| ADOPT action derivation | Converts bounded ADOPT proposed change areas into non-executable review candidate actions. | `src/core/adopt-action-derivation.js`, `KHWAMI_ADOPT.md` | Does not create mutation-ready actions, create Approved Scope, authorize, or execute. |
| ADOPT Change Detection and Approved Scope | Captures bounded ADOPT target state, detects material change/conflict, rejects scope violations, and represents a read-only scope. | `src/core/change-detection.js`, `src/core/approved-scope.js`, `src/core/workflow-controller.js` | Does not broaden the analyzed target or make REVIEW actions executable. |
| ADOPT Permission integration | Reuses canonical Permission only after reviewed ADOPT Change Detection establishes a valid bounded scope. | `src/core/workflow-controller.js`, `src/cli/` | Does not authorize unresolved/out-of-scope proposals or enable REVIEW execution. |
| CREATE project-shape analysis | Derives evidence-traceable application, platform, technology, runtime, organization, architecture, dependency, testing, and documentation characteristics. | `src/core/create-project-shape.js`, `KHWAMI_CREATE.md` | Does not generate templates, concrete execution actions, or Approved Scope. |
| CREATE proposal generation | Converts completed CREATE analysis into a structured reviewable proposal with bounded review actions and readiness. | `src/core/create-proposal.js`, `KHWAMI_CREATE.md` | Does not authorize, Change Detect, create Approved Scope, or execute. |
| CREATE executable-action derivation | Classifies resolved, provenance-backed CREATE file decisions as executable or review-only without mutation. | `src/core/create-action-derivation.js`, `KHWAMI_CREATE.md` | Does not choose technology, invent templates, authorize actions, or execute. |
| Change Detection and Approved Scope | Captures proposal-relevant baseline/current state, detects bounded changes, and derives exact scope only after valid permission. | `src/core/change-detection.js`, `src/core/approved-scope.js`, `KHWAMI_OPERATING_CONTRACT.md` | Does not execute actions, broaden scope, or replace governance. |
| CREATE execution and validation | Applies only concrete file actions already present in Approved Scope and validates their actual result. | `src/core/create-execution.js`, `src/core/create-validation.js`, `KHWAMI_CREATE.md` | Does not invent actions, create templates, install dependencies, or execute review-only scopes. |
| CREATE execution integration | Orchestrates Approved Scope through execution, validation, and terminal results. | `src/core/workflow-controller.js`, `src/cli/` | Does not generate actions or broaden Approved Scope. |
| CREATE requirement collection | Captures explicit purpose, project type, and initial scope input for re-analysis. | `src/cli/index.js`, `src/core/context-resolution.js` | Does not decide CREATE policy, architecture, actions, permission, or execution. |
| Workflow Controller routing | Consumes the Core context result and represents the single CREATE, ADOPT, or unresolved Context Resolution route. | `src/core/workflow-controller.js`, `KHWAMI_WORKFLOW_CONTROL.md` | Does not duplicate classification, governance, workflow execution, or lifecycle state. |
| Proposal and permission boundary | Represents bounded future workflow scope, presents it for review, and interprets canonical permission input without executing. | `src/core/workflow-controller.js`, `src/cli/` | Does not create Approved Scope prematurely or execute CREATE/ADOPT. |
| Execution, validation, and terminal boundary | Derives a bounded execution boundary, executes explicit CREATE actions, blocks ADOPT mutation, and represents validation/terminal results. | `src/core/workflow-controller.js`, `src/core/create-execution.js`, `src/core/create-validation.js`, `src/core/adopt-execution.js`, `src/core/adopt-validation.js`, `src/cli/` | Does not invent workflow actions, mutate targets without concrete scope, enable ADOPT mutation, or repair failures. |
| Error, conflict, and No-Change boundary | Preserves bounded execution/validation errors, safe-stops scope mismatches, and keeps genuine No-Change distinct from blocked/unexecuted work. | `src/core/workflow-controller.js`, `KHWAMI_OPERATING_CONTRACT.md` | Does not retry, repair, expand scope, or manufacture No-Change results. |

### Component Relationships

```text
agents/PERSONAL_AGENTS.md
        -> engineering principles

instructions/global/
        -> AI operating methods

instructions/repository/
        -> project-specific instruction starting point

prompts/
        -> reusable task-request structures

docs/
        -> repository knowledge for AI-assisted work

KHWAMI_OPERATING_CONTRACT.md
        -> KHWAMI operating rules and change control

ROADMAP.md + WORKSPACE_STATE.md
        -> KHWAMI direction and current status

package.json + src/cli/
        -> CLI command entry and presentation boundary

src/core/
        -> Core bootstrap, context resolution, CREATE analysis, and single Workflow Controller boundary
```

The arrows express responsibility and intended consultation, not runtime dependencies or automated execution.

### Information Flows

| Flow | Confirmed or inferred | Description |
| --- | --- | --- |
| KHWAMI operation and evolution | Confirmed | `KHWAMI_OPERATING_CONTRACT.md` defines operating rules; `ROADMAP.md` defines phases and deliverables; `WORKSPACE_STATE.md` records current status, priorities, and environment. |
| Reusable asset authoring | Confirmed | Templates in `prompts/TEMPLATE.md`, `instructions/repository/`, and `docs/TEMPLATE.md` standardize assets created in their respective directories. |
| AI-assisted repository work | Inferred from document responsibilities | An AI assistant combines applicable personal standards, operating instructions, task prompts, and repository intelligence while treating the target repository as the source of truth. |
| Repository intelligence maintenance | Confirmed | Repository knowledge is updated when its covered structure, architecture, features, decisions, dependencies, configuration, or authoritative sources change; the documentation impact check identifies whether governance documents also need updates. |
| CLI runtime bootstrap | Confirmed | The Node.js entry point captures initial input, invokes Core context resolution and the single controller route, renders results, and exits safely; bounded execution and validation remain Core-owned. |
| Workflow Controller routing | Confirmed | The controller consumes an existing context result and returns CREATE, ADOPT, or unresolved Context Resolution routing without re-detection or lifecycle progression. |
| CREATE analysis integration | Confirmed | Resolved CREATE context is passed to a separate read-only analyzer; unresolved requirements produce an analysis result without proposal permission or execution. |
| ADOPT analysis integration | Confirmed / bounded | Resolved ADOPT context is passed to a separate read-only analyzer; the result records evidence, project understanding, preservation scope, and unresolved objective information without proposal or execution. |
| ADOPT requirement reconciliation | Confirmed / bounded | Explicit objective input is reconciled with bounded existing-project evidence; missing, broad, or conflicting objectives remain blocked/review-required. |
| ADOPT proposal generation | Confirmed / bounded | Grounded ADOPT objectives produce a non-executable proposal with objective, relevant areas, evidence, preservation scope, proposed change areas, risks, and unresolved review items. |
| ADOPT action derivation | Confirmed / bounded | Grounded ADOPT proposals produce review-only candidate actions with target, operation, purpose, rationale, evidence, and non-executable status. |
| ADOPT Change Detection and Approved Scope | Confirmed / bounded | Derived ADOPT actions are compared against a bounded target baseline; material changes and conflicts stop the scope, while valid no-change results preserve a read-only scope boundary. |
| ADOPT Permission integration | Confirmed / bounded | Canonical `y/yes` and `n/no` Permission is exposed only after review and valid bounded Change Detection; authorization preserves non-executable REVIEW actions. |
| CREATE project-shape analysis | Confirmed | Complete minimum requirements and target evidence produce structured project-shape fields with provenance; unsupported architecture and structure decisions remain unresolved. |
| CREATE proposal generation | Confirmed | Completed analysis produces a reviewable CREATE proposal with action provenance, preserved scope, risks, dependencies, validation expectations, unresolved review items, and readiness without execution. |
| CREATE executable-action derivation | Confirmed / bounded | Explicitly resolved concrete action decisions can enter the proposal as executable CREATE file actions; technology recommendations and incomplete decisions remain REVIEW_REQUIRED. |
| Change Detection and Approved Scope | Confirmed | Review-ready concrete action fixtures can be compared against a bounded baseline; NO_CHANGE can establish exact Approved Scope after authorization, while material changes invalidate scope. |
| CREATE execution and validation | Confirmed / bounded | Concrete approved CREATE file actions can be applied and validated through the normal CLI path when explicit resolved action data is supplied; no implicit actions are generated. |
| CREATE execution integration | Confirmed / bounded | The controller executes only concrete authorized scope; review-only proposals remain blocked until explicit action data is resolved. |
| CREATE requirement collection | Confirmed | Explicit CLI requirement values are carried through context and re-analysis; missing values remain unresolved and do not authorize proposal execution. |
| Proposal and permission interaction | Confirmed | Resolved routes produce a bounded future-workflow proposal; the CLI displays it and passes raw permission input back to Core, which returns AUTHORIZED, REJECTED, or UNRESOLVED without execution. |
| Execution/validation/terminal boundary | Confirmed | Authorized proposals derive a bounded execution boundary; explicit CREATE actions execute and validate, while ADOPT REVIEW scopes use blocked/non-mutating execution, unchanged-target validation, and an explicit non-success terminal result. |
| Error/conflict/no-change handling | Confirmed | Execution failures, validation failures, permission/scope mismatches, and unresolved conditions remain observable and stop safely; blocked or unexecuted work is not classified as No-Change. |

### Architectural Constraints

- Keep responsibility layers separate to avoid duplicating AI behavior, workflows, task instructions, and repository facts.
- Use templates as shared structures, then specialize the information for their document type.
- Prefer authoritative repository-relative references over copying detailed source, configuration, or decision content.
- Maintain KHWAMI's documentation-first structure unless a repository-level change justifies a new layer or component.
- Keep the CLI as a presentation/input boundary and keep context classification in Core under the shared policy defined by `KHWAMI_OPERATING_CONTRACT.md`.
- Keep full workflow authority in the single Core/controller architecture defined by `KHWAMI_WORKFLOW_CONTROL.md`.
- Do not introduce another controller or a hidden lifecycle state machine.
- Keep proposal and permission semantics in the existing Core Workflow Controller boundary.
- Do not invent concrete workflow actions or Approved Scope when authoritative workflow analysis has not supplied them.
- Keep error, conflict, and No-Change handling bounded within the existing controller without automatic recovery.
- Keep CREATE-specific analysis outside the controller while returning a controller-consumable Analysis Result.
- Keep ADOPT-specific analysis outside the controller while returning a controller-consumable Analysis Result.
- Keep ADOPT objective reconciliation outside the controller while returning a requirement result.
- Keep ADOPT proposal generation outside the controller while using the controller only for orchestration.
- Keep requirement collection limited to explicit user input and separate from CREATE policy interpretation.
- Keep project-shape derivation read-only, evidence-traceable, and separate from concrete proposal generation.
- Keep proposal generation separate from permission, Change Detection, Approved Scope, and execution.
- Keep baseline/current-state comparison scoped to proposal-relevant action paths.
- Keep CREATE execution mechanical and limited to actions already present in Approved Scope.
- Keep normal CREATE execution limited to explicit resolved action data; review-only proposals remain blocked.

## References

- `docs/TEMPLATE.md` - repository-intelligence standard and maintenance model.
- `KHWAMI_OPERATING_CONTRACT.md` - KHWAMI operating rules and change-control contract.
- `docs/repository-overview.md` - repository identity, structure, environment, and component index.
- `agents/PERSONAL_AGENTS.md` - personal standards and documentation principles.
- `instructions/global/copilot_instructions.md` - global AI behavior and instruction priority.
- `instructions/global/workflow.md` - reusable engineering workflows.
- `instructions/global/search-strategy.md` - incremental repository exploration strategy.
- `prompts/README.md` and `prompts/TEMPLATE.md` - prompt-library purpose and template conventions.
- `ROADMAP.md` and `WORKSPACE_STATE.md` - KHWAMI phases, priorities, and current state.

## Maintenance

Update this document when responsibility layers, their ownership boundaries, their relationships, or the KHWAMI governance model changes.

Revise or remove architecture claims when the referenced source documents change. Do not update it for individual prompt, instruction, or repository-intelligence wording unless that change alters a documented responsibility or relationship.

## Notes

- A minimal Node.js CLI input, context-resolution, CREATE-analysis, workflow-routing, proposal, permission-result, bounded execution/validation, terminal-result, and error-handling runtime is confirmed. Explicit CREATE file actions can execute and validate; ADOPT remains a blocked/read-only lifecycle. Service boundaries, data stores, deployment pipeline, and executable ADOPT mutations are not implemented.
- The AI-assisted repository-work flow is an inferred conceptual model; consult the cited source documents for their exact rules and precedence.
