# Repository Overview

## Purpose

Provide a high-level index of KHWAMI so AI assistants can locate its reusable guidance, prompt assets, environment records, and planning documents with minimal exploration.

## Context

This repository contains KHWAMI's documentation-first resources for standardizing AI-assisted software engineering across projects. `ROADMAP.md` owns the phase plan and history; `WORKSPACE_STATE.md` owns the current operational snapshot. Phase 9 — CLI Architecture & Design is complete, Phase 10 is next and not started, and Phase 5 remains the latest activated capability.

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
| Latest completed phase/milestone | Phase 9 — CLI Architecture & Design. |
| Latest activated capability | Phase 5 — KHWAMI Optimization. |
| Phase 6 advanced capability | Inactive / deferred. |
| Next phase | Phase 10 — CLI MVP Implementation (not started). |

### Structure

| Path | Responsibility |
| --- | --- |
| `agents/` | Personal, technology-agnostic AI development standards. |
| `instructions/global/` | Global guidance for AI behavior, workflows, prompting, search, tool selection, and RTK usage. |
| `instructions/repository/` | Template for repository-specific Copilot instructions. |
| `prompts/` | Reusable Markdown prompt library, its template, and task-, language-, and technology-specific prompts. |
| `docs/` | Repository-intelligence documentation and its shared template. |
| `KHWAMI_OPERATING_CONTRACT.md` | Canonical KHWAMI operating rules and change-control contract. |
| `ROADMAP.md` | Authoritative KHWAMI phase plan, deliverables, and future direction. |
| `WORKSPACE_STATE.md` | Current KHWAMI state, documented environment, installed tools, and active priorities. |

### Confirmed Technologies and Tools

| Category | Confirmed use |
| --- | --- |
| Documentation format | Markdown is the primary format for guidance, templates, prompts, roadmap, and workspace state. |
| AI tools | GitHub Copilot, GitHub Copilot CLI, Cursor, and ChatGPT are listed as primary workspace tools. |
| Development tools | Git, GitHub CLI, RTK, `rg`, `fd`, `jq`, `bat`, and `delta` are listed as installed. |

### Development Environment

- Documented operating system: Windows 11.
- Documented editor and terminal: Visual Studio Code and PowerShell.
- The repository contains no detected package manifest, runtime-version declaration, build configuration, test-runner configuration, or deployment configuration.
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

- The absence of application tooling is a confirmed observation from the current repository root; revise this statement if package, build, test, runtime, or deployment configuration is added.
- The repository instruction template is `instructions/repository/copilot_instructions-template.md`.
- Phase 6 project/milestone work is complete; its advanced capability remains inactive/deferred.
- Phase 5 — KHWAMI Optimization remains the latest activated capability. Phase 4's four core documents remain `repository-overview.md`, `architecture.md`, `feature-map.md`, and `decisions.md`.
- Phase 7 — Repository Structure Audit is complete; Phase 9 is complete and Phase 10 is next and not started.
