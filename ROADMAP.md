# KHWAMI Roadmap

> Last Updated: 2026-08-21
> Version: 3.2
> Status: Phase 5 complete
> Documentation Milestone Status: Option C selected — documentation/status only; Phase 6 remains deferred

---

# Purpose

This roadmap is the single source of truth for KHWAMI.

Its objectives are to:

- Track KHWAMI progress across development phases.
- Standardize AI-assisted software engineering practices.
- Prevent repeating completed work.
- Organize AI-related documentation and workflows.
- Build a maintainable, reusable, and scalable AI engineering environment.

---

# Scope

This roadmap applies to KHWAMI.

Its purpose is to standardize AI-assisted software engineering workflows, development standards, prompt engineering, repository guidance, and reusable engineering assets across projects.

The roadmap focuses on:

- AI engineering workflow
- Development standards
- AI instructions
- Prompt library
- Repository intelligence
- Development tooling
- KHWAMI evolution

---

# Current Environment

Operating System

- Windows 11

Editor

- Visual Studio Code

Terminal

- PowerShell

Primary AI Tools

- GitHub Copilot
- GitHub Copilot CLI
- Cursor
- ChatGPT
- RTK

---

# Installed CLI Tools

| Tool | Status |
|------|--------|
| Git | ✅ |
| GitHub CLI | ✅ |
| GitHub Copilot CLI | ✅ |
| RTK | ✅ |
| rg | ✅ |
| fd | ✅ |
| jq | ✅ |
| bat | ✅ |
| delta | ✅ |

---

# KHWAMI Architecture

```text
KHWAMI
│
├── agents/
│   └── PERSONAL_AGENTS.md
│
├── instructions/
│   ├── global/
│   │   ├── copilot_instructions.md
│   │   ├── workflow.md
│   │   ├── prompting-guide.md
│   │   ├── search-strategy.md
│   │   ├── tool-selection.md
│   │   └── rtk-workflow.md
│   │
│   └── repository/
│       └── copilot_instructions-template.md
│
├── prompts/
│   ├── README.md
│   ├── TEMPLATE.md
│   │
│   ├── general-engineering/
│   │   ├── analysis.md
│   │   ├── planning.md
│   │   ├── bug-investigation.md
│   │   ├── code-review.md
│   │   ├── refactoring.md
│   │   ├── feature-implementation.md
│   │   ├── documentation.md
│   │   ├── architecture-review.md
│   │   ├── performance-review.md
│   │   └── testing.md
│   │
│   ├── programming-languages/
│   │   ├── javascript.md
│   │   └── typescript.md
│   │
│   └── technologies/
│       ├── react.md
│       ├── react-native.md
│       ├── nodejs.md
│       └── express.md
│
├── docs/
│   ├── README.md
│   ├── TEMPLATE.md
│   ├── repository-overview.md
│   ├── architecture.md
│   ├── feature-map.md
│   └── decisions.md
│
├── ROADMAP.md
└── WORKSPACE_STATE.md
```

---

# Completed Phases

## Phase 1 — Foundation

Status

Completed

Completed Items

- GitHub CLI
- GitHub Copilot CLI
- RTK
- CLI development tools
- Git configuration
- Delta configuration

---

## Phase 2 — AI Workflow Optimization

Status

Completed

Completed Items

- Personal AI Development Standards
- Advanced Global Copilot Instructions
- Repository Copilot Instructions Template
- AI Engineering Workflow
- AI Prompting Guide
- AI Search Strategy
- AI Tool Selection Guide
- RTK Workflow Guide

Do not repeat completed phases.

---

## Phase 3 — Prompt Library

Status

Completed

Objective

Create a reusable Prompt Library that standardizes AI-assisted software engineering tasks.

Completed Items

### Core

- Prompt Library README
- Prompt Template

### General Engineering

- Analysis
- Planning
- Bug Investigation
- Code Review
- Refactoring
- Feature Implementation
- Documentation
- Architecture Review
- Performance Review
- Testing

### Programming Languages

- JavaScript
- TypeScript

### Technologies

- React
- React Native
- Node.js
- Express

Deliverables

```text
prompts/
```

Prompt Library v1.0 is complete.

Do not repeat completed phases.

---

# Latest Completed Phase

## Phase 5 — KHWAMI Optimization

Status

Completed — capability work present; closure evidence remains partial for some tasks

Objective

Improve existing AI instructions, repository guidance, context usage, repository
understanding, token efficiency, documentation maintenance, and tooling
evaluation without repeating earlier phases.

---

# Roadmap

## Phase 4 — Repository Intelligence

Goal

Help AI understand repositories faster and more accurately by providing reusable repository intelligence documents that reduce unnecessary repository scanning, improve engineering context, and standardize project documentation.

### Core Tasks

