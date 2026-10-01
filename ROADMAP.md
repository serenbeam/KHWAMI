# KHWAMI Roadmap

> Last Updated: 2026-09-30
> Version: 3.5
> Roadmap Status: Phase 9 — CLI Architecture & Design complete; Phase 10 — CLI MVP Implementation next / not started
> Capability Status: Phase 6 advanced capability inactive / deferred

---

# Purpose

This document is the single source of truth for the KHWAMI roadmap and phase
plan.

It records:

- Phase objectives and deliverables.
- Completed phase history.
- Milestone progression.
- Future phase direction.
- Concise phase-level boundaries and completion outcomes.

---

# Scope

This roadmap covers KHWAMI's planned and completed phases, associated
deliverables, milestone progression, and future direction.

It does not own:

- Current operational state or continuation instructions.
- Current environment or installed-tool records.
- KHWAMI governance policy.
- Workflow integration, lifecycle, orchestration, or CLI architecture.
- Repository structure or repository-intelligence inventory.

Those responsibilities belong to separate authorities:

- `WORKSPACE_STATE.md` — current operational state, objective, environment,
  priorities, decisions, and continuation instructions.
- `KHWAMI_OPERATING_CONTRACT.md` — KHWAMI governance policy.
- `KHWAMI_WORKFLOW_CONTROL.md` — workflow integration, lifecycle,
  orchestration, and CLI architecture.
- `docs/` — repository structure and repository-intelligence records.

The roadmap may summarize a phase boundary or completion outcome, but it does
not reproduce the detailed content owned by those documents.

---

# Phase Plan and History

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

---

## Phase 3 — Prompt Library

Status

Completed

Objective

Create a reusable Prompt Library that standardizes AI-assisted software
engineering tasks.

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

---

## Phase 4 — Repository Intelligence

Status

Completed

Goal

Help AI understand repositories faster and more accurately by providing
reusable repository-intelligence documents that reduce unnecessary repository
scanning, improve engineering context, and standardize project documentation.

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

Status

Completed with documented closure limitations

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
progressive-disclosure, and documentation-impact capabilities exist. The
following status distinctions remain: Improve AI instructions — PARTIAL;
Optimize repository guidance — VERIFIED; Reduce unnecessary AI context —
VERIFIED; Improve repository understanding — PARTIAL; Improve token efficiency
— PARTIAL; Standardize documentation maintenance — VERIFIED; Evaluate
additional AI tooling when beneficial — PARTIAL. The tooling evaluation process
exists, but no specific tool has been evaluated or adopted.

---

## Phase 6 — Project/Milestone Closure and Advanced Capability Direction

### Project/Milestone Closure

Status

Complete — project/milestone work. Phase 6 advanced capability activation
remains inactive/deferred.

Latest Activated Capability

Phase 5 — KHWAMI Optimization

Objective

Record the completed Phase 6 project/milestone closure without activating any
advanced Phase 6 capability or changing the existing governance model.

### Advanced Capability Direction

Capability Activation

Inactive / Deferred — no deferred Phase 6 advanced capability has been
activated. Phase 8 Candidate 1 and Candidate 2 validation was separately scoped
evidence work and does not activate Phase 6 advanced capability.

Goal

Consider advanced AI capabilities only when a documented recurring workflow
problem is not adequately handled by the Phase 1–5 baseline.

Current Direction

No confirmed recurring workflow gap currently justifies activation. No deferred
Phase 6 advanced capability is approved for adoption or activated. Phase 8
Candidate 1 and Candidate 2 validation was separately scoped and is not an
advanced Phase 6 capability adoption.

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

Documented workflow gap → define the required capability → evaluate only
relevant candidates → adopt, defer, or reject based on evidence.

Deferred candidates must not be evaluated or implemented until the activation
condition is satisfied.

---

## Phase 6.5 — Documentation Status Only

Status

Option C selected — documentation/status milestone only.

Meaning

Option C = Architecture Baseline + Phase 6.5 Project Milestone. Architecture
Baseline was recorded as a non-restrictive documentation/status term limited to
the F-01-supported findings. It is distinct from the pre-approval baseline used
by workflow Change Detection.

Architecture Frozen was not declared. Phase 6.5 does not activate the Phase 6
capability and is distinct from the completed Phase 6 project/milestone closure.
Phase 6 advanced capability activation remains inactive/deferred.

This historical milestone created no new governance, capability activation,
freeze/unfreeze authority, approval mechanism, or Candidate → Frozen transition.
Detailed Option C rationale remains recorded in `docs/decisions.md`.

---

## Phase 7 — Repository Structure Audit

Status

COMPLETE

Outcome

The repository structure audit and final verification were completed. Repository
structure was adequate, semantic ownership was preserved, duplicate authority was
not identified, and no structural refactoring was required. Documentation
maintenance remained possible but non-structural. The future CLI remains a
presentation/input boundary, and Phase 7 introduced no additional workflow,
governance, or state authority. CLI implementation was not present.

