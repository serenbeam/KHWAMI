# Repository Decisions

## Purpose

Record significant, evidence-supported decisions that explain why KHWAMI is organized as it is and guide future maintenance without duplicating its architecture or feature map.

## Context

KHWAMI's documentation-first resources standardize reusable assets for AI-assisted engineering. `ROADMAP.md` identifies the phase plan and history, while `WORKSPACE_STATE.md` records the current operational state, including active priorities and the latest phase context.

The repository has no dedicated ADR directory or formal decision-record format. The decisions below are reconstructed from current authoritative documentation and relevant Git history; unrecorded rationale and alternatives are identified as unknown.

## Scope

This document covers repository-level decisions about KHWAMI governance, documentation layering, prompt-library organization, repository intelligence, and the scoped Phase 10 CLI runtime, input, routing, CREATE analysis/project-shape analysis/proposal, Change Detection, Approved Scope, permission, execution, validation, terminal-result, error, conflict, and No-Change decisions.

It excludes personal engineering preferences, routine content choices, individual prompt wording, and undocumented historical motivations.

## Information

### Confirmed Decisions

| Decision | Evidence | Confirmed rationale | Consequence |
| --- | --- | --- | --- |
| Use a phase-based roadmap as the KHWAMI plan. | `ROADMAP.md` defines completed phases, future phases, and describes itself as the single source of truth. | Track progress, prevent repeated work, organize reusable assets, and support KHWAMI evolution. | New KHWAMI capabilities are planned and tracked by phase. |
| Use Node.js with plain JavaScript, npm, zero third-party dependencies, and no CLI framework for the Phase 10.1 CLI bootstrap. | Phase 10.1 runtime decision and the resulting `package.json`, `src/cli/index.js`, and `src/core/bootstrap.js`. | Establish the smallest runnable CLI boundary while preserving the Phase 9 controller/CLI separation. | Later Phase 10 work may integrate workflow Core behavior without moving authority into the CLI. |
| Accept explicit `--target` and `--intent` input in the CLI while keeping context evidence evaluation and CREATE/ADOPT/AMBIGUOUS classification in Core. | Phase 10.2 implementation in `src/cli/index.js` and `src/core/context-resolution.js`, governed by `KHWAMI_OPERATING_CONTRACT.md`. | Capture only the initial bounded input required for context resolution and avoid inventing natural-language workflow inference. | Ambiguous or conflicting evidence remains AMBIGUOUS and requires explicit clarification; no workflow is executed. |
| Use one stateless Core Workflow Controller routing seam that consumes context results without reclassifying or executing workflows. | Phase 10.3 implementation in `src/core/workflow-controller.js` and `src/core/bootstrap.js`, governed by `KHWAMI_WORKFLOW_CONTROL.md`. | Establish the single orchestration boundary required by Phase 9 while deferring workflow lifecycle behavior to later phases. | CREATE and ADOPT are represented as routes; AMBIGUOUS remains unresolved; no second controller or lifecycle state machine is introduced. |
| Keep proposal representation and canonical permission interpretation in the existing Workflow Controller while deferring execution to Phase 10.5. | Phase 10.4 implementation in `src/core/workflow-controller.js` and `src/cli/index.js`, governed by `KHWAMI_OPERATING_CONTRACT.md` and `KHWAMI_WORKFLOW_CONTROL.md`. | Present bounded future workflow scope before permission without duplicating controllers or inventing Approved Scope prematurely. | Resolved proposals produce AUTHORIZED, REJECTED, or UNRESOLVED results; no result executes a workflow. |
| Do not invent CREATE/ADOPT execution actions when the authorized proposal contains only future workflow-boundary intent. | Phase 10.5 implementation in `src/core/workflow-controller.js` and the bounded proposal structure. | Preserve Approved Scope and workflow-specific analysis authority while providing a deterministic safe execution/validation/terminal boundary. | Explicit authorized CREATE actions execute through the bounded executor; ADOPT REVIEW scopes remain blocked/non-mutating and are validated for target preservation. |
| Keep Phase 10.6 error, conflict, and No-Change handling bounded in the existing Workflow Controller. | Phase 10.6 implementation and `KHWAMI_OPERATING_CONTRACT.md` / `KHWAMI_WORKFLOW_CONTROL.md`. | Preserve execution/validation distinctions, safe-stop scope mismatches, and genuine No-Change semantics without retries, repair, scope expansion, or invented workflow actions. | Execution failures remain EXECUTION_FAILED, validation failures remain VALIDATION_FAILED, unresolved scope remains UNRESOLVED, and blocked work is not No-Change. |
| Implement CREATE Analysis MVP outside the Workflow Controller as a read-only contract-to-result boundary. | `src/core/create-analysis.js`, `KHWAMI_CREATE.md`, and the Workflow Control requirement for workflow-specific analysis results. | Convert available CREATE context/evidence into explicit requirements, constraints, project characteristics, unresolved decisions, risks, and candidate-action output without inventing requirements or execution actions. | Incomplete CREATE inputs produce an unresolved Analysis Result and no proposal/permission; ADOPT behavior remains unchanged. |
| Collect only the minimum explicit CREATE requirements needed for re-analysis. | `src/cli/index.js`, `src/core/context-resolution.js`, `src/core/create-analysis.js`, and `KHWAMI_CREATE.md`. | Capture project purpose, project type, and initial scope without moving CREATE policy into the CLI or inventing defaults. | Partial or cancelled collection remains unresolved; complete minimum input can prepare a review-only proposal boundary but does not authorize execution. |
| Keep CREATE project-shape analysis read-only and provenance-aware outside the Workflow Controller. | `src/core/create-project-shape.js`, `src/core/create-analysis.js`, and `KHWAMI_CREATE.md`. | Derive only application/platform/technology/runtime and related characteristics supported by explicit requirements or target evidence. | Unsupported architecture, organization, dependency, testing, and documentation decisions remain unresolved; no proposal actions or execution are generated. |
| Generate CREATE proposals from completed analysis without authorizing or executing them. | `src/core/create-proposal.js`, `src/core/workflow-controller.js`, and `KHWAMI_CREATE.md`. | Preserve analysis provenance while representing bounded review actions, preserved scope, risks, dependencies, validation expectations, and readiness. | Proposal generation does not perform Change Detection, create Approved Scope, request permission, or execute. |
| Keep Change Detection and Approved Scope as separate scoped Core boundaries before execution. | `src/core/change-detection.js`, `src/core/approved-scope.js`, `src/core/workflow-controller.js`, and the Operating Contract. | Compare only proposal-relevant target state and derive exact scope after NO_CHANGE and valid permission. | Material changes, proposal identity changes, baseline changes, rejection, unresolved permission, and scope mismatch do not produce Approved Scope. |
| Execute only concrete CREATE file actions already contained in an authorized Approved Scope. | `src/core/create-execution.js`, `src/core/create-validation.js`, and `KHWAMI_CREATE.md`. | Keep execution mechanical, bounded, and separate from analysis/design decisions. | Review-only actions, unsupported actions, missing content, existing targets, invalid scopes, and absent Approved Scope block execution without mutation. |
| Keep CREATE execution limited to explicit resolved concrete actions. | Phase 10.5.5 executor/validator integration, action derivation, and the normal CLI review inputs. | Do not invent templates or convert review-only project-shape decisions into executable actions. | The normal CLI can execute only when path/content/action data is explicitly resolved; review-only proposals remain blocked. |
| Derive executable CREATE actions only from resolved, provenance-backed concrete decisions. | `src/core/create-action-derivation.js`, `src/core/create-proposal.js`, and `KHWAMI_CREATE.md`. | Make the existing executor usable without treating technology recommendations or generic project shape as permission to invent files. | REVIEW_REQUIRED remains the result for missing content, unsupported action types, unresolved technology, or out-of-scope paths. |
| Implement ADOPT analysis as a separate read-only Core boundary. | `src/core/adopt-analysis.js`, `KHWAMI_ADOPT.md`, and `KHWAMI_WORKFLOW_CONTROL.md`. | Establish bounded existing-project understanding and preservation information without moving ADOPT policy into the Workflow Controller. | ADOPT analysis returns unresolved objective information and no proposal, permission, Approved Scope, action, or execution. |
| Reconcile an explicit ADOPT objective with existing-project evidence outside the Workflow Controller. | `src/core/adopt-requirement.js`, `src/core/adopt-analysis.js`, and `KHWAMI_ADOPT.md`. | Distinguish explicit objective, evidence, conflicts, and proposal readiness without inventing a change objective or action. | Missing/broad/conflicting objectives remain blocked or review-required; no proposal or execution is produced. |
| Generate non-executable ADOPT proposals from grounded requirement results. | `src/core/adopt-proposal.js`, `src/core/adopt-requirement.js`, and `KHWAMI_ADOPT.md`. | Preserve explicit objective/evidence provenance and describe bounded change areas before action derivation. | ADOPT proposals never authorize, derive executable actions, create Approved Scope, or execute. |
| Keep ADOPT action derivation review-only while allowing bounded Change Detection and read-only scope preparation. | `src/core/adopt-action-derivation.js`, `src/core/change-detection.js`, `src/core/approved-scope.js`, `src/core/workflow-controller.js`, and `KHWAMI_ADOPT.md`. | Preserve target/evidence provenance and existing shared scope semantics without turning review observations into mutation-ready execution actions. | Candidate actions remain `REVIEW` and non-executable; bounded baselines, material-change/conflict detection, out-of-scope rejection, read-only Approved Scope representation, ordered Permission, blocked execution, unchanged-target validation, and E2E are available. |
| Gate ADOPT Permission on reviewed bounded Change Detection and preserve REVIEW actions as non-executable. | `src/core/workflow-controller.js`, `src/cli/index.js`, `KHWAMI_OPERATING_CONTRACT.md`, and `KHWAMI_ADOPT.md`. | Reuse the canonical `y/yes` and `n/no` interaction without authorizing an unresolved, changed, or out-of-scope ADOPT proposal. | Valid ADOPT scope can receive authorization only after `NO_CHANGE`; rejected, invalid, or out-of-order requests remain unresolved/not authorized. Authorized scopes use blocked/non-mutating execution, unchanged-target validation, and terminal results; executable ADOPT mutations remain future scope. |
| Keep KHWAMI identity and operating rules in separate documents. | `KHWAMI.md` establishes the identity-only boundary; `KHWAMI_OPERATING_CONTRACT.md` defines operating rules. | Prevent identity and operating-rule duplication while keeping both sources discoverable. | KHWAMI identity remains in `KHWAMI.md`; operating rules remain in the root-level operating contract. |
| Separate personal standards, global instructions, task prompts, repository instructions, and repository intelligence by responsibility. | `agents/`, `instructions/`, `prompts/`, and `docs/` are distinct top-level areas with distinct stated purposes. | Avoid duplicated responsibilities and preserve clear sources of truth. | Repository knowledge belongs in `docs/`; AI behavior, operating methods, and task requests remain in their respective layers. |
| Organize the prompt library by purpose. | `prompts/README.md` defines the `general-engineering/`, `programming-languages/`, and `technologies/` categories. | Enable growth without changing the library's overall structure while retaining reusable, focused prompts. | New prompts should be placed in the narrowest appropriate category and begin from `prompts/TEMPLATE.md`. |
| Introduce repository intelligence as a dedicated Phase 4 capability. | `ROADMAP.md` and `WORKSPACE_STATE.md` define the Phase 4 goal, milestone, and core documents. | Reduce unnecessary repository exploration, improve AI context, and standardize repository documentation. | `docs/` uses `docs/TEMPLATE.md` as its shared repository-intelligence standard. |
| Use a documented CLI toolset for focused repository work. | `WORKSPACE_STATE.md` lists installed tools and configured Git/RTK integration; `instructions/global/tool-selection.md` and `search-strategy.md` assign tool responsibilities. | Improve repository exploration efficiency, terminal readability, and context use. | Tool guidance is maintained in `instructions/global/`; individual repositories may define additional requirements. |
| Evaluate additional tools before adoption. | `instructions/global/tool-selection.md` defines the required evidence, compatibility, cost, workflow-benefit, and context-impact assessment. | Avoid adding tooling that does not solve a confirmed workflow gap. | Material adoption, rejection, or replacement decisions are recorded here; no new tool was adopted in Phase 5. |

