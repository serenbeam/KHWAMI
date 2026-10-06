# Repository Feature Map

## Purpose

Map KHWAMI's major reusable capabilities to their primary documentation and template locations so AI assistants can locate the right asset without broad repository exploration.

## Context

KHWAMI is a documentation-first repository with the Phase 10.1 CLI bootstrap, Phase 10.2 input/context boundary, Phase 10.3 workflow-routing boundary, Phase 10.4 proposal/permission boundary, bounded Phase 10.5 execution/validation/terminal boundaries, Phase 10.6 error/conflict/no-change handling, and Phase 10.7 end-to-end closure. Its features are reusable engineering guidance, task prompts, templates, KHWAMI records, and bounded CLI runtime capabilities rather than full user-facing application functionality.

This map uses `docs/repository-overview.md` for repository context and `docs/architecture.md` for responsibility boundaries. It identifies where capabilities are implemented without repeating their detailed contents.

## Scope

This document covers confirmed KHWAMI capabilities and their primary implementation locations.

It excludes individual prompt internals, later workflow runtime flows, and planned-but-unimplemented repository-intelligence documents.

## Information

### Capability Map

| Capability | Primary implementation locations | Related components | Status |
| --- | --- | --- | --- |
| Personal AI engineering standards | `agents/PERSONAL_AGENTS.md` | Global and repository-specific instructions | Confirmed |
| Global AI workflow guidance | `instructions/global/` | `workflow.md`, `prompting-guide.md`, `search-strategy.md`, `tool-selection.md`, `rtk-workflow.md`, `copilot_instructions.md` | Confirmed |
| Repository-specific AI instruction starter | `instructions/repository/copilot_instructions-template.md` | Repository-specific guidance created from the template | Confirmed |
| General engineering task prompts | `prompts/general-engineering/` | Analysis, planning, investigation, review, refactoring, implementation, documentation, architecture, performance, and testing prompts | Confirmed |
| Language-specific prompt guidance | `prompts/programming-languages/` | `javascript.md`, `typescript.md` | Confirmed |
| Technology-specific prompt guidance | `prompts/technologies/` | `react.md`, `react-native.md`, `nodejs.md`, `express.md` | Confirmed |
| Prompt-library authoring | `prompts/README.md`, `prompts/TEMPLATE.md` | All prompt categories | Confirmed |
| Repository-intelligence authoring | `docs/TEMPLATE.md` | `docs/repository-overview.md`, `docs/architecture.md`, `docs/feature-map.md`, and `docs/decisions.md` | Confirmed |
| KHWAMI operating contract | `KHWAMI_OPERATING_CONTRACT.md` | `KHWAMI.md`, `README.md`, and KHWAMI governance documents | Confirmed |
| KHWAMI planning and state tracking | `ROADMAP.md`, `WORKSPACE_STATE.md` | All KHWAMI layers | Confirmed |
| CLI bootstrap and runtime boundary | `package.json`, `src/cli/index.js`, `src/core/bootstrap.js` | Node.js, plain JavaScript, npm | Phase 10.1 complete |
| CLI input and context initialization | `src/cli/index.js`, `src/core/context-resolution.js` | Target input, intent hint, read-only evidence, CREATE/ADOPT/AMBIGUOUS classification | Phase 10.2 complete |
| Workflow Controller integration | `src/core/workflow-controller.js`, `src/core/bootstrap.js` | Single stateless CREATE/ADOPT/AMBIGUOUS routing boundary | Phase 10.3 complete |
| ADOPT Analysis | `src/core/adopt-analysis.js`, `src/core/workflow-controller.js`, `test/adopt-analysis.test.js` | Read-only existing-project understanding, evidence, preservation scope, and unresolved objective boundary | ADOPT analysis complete; later bounded lifecycle stages are implemented separately |
| ADOPT requirement reconciliation | `src/core/adopt-requirement.js`, `src/core/workflow-controller.js`, `test/adopt-requirement.test.js` | Explicit objective/evidence reconciliation and deterministic proposal-readiness result | ADOPT requirement boundary complete |
| ADOPT proposal generation | `src/core/adopt-proposal.js`, `src/core/workflow-controller.js`, `test/adopt-proposal.test.js` | Non-executable objective-grounded proposal with preservation scope and proposed change areas | ADOPT proposal complete; later actions remain review-only |
| ADOPT action derivation | `src/core/adopt-action-derivation.js`, `src/core/workflow-controller.js`, `test/adopt-action-derivation.test.js` | Non-executable review candidate actions with bounded target/evidence provenance | ADOPT action derivation complete; execution remains blocked/read-only |
| ADOPT Change Detection and Approved Scope | `src/core/change-detection.js`, `src/core/approved-scope.js`, `src/core/workflow-controller.js`, `test/adopt-action-derivation.test.js` | Bounded baseline/current comparison, material-change/conflict detection, out-of-scope rejection, and read-only scope representation | Complete; feeds blocked/read-only execution and validation |
| ADOPT Permission integration | `src/core/workflow-controller.js`, `src/cli/index.js`, `test/adopt-action-derivation.test.js`, `test/adopt-e2e.test.js` | Ordered canonical `y/yes` / `n/no` Permission bound to the reviewed bounded scope without enabling REVIEW execution | Complete; feeds blocked/read-only execution, validation, and E2E |
| Proposal, review, and permission interaction | `src/cli/index.js`, `src/core/workflow-controller.js` | Bounded proposal representation, presentation gate, canonical permission result | Phase 10.4 complete |
| Execution, validation, and terminal boundary | `src/cli/index.js`, `src/core/workflow-controller.js`, `src/core/create-execution.js`, `src/core/create-validation.js`, `src/core/adopt-execution.js`, `src/core/adopt-validation.js` | Authorized-scope derivation, explicit CREATE execution, safe blocked ADOPT execution, validation, and terminal result representation | Phase 10.5 bounded MVP complete; ADOPT mutation remains future scope |
| Error, conflict, and No-Change handling | `src/core/workflow-controller.js` | Bounded error propagation, scope-mismatch safe stop, validation distinction, and explicit No-Change limitation | Phase 10.6 complete |
| CREATE Analysis MVP | `src/core/create-analysis.js`, `src/core/workflow-controller.js` | Read-only CREATE Analysis Result with explicit requirements, evidence, unresolved decisions, risks, and candidate-action boundary | Pre-10.7 prerequisite complete |
| CREATE requirement collection | `src/cli/index.js`, `src/core/context-resolution.js`, `test/create-analysis.test.js` | Explicit purpose, project type, and initial scope input with re-analysis | Pre-10.7 prerequisite complete |
| CREATE project-shape analysis | `src/core/create-project-shape.js`, `src/core/create-analysis.js`, `test/create-analysis.test.js` | Provenance-aware project-shape fields and unresolved design decisions | Phase 10.5.2 complete |
| CREATE proposal generation | `src/core/create-proposal.js`, `src/core/workflow-controller.js`, `test/create-analysis.test.js` | Structured reviewable proposal, bounded REVIEW actions, preserved scope, readiness, risks, dependencies, and validation expectations | Phase 10.5.3 complete; execution handled by the later bounded integration |
| CREATE executable-action derivation | `src/core/create-action-derivation.js`, `src/core/create-proposal.js`, `test/create-action-derivation.test.js` | Resolved concrete CREATE file actions with provenance and review-only fallback | 10.5.3 prerequisite complete; normal action source remains limited |
| Change Detection and Approved Scope | `src/core/change-detection.js`, `src/core/approved-scope.js`, `src/core/workflow-controller.js`, `test/change-detection.test.js` | Scoped baseline/current comparison, NO_CHANGE/MATERIAL_CHANGE results, exact scope derivation, and invalidation | Phase 10.5.4 boundary complete; execution remains a separate integration |
| CREATE execution and validation | `src/core/create-execution.js`, `src/core/create-validation.js`, `src/core/workflow-controller.js`, `test/create-execution.test.js` | Mechanical concrete CREATE file-action execution and post-execution validation | Phase 10.5.5 complete for explicit resolved actions |

