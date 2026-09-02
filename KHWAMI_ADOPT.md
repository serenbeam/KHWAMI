# KHWAMI ADOPT

Status: Architectural Contract

This document defines the KHWAMI ADOPT workflow. It is subordinate to:

1. `KHWAMI_OPERATING_CONTRACT.md`;
2. the finalized KHWAMI 3A Context Detection and Interactive Flow
   architecture; and
3. the finalized `KHWAMI_CREATE.md` contract.

Those authorities own the shared context, permission, scope, execution,
validation, termination, and safety rules. This document defines only the
ADOPT-specific analysis and proposal workflow.

ADOPT does not implement the KHWAMI CLI, application code, repository changes,
or a competing state machine.

---

## Purpose

ADOPT defines how KHWAMI analyzes an already meaningful existing project and
identifies only changes relevant to the developer's current objective.

The workflow is analysis-first and preservation-first. Existing work is the
subject of analysis and protection, not raw material for an automatic rewrite.

---

## Definition

`ADOPT` means KHWAMI is working with an already meaningful existing project and
must first understand, preserve, and explicitly scope that existing work before
proposing any changes.

An existing project is meaningful when observable evidence shows coherent
implementation, project knowledge, project decisions, or established
conventions. Relevant evidence may include:

- source code and application entry points;
- domain or feature modules;
- tests connected to implementation;
- meaningful configuration or platform setup;
- coherent project documentation;
- project-specific instructions and conventions;
- dependency and build configuration; or
- substantive implementation history.

ADOPT does not mean:

- rewriting the project;
- replacing the existing architecture;
- assuming ownership of everything in the repository;
- automatically refactoring discovered problems;
- treating repository presence as permission;
- treating “adopt this project” as execution permission; or
- silently converting the project into a CREATE workflow.

An observed problem is evidence for analysis. It is not automatically a change
request.

---

## CREATE vs ADOPT Boundary

```text
CREATE
New project or workspace establishment.

ADOPT
Existing meaningful project analysis and controlled evolution.
```

| Concern | CREATE | ADOPT |
| --- | --- | --- |
| Primary objective | Establish a new, clearly bounded target | Understand and safely evolve an existing meaningful target |
| Starting condition | New or safely bounded target after 3A resolution | Meaningful existing implementation or project knowledge after 3A resolution |
| Default posture | Plan the minimum required project shape | Preserve existing decisions and conventions |
| Main analysis | Intent, requirements, project shape, and creation proposal | Discovery, project understanding, reconciliation, architecture assessment, and scoped change proposal |
| Main risk | Replacing or overwriting existing work while creating | Unnecessary restructuring or treating all discovered issues as scope |

An empty or metadata-only directory is not automatically ADOPT. Metadata such
as `.git/`, a README, a package manifest, a lockfile, or an empty configuration
file does not by itself establish a meaningful existing project.

Meaningful implementation discovered during CREATE may require the 3A context
rules to reassess the target. That does not silently make the project ADOPT.

ADOPT must not silently become CREATE. If the developer actually wants a
separate new project, a new application boundary, or replacement of existing
work, the target and intent must be resolved through 3A before ADOPT continues.

If the ADOPT target boundary changes materially, ADOPT must return to the
applicable 3A context rules. It must not silently follow the new boundary or
reinterpret the request.

---

## Entry Conditions

ADOPT may begin only after valid 3A context resolution.

All of the following conditions are required:

1. The finalized 3A flow has been entered.
2. Context has resolved to `ADOPT` through valid detection or the required
   `[Adopt]` context selection.
3. The target boundary is known.
4. Meaningful existing implementation, project knowledge, or established
   project decisions are sufficiently evidenced for the selected target.
5. Material ambiguity affecting the target, requested objective, or safe scope
   has been resolved.
6. No execution permission has been inferred from context selection, the raw
   request, or the existence of the repository.
7. The session has not reached `3A FINISH`.

The ADOPT-specific `ADOPT_ANALYSIS` stage begins only after these conditions
are satisfied. `ADOPT_ANALYSIS` is an ADOPT-owned stage; it is not a new 3A
state.

ADOPT must not begin directly from:

- a raw user request without context detection;
- a context-selection response using `y` or `n`;
- an execution-permission response;
- an unbounded repository scan; or
- a target whose relationship to existing meaningful work is unresolved.