#### Option C — Architecture Baseline + Phase 6.5 Project Milestone

The project selected Option C — Architecture Baseline + Phase 6.5 Project
Milestone. These are two distinct, non-equivalent meanings.

**Architecture Baseline** is a non-restrictive documentation/status term limited
to the F-01-supported findings:

- no residual governance findings;
- no architecture impact;
- no change required; and
- `FREEZE CANDIDATE — NO GOVERNANCE FINDINGS`.

This Architecture Baseline is not the pre-approval baseline used by the KHWAMI
workflow Change Detection process. F-02 and F-03 provide project-history or
milestone context only and do not enlarge the Architecture Baseline.

**Phase 6.5 Project Milestone** is a project-progress and documentation-status
milestone only. Phase 6 advanced capability activation remains inactive/deferred.
This is distinct from Phase 6 project/milestone closure, which records completion
of the project-level analysis and status work. Phase 6.5 does not activate the
Phase 6 capability.

Neither concept declares Architecture Frozen or creates architecture,
contract, implementation, dependency, repository-structure, documentation, or
future-decision immutability. Neither creates a Candidate → Frozen transition,
freeze authority, exception/unfreeze mechanism, or new approval path. Existing
KHWAMI governance remains unchanged.

### Decision Evidence and Unknowns

| Topic | Confirmed information | Unknown or inferred information |
| --- | --- | --- |
| Prompt-library evolution | Git history records staged commits that establish and expand the prompt library. | Detailed alternatives and trade-offs for its categories are not recorded. |
| Repository-intelligence design | Current documentation establishes Phase 4 goals and the shared `docs/TEMPLATE.md` structure. | The original decision date, alternatives, and implementation trade-offs are not recorded. |
| Tool selection | The current toolset, intended responsibilities, and evaluation criteria are documented. | Historical rejected-tool evaluations before Phase 5 are not recorded. |