- [x] repository-overview.md
- [x] architecture.md
- [x] feature-map.md
- [x] decisions.md

### Optional Extensions

Create only when they provide clear value for the repository.

- dependency-map.md
- glossary.md
- known-issues.md

Deliverables

```text
docs/
```

---

## Phase 5 — KHWAMI Optimization

Goal

Continuously improve KHWAMI.

Tasks

- [x] Improve AI instructions
- [x] Optimize repository guidance
- [x] Reduce unnecessary AI context
- [x] Improve repository understanding
- [x] Improve token efficiency
- [x] Standardize documentation maintenance
- [x] Evaluate additional AI tooling when beneficial

### Closure Reconciliation

Current Phase 5 output files demonstrate that the guidance, repository-boundary,
progressive-disclosure, and documentation-impact capabilities exist. The following
status distinctions remain: Improve AI instructions — PARTIAL; Optimize repository
guidance — VERIFIED; Reduce unnecessary AI context — VERIFIED; Improve repository
understanding — PARTIAL; Improve token efficiency — PARTIAL; Standardize
documentation maintenance — VERIFIED; Evaluate additional AI tooling when
beneficial — PARTIAL. The tooling evaluation process exists, but no specific tool
has been evaluated or adopted.

---

## Phase 6 — Evidence-Based Advanced Workflow Selection

Status

Deferred / Waiting for Evidence

Goal

Consider advanced AI capabilities only when a documented recurring workflow
problem is not adequately handled by the Phase 1–5 baseline.

Current state

No confirmed recurring workflow gap currently exists. No advanced capability is
approved for adoption, and no specific advanced tool has been evaluated.

Deferred candidates

The following are future considerations, not implementation tasks:

- MCP
- Agent Skills
- Graphify
- Local AI workflow
- AI automation
- Knowledge graph
- Repository templates
- Additional prompt-engineering infrastructure

Activation condition

Documented workflow gap → define the required capability → evaluate only relevant
candidates → adopt, defer, or reject based on evidence.

Deferred candidates must not be evaluated or implemented until the activation
condition is satisfied.

---

## Phase 6.5 Project Milestone — Documentation Status Only

Status

Option C selected — documentation/status milestone only

Meaning

Phase 6.5 records the selected Architecture Baseline + Phase 6.5 Project
Milestone decision. Architecture Baseline is a non-restrictive documentation/
status term limited to the F-01-supported findings and is not the pre-approval
baseline used by workflow Change Detection. Phase 6 remains deferred, and this
milestone does not activate Phase 6.

Architecture Frozen is not declared. This milestone does not create a new
capability phase, governance phase, approval path, freeze authority,
Candidate → Frozen transition, or exception/unfreeze mechanism.

---

# Milestones

| Milestone | Status |
| ------------------------- | ------ |
| KHWAMI Foundation | ✅ |
| AI Workflow Optimization | ✅ |
| Prompt Library | ✅ |
| Repository Intelligence | ✅ |
| KHWAMI Optimization | ✅ |
| Architecture Baseline + Phase 6.5 Project Milestone | Documentation/status only; Phase 6 remains deferred |
| Advanced AI Engineering | ⬜ |

---

# AI Rules

When continuing this roadmap:

- Never repeat completed phases.
- Continue from the current phase.
- Prefer improving workflows before introducing new tools.
- Avoid unnecessary dependencies.
- Keep documentation synchronized.
- Maintain a single source of truth.
- Prefer reusable assets over one-off solutions.
- Design documentation to be technology-agnostic whenever possible.
- Consider token efficiency in every recommendation.
- Prefer `rg` for repository search.
- Prefer `fd` for file discovery.
- Prefer `bat` for reading files.
- Prefer `jq` for JSON inspection.
- Prefer `delta` for Git review.
- Use RTK when working with large repositories or lengthy terminal output.

---

# Progress

```text
Phase 1

██████████ 100%

Phase 2

██████████ 100%

Phase 3

██████████ 100%

Phase 4

██████████ 100%

Phase 5

██████████ 100%

Phase 6

□□□□□□□□□□ 0%
```

---

# Next Chat

Phase status

**Phase 5 — KHWAMI Optimization is complete.**

Assume:

- Phase 1 is complete.
- Phase 2 is complete.
- Phase 3 is complete.
- Phase 4 is complete.
- Phase 5 is complete.
- All workflow documentation already exists.

Current state

The Phase 5 capability work is complete with documented closure limitations. Phase
6 is separately scoped but remains deferred: no confirmed recurring workflow gap
exists, no advanced capability is approved, and deferred candidates are not
implementation tasks. Do not begin Phase 6 evaluation or implementation until
the activation condition is satisfied.

Do not restart the roadmap.

Continue building on KHWAMI.

---

# End of Document