If meaningful evidence is not sufficient, the workflow must remain in the
applicable 3A context path until the context is resolved. ADOPT must not infer
its own default from uncertainty.

---

## Workflow Overview

The following is the ADOPT branch inside the finalized 3A workflow. The
ADOPT-specific stages remain subordinate to the 3A controller.

```text
3A CONTEXT_DETECTION / 3A CONTEXT_SELECTION
                    ↓
ADOPT_ANALYSIS
                    ↓
ADOPT PROJECT DISCOVERY
                    ↓
ADOPT PROJECT UNDERSTANDING
                    ↓
ADOPT REQUIREMENT / INTENT RECONCILIATION
                    ↓
ADOPT ARCHITECTURE ASSESSMENT
                    ↓
ADOPT CHANGE IDENTIFICATION
                    ↓
3A PROPOSAL
  └── ADOPT INTERACTIVE REVIEW
                    ↓
3A CHANGE_DETECTION
          ├── 3A NO_CHANGE
          └── 3A PERMISSION
                    ↓
3A EXECUTION
                    ↓
3A VALIDATION
                    ↓
3A FINISH
```

The `3A ...` states in this flow remain owned by 3A. The unprefixed ADOPT
stages are responsibilities of this document.

ADOPT-specific concerns are handled within the ADOPT stages and the existing
proposal, approved-scope, permission, execution, validation, and termination
mechanisms; they do not add to the 3A state model.

---

## ADOPT Discovery

ADOPT discovery is read-only, incremental, and proportional to the requested
objective.

The purpose of discovery is to establish what exists, how it works, what
conventions it follows, what is currently changing, and what information is
needed to evaluate the developer's request safely.

### Permitted discovery

Where relevant, KHWAMI may inspect:

- repository structure;
- source code;
- application entry points;
- domain, feature, and shared modules;
- package manifests;
- lockfiles;
- runtime and build configuration;
- platform configuration;
- tests and test configuration;
- documentation;
- Git status and diffs;
- local Git history and branches;
- ignored and untracked files;
- repository-specific instructions;
- development environment information;
- dependency declarations;
- architecture evidence;
- data, state, and API flows; and
- established project conventions.

Discovery should begin with the most specific available project documentation,
then expand to relevant files and direct dependencies. It must stop when the
evidence is sufficient for the current objective.

### Discovery restrictions

During discovery, KHWAMI must not:

- create, update, rename, or delete project files;
- stage or commit changes;
- reset, revert, or discard Git state;
- switch branches over user work;
- install or update dependencies;
- modify configuration;
- rewrite architecture;
- contact external services;
- execute project commands with unapproved project-side effects; or
- collect unrelated repository or environment information.

Local inspection is not permission to modify the project or external systems.

### Discovery record

The analysis should retain a concise evidence record containing, where
relevant:

```text
Target boundary:
Repository boundary:
Existing implementation:
Existing documentation:
Existing conventions:
Current user changes:
Untracked or ignored material:
Relevant constraints:
Architecture evidence:
Testing and build evidence:
External integrations:
Unknowns:
Risks:
```

The record should identify the source and status of each material observation.
It must not represent an assumption as an observed fact.

---

## Existing Work Protection

Existing work protection is a primary ADOPT responsibility.

Before recommending or executing any change, KHWAMI should identify:

- existing implementation;
- active user changes;
- uncommitted changes;
- untracked files;
- important configuration;
- project conventions;
- current architecture;
- files that should remain untouched;
- generated or environment-specific artifacts;
- potentially fragile areas; and
- high-risk or irreversible areas.

KHWAMI must preserve existing work unless an exact change is explicitly
proposed and approved.

### Existing user changes

ADOPT must treat current user changes as protected input. It must not assume
that uncommitted work is disposable or that a modified file can be safely
replaced.

Before execution, the shared KHWAMI controls require a current baseline and a
re-check of the approved scope. If an approved change conflicts with an
existing user modification, KHWAMI must stop and report the conflict.

KHWAMI must never:

- reset user changes;
- revert user changes;
- check out over user changes;
- discard user changes; or
- overwrite unrelated modifications.

### Existing problems

ADOPT must not assume that:

- old code is disposable;
- uncommitted changes are safe to overwrite;
- generated files can be deleted;
- a refactor is automatically desirable; or
- an architectural inconsistency authorizes correction.