### Architectural Consequences

- Changes to a responsibility layer should preserve its stated boundary rather than duplicate content from another layer.
- New repository-intelligence documents must follow `docs/TEMPLATE.md` and reference source-of-truth material.
- The roadmap must be maintained when new deliverables are created so its phase status reflects the existing documentation.

## References

- `ROADMAP.md` - KHWAMI phases, phase objectives, core deliverables, and roadmap governance.
- `KHWAMI_OPERATING_CONTRACT.md` - KHWAMI operating rules and change-control contract.
- `WORKSPACE_STATE.md` - current state, active priorities, environment, decisions, and installed tooling.
- `docs/TEMPLATE.md` - repository-intelligence standard.
- `docs/repository-overview.md` - repository identity and component context.
- `docs/architecture.md` - responsibility layers and architectural boundaries.
- `docs/feature-map.md` - capability locations and completed Phase 4 document status.
- `KHWAMI_WORKFLOW_CONTROL.md` - authoritative CLI boundary and workflow architecture.
- `package.json`, `src/`, and `test/` - Phase 10 CLI runtime, input, context-resolution, CREATE analysis, controller-routing, proposal, permission, execution-boundary, validation, terminal-result, bounded error/conflict implementation, and tests.
- `prompts/README.md` and `prompts/TEMPLATE.md` - prompt-library organization and authoring model.
- `instructions/global/tool-selection.md` and `instructions/global/search-strategy.md` - documented tool responsibilities and exploration approach.
- Git history - staged prompt-library commits through `b6cd47e`.

## Maintenance

Update this document when a repository-level decision is adopted, superseded, reversed, or materially changed, or when evidence changes the confidence of a recorded rationale.

Add alternatives and trade-offs only when they are supported by decision records, discussions, configuration history, or other repository evidence. Remove unsupported inferences rather than presenting them as history.

## Notes

- All listed decisions and rationales are confirmed only to the extent stated by their cited sources.
- No formal ADRs, recorded alternatives, or decision-specific historical rationale were found in the inspected repository documentation and relevant Git history.