---

## Phase 8 — Candidate 1 and Candidate 2 Workflow Validation

Status

COMPLETE — final evidence assessment sufficient

Evidence Outcome

- Candidate 1: PASS
- Candidate 2: PASS
- Repeatability: ESTABLISHED through Candidate 2
- Usability evidence: ESTABLISHED
- Functional validation: PASS
- Phase 9 decision gate: REACHED at Phase 8 completion

Workflow-Fidelity Finding

- Initial ADOPT behavior required clarification.
- Separate-repository work required additional context, with cross-repository
  friction observed as LOW TO MODERATE.
- This remains an improvement area for workflow fidelity and does not invalidate
  the Phase 8 result.

Phase 8 validates the two candidates through bounded application tasks. It is
workflow-validation evidence, not CLI implementation or architecture authority.

---

## Phase 9 — CLI Architecture & Design

Status

COMPLETE — READY FOR PHASE 10

Subphases

- Phase 9.1 — CLI Requirements from Phase 8: COMPLETE
- Phase 9.2 — CLI Boundary and Responsibilities: COMPLETE
- Phase 9.3 — Context, Target, and Initialization: COMPLETE
- Phase 9.4 — CLI Interaction and Workflow Flow: COMPLETE
- Phase 9.5 — CLI Output and User Interaction: COMPLETE
- Phase 9.6 — CLI Architecture: COMPLETE
- Phase 9.7 — CLI MVP Scope: COMPLETE
- Phase 9.8 — CLI Architecture Consistency Review: COMPLETE
- Phase 9.9 — Phase 9 Final Assessment: COMPLETE

Final Assessment

Phase 9 is COMPLETE and READY FOR PHASE 10. It derived CLI requirements from
Phase 8, defined the CLI architecture and boundaries, established the MVP scope,
and completed the architecture consistency review and final assessment.

Detailed workflow integration, lifecycle, orchestration, authority, and CLI
architecture remain defined in `KHWAMI_WORKFLOW_CONTROL.md`. This roadmap records
Phase 9's outcome and implementation readiness; it does not create a competing
authority or architecture.

CLI implementation is not present.

MVP Scope

Phase 9 defined the CLI MVP scope and exclusions for Phase 10. The authoritative
CLI architecture and detailed MVP boundary remain defined in
`KHWAMI_WORKFLOW_CONTROL.md`.

---

# Future Phase Direction

## Phase 10 — CLI MVP Implementation

Status

NEXT / NOT STARTED

Objective

Implement the CLI MVP based on the approved Phase 9 architecture without
changing KHWAMI governance, the authority hierarchy, or the established
workflow lifecycle.

Implementation Boundary

Phase 10 implementation choices must remain subordinate to the approved Phase 9
design and authoritative workflow documents.

Phase 10 must not:

- reinterpret KHWAMI governance;
- create a second workflow authority or state machine;
- weaken Permission or Approved Scope, or merge Review with Permission;
- make the CLI authoritative for execution, validation, or Terminal Result;
- allow silent target or scope expansion, including through external tools;
- silently select another repository;
- permit pre-Permission side effects;
- silently repair validation failures;
- activate deferred Phase 6 capabilities without a separate decision; or
- declare Architecture Frozen.

---

# Milestones

| Milestone | Status |
| ------------------------- | ------ |
| KHWAMI Foundation | ✅ |
| AI Workflow Optimization | ✅ |
| Prompt Library | ✅ |
| Repository Intelligence | ✅ |
| KHWAMI Optimization | ✅ |
| Architecture Baseline + Phase 6.5 Project Milestone | Recorded; documentation/status only; Phase 6 capability remains inactive/deferred |
| Phase 6 Project/Milestone Closure | ✅ |
| Advanced AI Engineering | Inactive / deferred — activation condition not satisfied |
| Phase 7 — Repository Structure Audit | ✅ Complete |
| Phase 8 — Candidate 1 and Candidate 2 Workflow Validation | ✅ Complete — final evidence assessment sufficient |
| Phase 9 — CLI Architecture & Design | ✅ Complete — ready for Phase 10 |
| Phase 10 — CLI MVP Implementation | Next / not started |

---

# Roadmap Rules

When maintaining this roadmap:

- Do not repeat completed phases as new work.
- Continue from the documented phase direction.
- Preserve historically meaningful phase outcomes and boundaries.
- Record phase objectives, deliverables, and milestone changes here.
- Reference authoritative governance, workflow, architecture, and repository-
  intelligence documents instead of duplicating their detailed content.
- Keep the roadmap distinct from current operational state and continuation
  instructions.

---

# Current State Reference

Current operational state, objective, focus, environment, decisions, and
continuation instructions are maintained only in `WORKSPACE_STATE.md`. The
state file is an operational snapshot, not a second phase plan.

---

# End of Document