An existing problem may be recorded as:

```text
Observation
Risk or consequence
Relationship to the current objective
Possible future action
```

It becomes an executable recommendation only when it is relevant to the
current objective, sufficiently understood, and explicitly included in the
proposal.

---

## Project Understanding

ADOPT must build a structured understanding of the project before proposing
changes.

The understanding should include only the areas relevant to the developer's
objective, but may contain the following categories where applicable:

```text
Project Identity
Purpose
Current Architecture
Technology Stack
Project Structure
Major Features
Data / State Flow
External Integrations
Testing Strategy
Build / Deployment
Documentation
Development Conventions
Known Constraints
Existing User Changes
Risks
Unknowns
```

### Evidence classification

Every material conclusion should be distinguishable by source and confidence.

| Classification | Meaning | Required treatment |
| --- | --- | --- |
| Observed fact | Directly supported by inspected files, configuration, behavior, or local repository evidence | State the evidence and avoid broadening it beyond what was observed |
| Developer-stated requirement | A current objective or constraint explicitly supplied by the developer | Preserve the stated intent and identify conflicts with existing reality |
| Evidence-derived information | A conclusion supported by multiple relevant observations | Label it as derived rather than user-stated |
| Assumption | A bounded interpretation used because evidence or requirements are incomplete | State it explicitly and request confirmation when material |
| Unresolved decision | A choice that can materially alter scope, architecture, or safety | Ask, defer, or mark `REVIEW`; do not execute it |
| Recommendation | A proposed action based on the analysis | Keep it separate from existing facts and permission |

Inferred architecture must not be presented as confirmed fact. If architecture
cannot be established from available evidence, ADOPT must report the unknown
and limit the recommendation accordingly.

### Understanding output

The project-understanding result should make clear:

- what the project appears to do;
- what is confirmed versus inferred;
- how the major areas relate;
- which decisions already exist;
- which conventions should be preserved;
- what the developer is asking for now;
- which requirements are already satisfied;
- which requirements are missing or conflicting; and
- which risks or unknowns affect the proposal.

---

## Intent / Requirement Reconciliation

ADOPT must compare the developer's current request against the existing project
rather than treating the request as an instruction to replace current reality.

The reconciliation should identify:

- what the developer wants now;
- what already exists;
- what can be reused;
- what is already satisfied;
- what conflicts with the request;
- what requirements are missing;
- what assumptions are necessary;
- what must change; and
- what must remain unchanged.

### Reconciliation sequence

```text
Current developer intent
        ↓
Existing project evidence
        ↓
Existing requirements and constraints
        ↓
Satisfied and unsatisfied areas
        ↓
Conflicts and unknowns
        ↓
Bounded change objective
```

The current request does not automatically override:

- existing project constraints;
- established architecture;
- platform limitations;
- security or compliance requirements;
- repository conventions;
- active user changes; or
- the approved-scope rules.

If the request conflicts materially with the existing project, KHWAMI must
explain:

1. what already exists;
2. what the developer appears to want;
3. why the signals conflict;
4. which options are available; and
5. what each option would preserve or change.

A proposal must not be generated until the conflict is resolved or explicitly
represented as an unresolved `REVIEW` item that prevents execution.

### Reuse and preservation

ADOPT should prefer:

```text
KEEP existing valid work
        ↓
UPDATE or adapt a bounded existing area
        ↓
CREATE only a justified missing artifact
```

Semantic equivalence takes precedence over canonical filenames. An existing
document, module, configuration file, or convention should be reused when it
serves the required role adequately.

ADOPT must not create duplicate documentation, rename valid files merely to
match a preferred naming convention, or restructure the project merely to make
it resemble a generic KHWAMI layout.

---

## Architecture Assessment

ADOPT should understand the current architecture before recommending any
modification.

Assessment may include, where relevant:

- current architectural pattern;
- responsibility boundaries;
- module and package relationships;
- dependency direction;
- state management;
- data flow;
- API integration;
- persistence;
- navigation;
- platform-specific concerns;
- configuration boundaries;
- testing structure;
- deployment and build flow;
- technical debt;
- fragile areas; and
- architectural risks.

The assessment must describe the current project before describing a proposed
change.

### Assessment principles

Do not recommend a refactor merely because another design could be cleaner.
Recommendations must be justified by one or more of:

- the current developer objective;
- an observable project problem;
- a measurable or material risk;
- maintainability impact;
- compatibility requirements;
- an explicit project constraint; or
- a validation or operational requirement.

The assessment must preserve valid existing project decisions even when they
differ from generic KHWAMI preferences.

### Architecture recommendations

When a change is justified, the proposal should explain:

```text
Current responsibility or relationship:
Observed limitation or requirement:
Proposed bounded change:
Preserved architecture:
Expected benefit:
Compatibility impact:
Risk:
Validation:
```

An architecture concern without a justified current objective should remain an
observation or future recommendation rather than an executable change.

---

## Change Identification

ADOPT must use the KHWAMI operating vocabulary:

```text
KEEP
UPDATE
CREATE
RENAME
DELETE
REVIEW
```

- `KEEP` — existing work remains unchanged.
- `UPDATE` — modify an existing bounded file or scope.
- `CREATE` — add a new artifact that is justified by the current objective.
- `RENAME` — rename an existing artifact; this may be destructive.
- `DELETE` — remove an existing artifact; this is destructive.
- `REVIEW` — an unresolved decision or uncertain action that is not executable.

`CREATE` must never be used as a synonym for replacing existing
implementation.

### Change record

Every executable change should identify:

```text
Action:
Path or scope:
Current state:
Proposed state:
Purpose:
Reason:
Expected impact:
Risk:
Dependencies:
Destructive: yes/no
External: yes/no
Validation:
```

The current and proposed states must be concrete enough for the developer to
understand the difference before permission.

### KEEP and REVIEW

`KEEP` is an explicit preservation result, not an execution operation.

`REVIEW` is not an incomplete permission request. It means KHWAMI cannot safely
determine or execute the action without clarification or a separate decision.
A proposal containing unresolved executable decisions must not proceed to
permission until those decisions are resolved or excluded.

---

## Scope Control

ADOPT must avoid scope explosion.

A discovered issue does not automatically become part of the current proposal.

```text
Observed issue       ≠ automatic fix
Technical debt       ≠ automatic refactor
Outdated dependency  ≠ automatic upgrade
Lint error           ≠ automatic cleanup
Architecture concern ≠ automatic rewrite
```

Only changes relevant to the current developer objective should enter the
proposal unless the developer explicitly expands the scope.

### Out-of-scope findings

Useful but unrelated findings should be reported separately as:

- observations;
- risks;
- deferred recommendations; or
- future work requiring a new objective.

They must not be hidden, but they must not be added to the executable change
set without explicit scope expansion.

### Scope expansion

If the developer explicitly expands the objective, ADOPT must revisit the
affected requirements, project understanding, architecture assessment, and
change identification. The proposal must show the new scope before permission.

A scope expansion that changes the target boundary or changes CREATE/ADOPT
meaning must return to the applicable 3A context rules. ADOPT must not silently
continue under a materially different interpretation.

---

## High-Risk Operations

Destructive, external, dependency-related, security-sensitive,
migration-related, irreversible, or otherwise high-risk characteristics are
proposal properties and approved-scope constraints.

They must be:

- explicitly identified in the proposal;
- associated with exact paths, targets, or operations where possible;
- explained in terms the developer can understand;
- included in the current approved scope only when explicitly shown; and
- governed by the existing Operating Contract and finalized 3A permission
  rules.

These characteristics do not create a separate ADOPT or 3A state.

Examples include:

- deleting or renaming project artifacts;
- changing architecture or public interfaces;
- changing migrations or persistent data;
- upgrading or removing dependencies;
- modifying security-sensitive configuration;
- changing external integrations;
- publishing, deploying, or changing remote resources; and
- changing Git history or repository state.

A local approval does not authorize an undisclosed external operation. A
proposal that contains both local and external actions must separate them.

If a high-risk operation is not sufficiently understood, it must be marked
`REVIEW` or excluded. KHWAMI must not create a new state to avoid resolving the
uncertainty.

---

## Proposal

The ADOPT proposal must describe the controlled difference between the current
project and the proposed result.

```text
Current State
      ↓
Proposed State
```

The proposal should include, where relevant:

- current project state;
- current developer objective;
- relevant existing architecture;
- requirements already satisfied;
- affected scope;
- proposed changes;
- preserved scope;
- assumptions;
- unresolved decisions;
- risks;
- destructive and external effects;
- dependency effects;
- implementation order; and
- validation plan.