### Feature Location Guide

| Need | Start at |
| --- | --- |
| Apply durable engineering principles | `agents/PERSONAL_AGENTS.md` |
| Determine how AI should approach work | `instructions/global/copilot_instructions.md` and the relevant document in `instructions/global/` |
| Create repository-specific AI guidance | `instructions/repository/copilot_instructions-template.md` |
| Select or author a reusable task prompt | `prompts/README.md`, then the applicable prompt category |
| Understand KHWAMI | `docs/repository-overview.md`, then `docs/architecture.md` |
| Understand KHWAMI operating rules | `KHWAMI_OPERATING_CONTRACT.md` |
| Check phase status, priorities, or planned deliverables | `ROADMAP.md` and `WORKSPACE_STATE.md` |

### Boundaries and Uncertainty

- No full product-facing features, screens, routes, services, or databases are confirmed. The executable application flow includes CREATE analysis/project-shape/proposal/scope/execution/validation boundaries and the ADOPT read-only lifecycle through blocked execution, validation, terminal results, and CLI E2E. Phase 10.7 is complete; actual executable ADOPT mutations remain future scope.
- Phases 4 and 5 are complete; Phase 4's four core documents remain in `docs/`.
- The mapped capabilities are confirmed by current files and directories. Their detailed behavior remains defined by the referenced documents.

## References

- `docs/TEMPLATE.md` - required repository-intelligence structure and evidence rules.
- `KHWAMI_OPERATING_CONTRACT.md` - KHWAMI operating rules and change-control contract.
- `docs/repository-overview.md` - repository identity, component index, and environment context.
- `docs/architecture.md` - responsibility layers, boundaries, and information flows.
- `prompts/README.md` and `prompts/TEMPLATE.md` - prompt-library structure and authoring conventions.
- `ROADMAP.md` - completed capabilities, Phase 4 and 5 deliverables, and future roadmap phases.
- `WORKSPACE_STATE.md` - current KHWAMI state, priorities, decisions, environment, and continuation context.
- `agents/PERSONAL_AGENTS.md` and `instructions/global/` - authoritative guidance assets mapped above.

## Maintenance

Update this map when a KHWAMI capability is added, removed, renamed, moved, or materially reorganized, or when its authoritative implementation location changes.

Revise or remove entries that no longer correspond to existing repository assets. Do not update this map for wording-only changes that do not change a capability or its location.

## Notes

- This map identifies capability locations, not detailed task instructions or feature behavior.
- The repository instruction template path uses underscores: `instructions/repository/copilot_instructions-template.md`.
