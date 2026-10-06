# Repository Overview

## Purpose

Provide a high-level index of KHWAMI so AI assistants can locate its reusable guidance, prompt assets, environment records, and planning documents with minimal exploration.

## Context

This repository contains KHWAMI's documentation-first resources and the bounded Phase 10 CLI MVP for standardizing AI-assisted software engineering across projects. `ROADMAP.md` owns the phase plan and history; `WORKSPACE_STATE.md` owns the current operational snapshot. Phase 9 — CLI Architecture & Design and Phase 10.1 through Phase 10.7 are complete for the bounded MVP scope. Phase 10.5 supports explicit resolved CREATE execution/validation and blocked/read-only ADOPT execution/validation; Phase 10.6 error/conflict/no-change handling and Phase 10.7 E2E closure are complete. The normal CREATE review flow supports explicit resolved file actions; ADOPT remains non-mutating and actual executable ADOPT mutations are future scope.

KHWAMI separates reusable engineering standards, operational instructions, task prompts, and repository knowledge. This overview describes KHWAMI itself; detailed guidance remains in its authoritative documents.

## Scope

This overview covers KHWAMI's identity, major structure, confirmed tooling, documented development environment, and high-level components.

It excludes detailed architecture, feature mapping, decisions, task procedures, personal AI behavior rules, and prompt contents. Those belong in their dedicated documents or directories.

## Information

### Repository Identity

| Item | Confirmed information |
| --- | --- |
| Repository type | KHWAMI documentation repository and reusable engineering asset library. |
| Primary objective | Standardize AI-assisted engineering practices, reusable prompts, repository guidance, and repository intelligence. |
| Latest completed phase/milestone | Phase 10.7 — MVP End-to-End Validation & Phase 10 Closure. |
| Latest activated capability | Phase 5 — KHWAMI Optimization. |
| Phase 6 advanced capability | Inactive / deferred. |
| Current phase | Phase 10 — CLI MVP Implementation (closed for the bounded MVP scope). |

### Structure

| Path | Responsibility |
| --- | --- |
| `agents/` | Personal, technology-agnostic AI development standards. |
| `instructions/global/` | Global guidance for AI behavior, workflows, prompting, search, tool selection, and RTK usage. |
| `instructions/repository/` | Template for repository-specific Copilot instructions. |
| `prompts/` | Reusable Markdown prompt library, its template, and task-, language-, and technology-specific prompts. |
| `docs/` | Repository-intelligence documentation and its shared template. |
| `src/cli/` | Thin CLI entry point and presentation boundary. |
| `src/core/` | Core bootstrap, context resolution, CREATE analysis, and single Workflow Controller boundary. |
| `package.json` | Node.js and npm CLI package configuration. |
| `KHWAMI_OPERATING_CONTRACT.md` | Canonical KHWAMI operating rules and change-control contract. |
| `ROADMAP.md` | Authoritative KHWAMI phase plan, deliverables, and future direction. |
| `WORKSPACE_STATE.md` | Current KHWAMI state, documented environment, installed tools, and active priorities. |

### Confirmed Technologies and Tools

| Category | Confirmed use |
| --- | --- |
| Documentation format | Markdown is the primary format for guidance, templates, prompts, roadmap, and workspace state. |
| AI tools | GitHub Copilot, GitHub Copilot CLI, Cursor, and ChatGPT are listed as primary workspace tools. |
| Development tools | Git, GitHub CLI, RTK, `rg`, `fd`, `jq`, `bat`, and `delta` are listed as installed. |
| CLI runtime | Node.js with plain JavaScript and npm; no third-party dependencies or CLI framework. |

### Development Environment

- Documented operating system: Windows 11.
- Documented editor and terminal: Visual Studio Code and PowerShell.
- The repository contains the Phase 10.1 `package.json` and minimal Node.js CLI source; no build configuration, test-runner configuration, or deployment configuration is present.
- The CLI uses plain JavaScript, npm, and zero third-party dependencies.
- Markdown documentation changes require no repository-specific build or runtime setup.

### Key Components