### Proposal structure

A proportionate ADOPT proposal may use this structure:

```text
KHWAMI Adoption Analysis

Target: <path or boundary>
Objective: <current developer objective>

Existing Project
- Identity:
- Purpose:
- Architecture:
- Relevant conventions:
- Existing user changes:

Requirement Reconciliation
- Already satisfied:
- Missing:
- Conflicting:
- Assumptions:
- Unresolved:

Proposed Changes
UPDATE  <path> — <purpose>
CREATE  <path> — <purpose>
KEEP    <path> — <reason>
REVIEW  <decision> — <reason>

Preserved Scope
- ...

Validation
- ...

The proposal has not been executed.
```

The proposal must contain enough information for the developer to identify
exactly what will change and what will remain unchanged.

### Proposal quality

The proposal must not:

- disguise observations as approved changes;
- hide assumptions;
- omit a material risk;
- use a preferred KHWAMI filename as the sole reason for a change;
- include unrelated cleanup;
- imply permission through wording; or
- include an unbounded target.

A recommendation is not an execution authorization.

---

## Interactive Review

ADOPT must remain interactive after analysis and before permission.

The developer may:

- clarify the current objective;
- reject an assumption;
- modify scope;
- request another approach;
- select among material alternatives;
- remove proposed changes; or
- add explicitly requested changes.

The review must make clear:

- what KHWAMI detected;
- what already exists;
- what is being preserved;
- what is proposed to change;
- why the change is relevant;
- which assumptions remain;
- which decisions are unresolved;
- which risks exist; and
- how the result will be validated.

Proposal presentation and review feedback are not execution permission. The
shared 3A permission state must still follow proposal review and change
detection.

### Review changes

Material feedback requires proposal revision before permission. Material
feedback includes changes to:

- target boundary;
- requirements or objective;
- project scope;
- architecture;
- dependencies;
- affected files or operations;
- destructive or external effects;
- validation criteria; or
- execution order.

If a proposal was already approved, any material change invalidates that
approval. The revised proposal must go through the shared proposal,
change-detection, and permission controls again.

If feedback changes the target boundary or reveals that the selected context is
no longer appropriate, ADOPT must return to the applicable 3A context rules.
It must not silently become CREATE or continue under a different target.

---

## No-Change Condition

If the current project already satisfies the developer's requested objective
and no executable change is required, ADOPT must finish without requesting
permission.

```text
ADOPT Analysis Complete

No changes are required.

0 recommendations
0 files to create
0 files to update
0 files to rename
0 files to delete
0 files modified

KHWAMI finished.
```

No-change behavior is governed by the Operating Contract and 3A. ADOPT must
not:

- manufacture a change to produce a permission step;
- create placeholder documentation;
- ask for `y/yes` or `n/no` when there is nothing to execute;
- turn a no-change result into CREATE without a new context decision; or
- treat a `KEEP` finding as an executable change.

A material unresolved `REVIEW` item is not a successful no-change result. It
must be clarified, deferred, or reported as unresolved without permission.

---

## Execution

Execution remains governed by `KHWAMI_OPERATING_CONTRACT.md` and the finalized
3A workflow.

ADOPT may execute only the immediately preceding, explicit, approved proposal.

Before execution, the shared controls must verify:

- target boundary;
- current filesystem state;
- current Git state;
- pre-approval baseline;
- active user changes;
- approved change set;
- destructive and external scope;
- proposal identity and contents; and
- that the proposal has not materially changed.

### Execution restrictions

ADOPT execution must not:

- modify files outside the approved scope;
- overwrite unrelated user changes;
- expand scope silently;
- refactor unrelated code;
- rename files merely for convention;
- delete files merely because they are not preferred;
- perform external operations under local-file approval;
- install or upgrade dependencies unless the exact operation is explicitly
  treated and approved; or
- continue after an unexpected conflict.

If an unexpected artifact, user change, required operation, or scope difference
is discovered, KHWAMI must stop, preserve the original approved scope, report
the condition, and use the existing additional-proposal and permission rules
when further work is necessary.

ADOPT must not silently update the proposal while executing it.

Partial execution must be reported as partial. It must not be reported as a
successful adoption.

---

## Validation

Validation must confirm both the requested result and the preservation of
existing work.

Where applicable, validation should verify:

