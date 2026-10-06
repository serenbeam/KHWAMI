# KHWAMI Roadmap

> Last Updated: 2026-10-01
> Version: 3.6
> Roadmap Status: Phase 9 — CLI Architecture & Design complete; Phase 10 — CLI MVP Implementation closed for the bounded MVP scope; Phase 10.1 through Phase 10.7 complete; actual executable ADOPT mutations remain future scope
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

At Phase 9 completion, CLI implementation was not present. Phase 10.1 now provides the minimal CLI project bootstrap and runtime boundary.

MVP Scope

Phase 9 defined the CLI MVP scope and exclusions for Phase 10. The authoritative
CLI architecture and detailed MVP boundary remain defined in
`KHWAMI_WORKFLOW_CONTROL.md`.

---

# Future Phase Direction

## Phase 10 — CLI MVP Implementation

Status

CLOSED — Phase 10.1 through Phase 10.7 complete for the bounded MVP scope; actual executable ADOPT mutations remain future scope

### Phase 10.1 — CLI Project Bootstrap & Runtime Boundary

Status

COMPLETE

Outcome

The Node.js/npm CLI project bootstrap and minimal CLI-to-Core runtime boundary
were implemented with plain JavaScript, zero third-party dependencies, and no
CLI framework. The CLI remains a presentation/input boundary; workflow
authority and lifecycle behavior remain unimplemented and governed by the
Phase 9 architecture.

### Phase 10.2 — CLI Input & Context Initialization

Status

COMPLETE

Outcome

The CLI now captures an optional target and explicit workflow-intent hint while
Core performs read-only target inspection and resolves CREATE, ADOPT, or
AMBIGUOUS. Ambiguous and conflicting evidence produces explicit clarification
without selecting a default workflow or executing any workflow.

### Phase 10.3 — Workflow Controller Integration

Status

COMPLETE

Outcome

A single stateless Core Workflow Controller now consumes the Phase 10.2 context
result and represents CREATE, ADOPT, or unresolved Context Resolution routing.
It does not reclassify evidence, execute workflows, own governance, or introduce
lifecycle state.

### Phase 10.4 — Proposal, Review & Permission Interaction

Status

COMPLETE

Outcome

The single Core Workflow Controller now represents bounded CREATE/ADOPT future
workflow proposals, preserves context and evidence, and interprets canonical
permission input as AUTHORIZED, REJECTED, or UNRESOLVED. The CLI presents the
proposal before permission, and Phase 10.4 stops without executing workflows.

### Phase 10.5 — Execution, Validation & Terminal Result Integration

Status

COMPLETE — bounded MVP scope

Outcome

Phase 10.5 provides Core-owned execution, validation, and Terminal Result
boundaries for the current MVP. Explicit resolved CREATE file actions execute
and validate successfully. ADOPT supports an authorized read-only Approved
Scope with blocked/non-mutating execution, unchanged-target validation, and a
non-success terminal result. Actual executable ADOPT mutations remain future
scope.

### Phase 10.6 — Error, Conflict & No-Change Handling

Status

COMPLETE

Outcome

The existing Workflow Controller now preserves bounded execution and validation
failure distinctions, blocks authorization/scope mismatches, propagates errors
through execution/validation/terminal results, and preserves the distinction
between blocked/unexecuted work and genuine No-Change. No retries, repair,
scope expansion, or invented CREATE/ADOPT actions were added. Blocked,
rejected, unresolved, and changed-target outcomes remain distinct from
successful execution and genuine No-Change.

### Phase 10.7 — MVP End-to-End Validation & Phase 10 Closure

Status

COMPLETE

Outcome

The complete bounded Phase 10 MVP was verified with the full test suite. CREATE
E2E behavior remains passing. ADOPT `yes` and `no` CLI E2E flows pass through
analysis, objective reconciliation, proposal, action derivation, Change
Detection, Approved Scope, Permission, blocked/read-only execution, validation,
and Terminal Result without mutating the target. Phase 10 is closed for the
bounded MVP scope; actual executable ADOPT mutations remain future scope.

### CREATE Analysis MVP — Pre-10.7 Prerequisite

Status

COMPLETE

Outcome

A read-only CREATE-specific analyzer now converts resolved CREATE context and
available evidence into a structured Analysis Result. Bounded collection accepts
project purpose, project type, and initial scope, then re-runs analysis without
inventing defaults. CREATE project-shape analysis now derives provenance-aware
application, platform, technology, runtime, organization, architecture,
dependency, testing, and documentation characteristics. Unsupported decisions remain unresolved and no execution actions are
invented; the bounded Phase 10 MVP is now validated through Phase 10.7.

### CREATE Proposal Generation — 10.5.3

Status

COMPLETE

Outcome

Completed CREATE Analysis Results now produce a structured, reviewable CREATE
proposal containing summary, provenance-aware REVIEW actions, preserved scope,
risks, dependencies, validation expectations, unresolved review items, and
readiness. Proposal generation does not perform Change Detection, create
Approved Scope, request permission, or execute.

### CREATE Executable-Action Derivation — 10.5.3.x

Status

COMPLETE — resolved-action prerequisite implemented

Outcome