| Component | Responsibility |
| --- | --- |
| `agents/PERSONAL_AGENTS.md` | Personal engineering principles and AI collaboration standards. |
| `instructions/global/` | Reusable operating guidance for AI-assisted engineering tasks. |
| `prompts/README.md` and `prompts/TEMPLATE.md` | Prompt-library conventions and base structure for new reusable prompts. |
| `instructions/repository/copilot_instructions-template.md` | Starting template for repository-specific AI guidance. |
| `docs/TEMPLATE.md` | Shared standard for repository-intelligence documents. |
| `KHWAMI_OPERATING_CONTRACT.md` | Canonical KHWAMI operating rules and change-control contract. |
| `ROADMAP.md` | KHWAMI phase plan, phase history, deliverables, milestones, and future direction. |
| `WORKSPACE_STATE.md` | KHWAMI current status, objective, priorities, environment, decisions, and continuation instructions. |
| `package.json` | Minimal npm configuration and CLI command entry point. |
| `src/cli/index.js` | CLI entry point that invokes the Core bootstrap boundary. |
| `src/core/bootstrap.js` | Core runtime initialization seam and context-resolution access point. |
| `src/core/context-resolution.js` | Core-owned read-only target evidence and CREATE/ADOPT/AMBIGUOUS classification. |
| `src/core/create-analysis.js` | Read-only CREATE-specific Analysis Result generation. |
| `src/core/adopt-analysis.js` | Read-only ADOPT project-understanding and preservation analysis. |
| `src/core/adopt-requirement.js` | Explicit ADOPT objective reconciliation and proposal-readiness boundary. |
| `src/core/adopt-proposal.js` | Non-executable ADOPT proposal generation. |
| `src/core/adopt-action-derivation.js` | Non-executable ADOPT review-action derivation. |
| `src/core/adopt-execution.js` | Blocked/read-only ADOPT execution boundary. |
| `src/core/adopt-validation.js` | ADOPT blocked-outcome and target-preservation validation. |
| `src/core/create-project-shape.js` | Evidence-traceable CREATE project-shape analysis. |
| `src/core/create-proposal.js` | Read-only structured CREATE proposal generation. |
| `src/core/create-action-derivation.js` | Provenance-backed classification of resolved CREATE actions. |
| `src/core/change-detection.js` | Proposal-relevant baseline capture and scoped current-state comparison for CREATE and bounded ADOPT actions. |
| `src/core/approved-scope.js` | Exact authorization-boundary derivation and invalidation for CREATE and bounded read-only ADOPT scope. |
| `src/core/create-execution.js` | Mechanical execution of concrete approved CREATE file actions. |
| `src/core/create-validation.js` | Post-execution validation of concrete CREATE file actions. |
| `test/` | Node.js built-in tests for CREATE analysis/execution, ADOPT lifecycle boundaries, ADOPT CLI E2E, and regressions. |
| `src/core/workflow-controller.js` | Single Core orchestration boundary for routing, analysis integration, proposal/permission handling, execution-scope derivation, validation results, and terminal results. |

## References

- `KHWAMI.md` - canonical KHWAMI identity and terminology.
- `KHWAMI_OPERATING_CONTRACT.md` - canonical KHWAMI operating rules and change-control contract.
- `ROADMAP.md` - authoritative plan, phase status, core deliverables, and KHWAMI scope.
- `WORKSPACE_STATE.md` - authoritative KHWAMI objective, environment, installed tools, and active priorities.
- `agents/PERSONAL_AGENTS.md` - personal engineering and AI collaboration standards.
- `instructions/global/` - operational guidance for AI-assisted development.
- `prompts/README.md` - prompt-library purpose, organization, and authoring conventions.
- `docs/TEMPLATE.md` - required standard for repository-intelligence documents.

## Maintenance

Update this overview when KHWAMI's purpose, phase status, major directory structure, core tooling, documented development environment, or key components change.

Revise or remove claims when their source documents no longer support them. Do not update this overview for individual prompt wording or temporary task activity unless it changes repository-level understanding.

## Notes

- Phase 10.1 adds the Node.js CLI runtime, Phase 10.2 adds read-only input/context classification, Phase 10.3 adds routing, Phase 10.4 adds proposal/permission representation, Phase 10.5 adds bounded CREATE execution/validation and blocked/read-only ADOPT execution/validation, Phase 10.6 adds bounded error/conflict handling, and Phase 10.7 verifies the complete MVP E2E lifecycle. CREATE analysis adds explicit requirement/project-shape/proposal/action boundaries; 10.5.4 adds scoped Change Detection/Approved Scope derivation; ADOPT adds read-only analysis, action derivation, bounded Change Detection, read-only Approved Scope preparation, Permission, validation, and CLI E2E.
- The repository instruction template is `instructions/repository/copilot_instructions-template.md`.
- Phase 6 project/milestone work is complete; its advanced capability remains inactive/deferred.
- Phase 5 — KHWAMI Optimization remains the latest activated capability. Phase 4's four core documents remain `repository-overview.md`, `architecture.md`, `feature-map.md`, and `decisions.md`.
- Phase 7 — Repository Structure Audit, Phase 9 — CLI Architecture & Design, and Phase 10.1 through Phase 10.7 are complete for the bounded MVP scope. Phase 10.6, CREATE Analysis MVP, CREATE requirement collection, CREATE project-shape analysis, CREATE proposal generation, 10.5.3.x action derivation, 10.5.4 scope handling, 10.5.5 execution/validation, ADOPT analysis/objective/proposal/action derivation, ADOPT Change Detection/Approved Scope preparation, ordered Permission, blocked/read-only execution, unchanged-target validation, and CLI E2E are implemented. Actual executable ADOPT mutations remain future scope.