- requested changes were applied;
- proposed files and paths match the approved proposal;
- preserved files and project decisions remain intact;
- no unrelated files changed;
- architecture remains internally coherent;
- dependency declarations remain coherent;
- configuration remains consistent;
- applicable tests and checks pass;
- build, type, or static checks pass where relevant;
- documentation and internal references remain valid; and
- approved scope was respected.

Validation must be proportional to the change and project risk.

Unavailable or unrun checks must be reported as unavailable or not run. They
must not be reported as successful.

Validation failure must not automatically trigger repair. A repair requires:

```text
new analysis
→ new proposal
→ new permission
```

ADOPT may be reported as successful only when the applicable validation has
established success. Otherwise the final result must be reported as failed,
partially validated, blocked, or incomplete.

---

## Failure Handling

ADOPT must fail safely, preserve existing work, and expose uncertainty.

### Incomplete requirements

If the current objective or a material requirement is missing, KHWAMI must ask
for clarification or mark the matter unresolved. It must not invent a new
objective or propose unrelated work to fill the gap.

### Ambiguous request

If the request has multiple materially different interpretations, KHWAMI must
explain the interpretations and ask a focused question. “Adopt this project”
identifies a broad workflow but does not by itself define a change objective.

### Architecture conflict

If the request conflicts with an existing architecture or project constraint,
KHWAMI must show the conflict, alternatives, impact, and risk before proposing a
change. It must not silently rewrite the architecture.

### Unexpected existing work

If discovery reveals meaningful work outside the resolved target or contradicts
the selected boundary, KHWAMI must stop and return to the applicable 3A context
rules. It must not silently expand the target or switch to CREATE.

### Existing user changes

If a proposed change conflicts with an existing user change, KHWAMI must stop,
report the conflict, and request guidance. It must not reset, revert, discard,
or overwrite the user change.

### Untracked or ignored files

Untracked and ignored files may contain important user work or environment
configuration. They must be considered when relevant to the target and must
not be deleted or overwritten merely because they are not tracked.

### Execution conflict

If the approved proposal no longer matches the filesystem, Git state, or
protected user changes, execution must stop. The original approval must not be
stretched to cover the new condition.

### Execution failure

If execution fails, KHWAMI must:

- stop at the failure boundary;
- record completed and uncompleted operations;
- preserve unrelated work;
- avoid claiming successful adoption;
- avoid blindly retrying after the state changes; and
- require a new analysis and proposal for corrective or additional work.

KHWAMI must not perform an unapproved rollback, reset, cleanup, or replacement
merely because execution failed.

### Validation failure

If validation fails, KHWAMI must report the failed checks and affected scope.
It must not claim success or silently repair the result.

### Unsupported environment or tooling

If the environment cannot support the requested change or a required
validation step, KHWAMI must report the limitation. It must not silently change
the project shape, install tools, contact external services, or claim that an
unavailable check passed.

### External-operation requirement

If the objective requires an external operation, the operation must be
separately identified and handled under the Operating Contract. Local approval
for file changes does not authorize the external operation.

### No interactive response

If required input is unavailable, EOF is received, or a material decision
remains unresolved, KHWAMI must not choose a risky default. It must terminate,
remain blocked, or request clarification according to the shared 3A behavior.

---

## State Model

This section distinguishes the finalized 3A states used by ADOPT from the
ADOPT-specific stages contained within the 3A analysis and proposal path.

ADOPT must not add, rename, extend, or redefine a 3A state.

### 3A-owned states used by ADOPT

Only the following finalized 3A states are referenced by this contract:

| 3A state | Ownership and role |
| --- | --- |
| `3A CONTEXT_DETECTION` | Determines whether the target is CREATE, ADOPT, or AMBIGUOUS using the finalized context rules |
| `3A CONTEXT_SELECTION` | Collects the required `[Create]`, `[Adopt]`, or `[Esc]` context decision when necessary |
| `3A PROPOSAL` | Holds the explicit proposal and the ADOPT interactive review activity |
| `3A CHANGE_DETECTION` | Freezes the current change set and checks it against current project and user state |
| `3A NO_CHANGE` | Terminates the workflow without permission when no executable change is required |
| `3A PERMISSION` | Collects the shared case-insensitive `y/yes` or `n/no` decision for the current proposal |
| `3A EXECUTION` | Executes only the immediately preceding approved proposal |
| `3A VALIDATION` | Verifies the execution result and scope |
| `3A FINISH` | Produces the terminal result and ends the session |