Resolved concrete CREATE file decisions can now be classified as executable
proposal actions with bounded paths, content, status, and provenance. Technology
recommendations, generic project shape, missing content, unsupported actions,
and out-of-scope paths remain REVIEW_REQUIRED. No templates, dependencies, or
mutations are invented.

### Change Detection & Approved Scope — 10.5.4

Status

COMPLETE — bounded scope prerequisite

Outcome

Proposal-relevant baselines and current state can be captured and compared for
concrete action fixtures. NO_CHANGE can derive an exact Approved Scope after
valid authorization; material change, proposal mismatch, rejection, unresolved
permission, and scope mismatch fail closed. Execution remains owned by the
separate workflow execution boundaries.

### ADOPT Requirement / Objective Boundary

Status

COMPLETE — bounded read-only lifecycle prerequisite

Outcome

Resolved ADOPT context enters bounded read-only ADOPT Analysis and objective
reconciliation. Explicit objectives are distinguished from target evidence;
missing, broad, or conflicting objectives remain blocked/review-required. This
boundary does not itself generate proposals or execute workflow actions.

### ADOPT Proposal Generation

Status

COMPLETE — non-executable proposal boundary

Outcome

Grounded ADOPT requirement results now produce a non-executable proposal with
objective, relevant existing areas, evidence, preservation scope, proposed
change areas, risks, validation expectations, and unresolved review items.

### ADOPT Action Derivation

Status

COMPLETE — review-only, non-executable

Outcome

Grounded ADOPT proposals now produce bounded review candidate actions with
operation, target, purpose, rationale, evidence, provenance, and executable=false.
Missing/non-ready/conflicting proposals remain unresolved.

### ADOPT Change Detection & Approved Scope

Status

COMPLETE — bounded read-only scope

Outcome

Derived ADOPT actions now feed the shared Change Detection and Approved Scope
boundaries. Proposal-relevant baselines capture the analyzed target area,
material changes inside that area are detected, proposal identity conflicts and
out-of-scope actions fail closed, and a valid no-change result can establish a
bounded read-only ADOPT scope under the existing authorization contract.

### ADOPT Permission Integration

Status

COMPLETE — ordered canonical Permission for the bounded read-only lifecycle

Outcome

ADOPT reuses the existing Permission interaction only after review and a valid
bounded no-change scope. `y/yes` produces authorization bound to that scope,
while `n/no` or invalid/out-of-order scope input cannot authorize it. REVIEW
actions remain non-executable; authorized ADOPT scopes proceed through blocked
execution, unchanged-target validation, terminal results, and CLI E2E. Actual
executable ADOPT mutations remain future scope.

### CREATE Execution, Validation & Terminal Integration — 10.5.5

Status

COMPLETE — explicit resolved CREATE actions only

Outcome

The normal CREATE review flow can accept explicit resolved file path and content
decisions, derive a concrete CREATE action, establish Change Detection and
Approved Scope, execute only the authorized file action, validate its content,
and produce terminal SUCCESS. Review-only proposals remain blocked; no project
templates or implicit actions are generated. Phase 10.7 validated the bounded
Phase 10 MVP and closed the phase.

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
| Phase 10.1 — CLI Project Bootstrap & Runtime Boundary | ✅ Complete |
| Phase 10.2 — CLI Input & Context Initialization | ✅ Complete |
| Phase 10.3 — Workflow Controller Integration | ✅ Complete |
| Phase 10.4 — Proposal, Review & Permission Interaction | ✅ Complete |
| Phase 10.5 — Execution, Validation & Terminal Result Integration | ✅ Complete — bounded MVP scope |
| Phase 10.6 — Error, Conflict & No-Change Handling | ✅ Complete |
| CREATE Analysis MVP — Pre-10.7 Prerequisite | ✅ Complete — validated for Phase 10 closure |
| CREATE Project-Shape Analysis — 10.5.2 | ✅ Complete |
| CREATE Proposal Generation — 10.5.3 | ✅ Complete — proposal boundary; execution handled separately |
| CREATE Executable-Action Derivation — 10.5.3.x | ✅ Complete — resolved decisions only |
| Change Detection & Approved Scope — 10.5.4 | ✅ Complete — bounded scope prerequisite |
| CREATE Execution, Validation & Terminal Integration — 10.5.5 | ✅ Complete — explicit resolved CREATE actions only |
| ADOPT Analysis — Read-Only Prerequisite | ✅ Complete — analysis/objective boundary implemented |
| ADOPT Requirement / Objective Boundary | ✅ Complete — bounded read-only prerequisite |
| ADOPT Proposal Generation | ✅ Complete — non-executable proposal |
| ADOPT Action Derivation | ✅ Complete — review-only/non-executable |
| ADOPT Change Detection & Approved Scope | ✅ Complete — bounded read-only scope |
| ADOPT Permission Integration | ✅ Complete — bounded read-only lifecycle authorization |
| ADOPT Execution, Validation & E2E | ✅ Complete — blocked/read-only MVP scope |
| Phase 10.7 — MVP End-to-End Validation & Phase 10 Closure | ✅ Complete |
| Phase 10 — CLI MVP Implementation | ✅ CLOSED — bounded MVP scope; mutating ADOPT future scope |

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