`ADOPT_ANALYSIS` is an ADOPT-specific stage. It must not be represented as a
new 3A state unless a separately authoritative 3A architecture explicitly
defines that identifier.

### ADOPT-owned stages

| ADOPT stage | Responsibility | Required outcome |
| --- | --- | --- |
| `ADOPT_ANALYSIS` | Enter the ADOPT branch after valid context resolution | Bounded target and analysis objective |
| `ADOPT_PROJECT_DISCOVERY` | Inspect relevant repository, environment, and project evidence read-only | Evidence record |
| `ADOPT_PROJECT_UNDERSTANDING` | Describe identity, structure, architecture, conventions, constraints, risks, and unknowns | Structured project understanding |
| `ADOPT_REQUIREMENT_RECONCILIATION` | Compare the current developer objective with existing requirements and project reality | Satisfied, conflicting, missing, and preserved areas |
| `ADOPT_ARCHITECTURE_ASSESSMENT` | Evaluate current boundaries and risks without assuming a rewrite | Evidence-based architecture assessment |
| `ADOPT_CHANGE_IDENTIFICATION` | Select only objective-relevant KEEP, UPDATE, CREATE, RENAME, DELETE, or REVIEW results | Bounded recommendation set |
| `ADOPT_INTERACTIVE_REVIEW` | Present the proposal and incorporate developer feedback before permission | Current understandable proposal |

These stages are internal responsibilities of the ADOPT workflow. They do not
create competing permission, context-selection, approval, or execution rules.

### Valid ADOPT transitions

```text
3A CONTEXT_DETECTION / 3A CONTEXT_SELECTION
        ↓ resolved ADOPT context
ADOPT_ANALYSIS
        ↓
ADOPT_PROJECT_DISCOVERY
        ↓
ADOPT_PROJECT_UNDERSTANDING
        ↓
ADOPT_REQUIREMENT_RECONCILIATION
        ↓
ADOPT_ARCHITECTURE_ASSESSMENT
        ↓
ADOPT_CHANGE_IDENTIFICATION
        ↓
3A PROPOSAL / ADOPT_INTERACTIVE_REVIEW
        ↓ reviewed current proposal
3A CHANGE_DETECTION
        ├── 3A NO_CHANGE
        └── 3A PERMISSION
                ├── y/yes → 3A EXECUTION → 3A VALIDATION → 3A FINISH
                └── n/no  → 3A FINISH
```

If the target or workflow becomes ambiguous during an ADOPT stage, the flow
must return to the applicable 3A context rules rather than silently selecting a
new workflow.

If proposal feedback changes the target or material objective, the affected
ADOPT stages must be revisited before the proposal returns to 3A change
detection.

### Forbidden transitions

The following transitions are invalid:

```text
3A CONTEXT_DETECTION → 3A EXECUTION
3A CONTEXT_DETECTION → 3A PERMISSION
3A CONTEXT_SELECTION → 3A EXECUTION
3A CONTEXT_SELECTION → 3A PERMISSION
ADOPT_PROJECT_DISCOVERY → 3A EXECUTION
ADOPT_PROJECT_DISCOVERY → 3A PERMISSION
ADOPT_PROJECT_UNDERSTANDING → 3A EXECUTION
ADOPT_CHANGE_IDENTIFICATION → 3A EXECUTION
ADOPT_INTERACTIVE_REVIEW → 3A EXECUTION
ADOPT_INTERACTIVE_REVIEW → 3A VALIDATION
3A PROPOSAL → 3A EXECUTION
3A NO_CHANGE → 3A PERMISSION
3A NO_CHANGE → 3A EXECUTION
3A PERMISSION → 3A EXECUTION for any input other than y/yes
3A EXECUTION → additional unapproved execution
3A VALIDATION → automatic repair
3A FINISH → continuation within the same session
```

A new ADOPT analysis after `3A FINISH` requires a new applicable 3A flow. The
previous ADOPT state, target, proposal, and approval must not persist.

---

## Relationship with 3A and Operating Contract

### 3A owns

The finalized 3A architecture owns:

- context detection;
- CREATE, ADOPT, and AMBIGUOUS determination;
- context selection;
- target clarification;
- top-level navigation;
- anti-skip behavior;
- the separation between context selection and permission;
- `y/yes` and `n/no` permission semantics;
- approved-scope behavior;
- No-Change behavior;
- `Esc` behavior;
- session termination and re-analysis; and
- the shared execution and validation flow.

ADOPT references these responsibilities and does not redefine them.

### Operating Contract owns

`KHWAMI_OPERATING_CONTRACT.md` owns the universal rules for:

- analysis-only behavior;
- proposal classifications;
- explicit permission;
- approved scope;
- preservation of existing work;
- existing user-change protection;
- destructive operations;
- external operations;
- execution;
- validation; and
- reporting.

ADOPT applies these rules and does not create a separate policy.

### CREATE owns

`KHWAMI_CREATE.md` owns the CREATE-specific workflow, including:

- new-project intent discovery;
- CREATE requirements synthesis;
- project shape;
- CREATE proposal content;
- CREATE review;
- CREATE execution expectations; and
- CREATE validation expectations.

ADOPT must preserve the CREATE/ADOPT boundary and must not reuse CREATE as a
replacement or adoption mechanism.

### ADOPT owns

This document owns:

- existing-project discovery;
- project understanding;
- intent and requirement reconciliation;
- architecture assessment;
- change identification;
- scope interpretation;
- ADOPT proposal content;
- ADOPT interactive review content;
- ADOPT-specific execution expectations; and
- ADOPT-specific validation expectations.

---

## CLI Boundary

CLI behavior remains outside this contract.

A future CLI may:

- render ADOPT stages;
- collect user input;
- display project understanding;
- display current and proposed states;
- display proposals;
- show execution progress; and
- show validation results.

The CLI must call the shared state controller. It must not independently decide:

- CREATE versus ADOPT;
- permission;
- approved scope;
- execution authorization;
- validation success; or
- workflow transitions.

CLI presentation must not introduce a hidden permission prompt, hidden context
selection, automatic adoption, automatic restructuring, or automatic repair.

---

## Implementation Invariants

1. ADOPT requires valid 3A context resolution.
2. ADOPT requires a bounded target containing sufficiently evidenced meaningful
   existing project work or knowledge.
3. Empty or metadata-only targets are not automatically ADOPT.
4. Existing meaningful work is preserved by default.
5. ADOPT discovery is read-only.
6. Existing user changes are protected and are never silently overwritten.
7. Observed problems do not automatically become changes.
8. The current developer intent is reconciled against existing project reality.
9. Requirements, observed evidence, inferred information, assumptions, unknowns,
   and recommendations remain distinguishable.
10. Existing project decisions and conventions are preserved unless a relevant,
    evidence-based change is explicitly proposed.
11. Semantic equivalence is considered before creating, renaming, or duplicating
    project artifacts.
12. Scope does not expand silently.
13. A complete ADOPT analysis precedes the proposal.
14. The proposal precedes permission and execution.
15. Permission remains owned by 3A and the Operating Contract.
16. `y/yes` approves only the immediately preceding explicit proposal.
17. Material proposal changes invalidate previous approval.
18. Destructive, external, dependency-related, security-sensitive,
    migration-related, and other high-risk operations require explicit proposal
    treatment and approved scope.
19. No high-risk characteristic creates a new 3A state.
20. The No-Change Condition bypasses permission and creates no placeholder work.
21. Execution affects only the approved proposal.
22. Unexpected scope or conflicts stop execution.
23. Existing user changes are never reset, reverted, discarded, or silently
    overwritten.
24. Validation is required before claiming successful adoption.
25. Validation failure does not automatically trigger repair.
26. Unavailable validation checks are reported honestly.
27. ADOPT cannot silently become CREATE.
28. A target-boundary change returns to the applicable 3A context rules.
29. ADOPT cannot redefine, rename, extend, or add a 3A state.
30. ADOPT cannot skip any applicable ADOPT analysis stage or any applicable 3A
    proposal, change-detection, permission, execution, or validation stage. The
    applicable 3A path depends on whether the current proposal results in
    NO_CHANGE or an executable approved change.
31. The CLI remains a presentation and input boundary, not the owner of ADOPT
    policy or state transitions.
32. ADOPT state, proposal state, and approval do not persist after `3A FINISH`.
33. A new analysis requires a new applicable 3A flow.
34. This document does not define the ADOPT behavior of any other system and
    does not implement the CLI or application code.
