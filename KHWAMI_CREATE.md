# KHWAMI CREATE

Status: Architectural Contract

This document defines the KHWAMI CREATE workflow. It is subordinate to
`KHWAMI_OPERATING_CONTRACT.md` and the public unified workflow architecture in
`KHWAMI_WORKFLOW_CONTROL.md`.

`KHWAMI_OPERATING_CONTRACT.md` owns shared governance policy, including
Context Resolution, Permission, Approved Scope, termination, safety rules,
external-operation boundaries, destructive-operation boundaries, and no-change
behavior. `KHWAMI_WORKFLOW_CONTROL.md` owns unified workflow
integration/orchestration. This document defines only the CREATE-specific
workflow.

---

## Purpose

CREATE defines how KHWAMI helps establish a new project or workspace after the
KHWAMI context flow has determined that a new target is appropriate.

CREATE is an analysis-first, proposal-driven workflow. It transforms user
intent and verified project information into a proportionate project proposal,
then executes only the explicitly approved changes and validates the result.

CREATE does not implement the KHWAMI CLI, define application code, or define
the ADOPT workflow.

---

## Definition

`CREATE` means that KHWAMI is helping establish a new project or workspace for
a clearly identified target boundary rather than taking ownership of an already
established project.

A CREATE target may be:

- a genuinely empty directory;
- a metadata-only project container, when the target and intended operation are
  clear;
- a separate directory, repository, branch, or application boundary selected
  by the developer; or
- another explicitly bounded new project target approved through Context
  Resolution.

CREATE does not mean:

- replace the current project;
- delete existing files so a new project can be inserted;
- ignore meaningful implementation discovered during analysis;
- treat a request such as "create it" as execution permission; or
- bypass requirements analysis, proposal review, permission, or validation.

### CREATE and ADOPT

CREATE establishes a new target. ADOPT analyzes and preserves an already
meaningful existing project. The two workflows have different analysis goals
and must not be silently substituted for one another.

An empty directory does not automatically establish CREATE. The Context
Resolution rules must consider user intent, repository evidence, metadata,
meaningful implementation, conflicts, confidence, and target boundaries first.

Likewise, a CREATE decision does not authorize replacement of an existing
project. If meaningful existing implementation is discovered at the intended
target, KHWAMI must return to the Context Resolution clarification rules. A
separate boundary may be selected, or intentional replacement may be handled as
a separately identified destructive scope.

---

## Entry Conditions

CREATE may begin only when all of the following are true:

1. The session has entered the unified workflow.
2. Context Resolution has produced `CREATE`, or the developer has selected
   `[Create]` in the required Context Selection interaction.
3. The target boundary is known and does not silently imply replacement of
   meaningful existing work.
4. Any ambiguity that materially affects the target or workflow has been
   resolved through Context Resolution clarification.
5. No execution permission has been inferred from context selection or user
   language.
6. The session is still active and has not reached Terminal Result.

Context Resolution may select CREATE automatically when the evidence and target
are clear. It may also require an explicit `[Create]` selection when context is
ambiguous. Both are valid CREATE entry paths only when the governance
safeguards have passed.

CREATE must not begin directly from:

- a raw user request without Context Resolution;
- a Context Selection prompt answered with `y` or `n`;
- a permission response;
- a proposal that has not completed analysis; or
- a target whose relationship to meaningful existing work is unresolved.

### Reclassification boundary

CREATE must not silently switch to ADOPT. If CREATE-specific discovery finds
meaningful existing implementation, KHWAMI must:

1. stop CREATE-specific progression;
2. explain the newly discovered evidence;
3. identify the conflict with the selected CREATE target;
4. return to the applicable Context Resolution clarification path; and
5. wait for a new, explicit context decision if one is required.

The discovery result may be safely retained as evidence, but it must not
silently change the active workflow.

---

## Workflow Overview

The New Project Workflow is a branch inside the unified workflow architecture.
It does not replace or redefine the shared workflow lifecycle.

```text
Context Resolution / Context Selection
                    ↓
New Project Workflow Analysis
                    ↓
Intent Discovery
                    ↓
Context and Environment Discovery
                    ↓
Requirement Synthesis
                    ↓
Project Shape
                    ↓
Recommendation
                    ↓
Proposal
  └── Interactive Review
                    ↓
Change Detection
          ├── No-Change Outcome
          └── Permission
                    ↓
Execution
                    ↓
Validation
                    ↓
Terminal Result
```

The New Project Workflow stages are responsible for analysis and proposal
content. `KHWAMI_OPERATING_CONTRACT.md` remains authoritative for shared
governance policy, including navigation, anti-skip behavior, Permission,
Approved Scope, and termination. `KHWAMI_WORKFLOW_CONTROL.md` coordinates
Change Detection and the Execution and Validation handoffs. Destructive,
external, dependency-related, and other high-risk characteristics remain
proposal properties and approved-scope constraints; they do not create a new
workflow or state.

CREATE analysis is read-only. No project file, configuration, dependency, Git
state, or external resource may be changed before the shared Permission gate
has approved an explicit proposal.

---

## Intent Discovery

CREATE must understand enough of the requested project to produce a safe and
proportionate proposal.

Intent discovery should establish, where relevant:

- project purpose;
- intended users;
- application, service, library, or workspace type;
- target platform or deployment environment;
- core functionality;
- explicit scope and non-goals;
- technical and organizational constraints;
- preferred technology, when one exists;
- existing organizational conventions;
- deployment expectations;
- testing expectations;
- repository expectations;
- documentation expectations; and
- acceptance or completion expectations.

KHWAMI must not ask every possible question by default. It should ask only
questions whose answers can materially affect:

- target safety;
- project scope;
- architecture;
- technology selection;
- dependencies;
- security, compliance, or operational behavior;
- validation; or
- the proposed files and actions.

The developer may answer multiple questions together. KHWAMI should use
available evidence and established conventions to reduce unnecessary
interaction while keeping material uncertainty visible.

### What KHWAMI may safely infer

KHWAMI may infer a project fact when the inference is directly supported by
observable evidence and does not materially change the project decision. For
example, it may infer:

- the current target directory from the invocation location;
- the repository root from local repository metadata;
- available local tools from observable environment information;
- that a standard directory is unnecessary for a small project when the
  requirements do not need it; or
- that an existing placeholder file should be preserved rather than replaced.

An inference must be labelled as evidence-derived or proposed. It must not be
presented as a user requirement.

### What KHWAMI must ask

KHWAMI must ask when the missing information could materially change the safe
workflow or proposal. Examples include:

- the target boundary when the current location contains meaningful work;
- the intended project type when the request supports multiple materially
  different shapes;
- core requirements when no reliable project objective is available;
- a technology choice when several options have materially different effects;
- deployment or platform requirements that affect architecture;
- required integrations, data handling, or security constraints; and
- an unresolved destructive, external, or irreversible operation.

A request such as "go ahead" does not answer a material unanswered question
and does not authorize KHWAMI to guess.

### What requires explicit confirmation

KHWAMI must obtain explicit developer confirmation through the applicable
workflow interaction for:

- a material technology decision that was not already specified;
- a target boundary that could affect existing work;
- a material assumption that changes project scope or architecture;
- any destructive operation;
- any external operation;
- dependency installation or other operation beyond the displayed local file
  changes; and
- a proposal that has materially changed since it was last reviewed.

Confirmation of a proposal is not permission to execute it. Execution remains
controlled by the shared Permission state.

---

## Context & Discovery

CREATE may inspect the current environment and target before proposing changes.
Discovery is read-only and exists to establish feasibility and protect existing
work. It must not become an implicit ADOPT workflow.

### Permitted discovery

Where relevant, KHWAMI may inspect:

- the current working directory;
- the target boundary and repository root;
- existing files and directories;
- hidden and untracked files;
- repository metadata;
- local Git status, diffs, and history;
- package manifests and lockfiles;
- available package managers and development tools;
- local runtime information;
- build, platform, and test configuration;
- repository-specific instructions and conventions; and
- existing project documentation.

The inspection should be incremental and proportional to the requested
project. KHWAMI should not scan unrelated repositories or collect unnecessary
context.

### Discovery restrictions

During discovery KHWAMI must not:

- create a project directory;
- create a package manifest or lockfile;
- initialize, switch, reset, or modify Git state;
- install dependencies;
- modify configuration;
- contact external services;
- change a branch or repository;
- overwrite a placeholder or user file; or
- execute application creation commands.

Reading local environment information does not authorize external operations.
If required information is unavailable locally, KHWAMI must report the
uncertainty and ask for clarification or separate approval where applicable.

### Existing material boundary

Metadata such as `.git/`, a README, a package manifest, a lockfile, or an
empty configuration file does not by itself establish a meaningful existing
project. Such material must nevertheless be preserved and included in the
proposal if it may be affected.

If discovery finds source code, application entry points, domain modules,
connected tests, meaningful platform configuration, coherent project
knowledge, or other meaningful implementation at the target, CREATE must not
pretend that the target is blank. The result must be handled using the Context
Resolution rules.

If the new project target is explicitly separate from an existing host
repository, CREATE may continue for the new target while clearly displaying:

```text
Host context: <existing repository or workspace>
CREATE target: <separate directory, branch, or application boundary>
Preserved host material: <relevant existing work>
```

---

## Requirement Synthesis

KHWAMI must transform the discovered intent into a structured project
understanding before creating a proposal.

```text
User Intent
     ↓
Requirements
     ↓
Constraints
     ↓
Assumptions
     ↓
Unresolved Decisions
     ↓
Project Proposal
```

### Requirement categories

| Category | Meaning | Treatment |
| --- | --- | --- |
| Explicit requirement | Directly stated by the developer or an authoritative project source | Preserve the original meaning and mark the source |
| Evidence-derived requirement | Supported by observable environment or repository evidence | Label as derived; do not present it as user-stated |
| Constraint | A limitation affecting scope, architecture, tooling, platform, operations, or validation | Display its source and impact |
| Assumption | A bounded interpretation used because information is unavailable | State it explicitly and request confirmation when material |
| Unresolved decision | A choice that can materially change the proposal or safety | Do not hide it; ask, defer, or mark the proposal `REVIEW` |

Requirements must not be invented to make a proposal look complete. If a
required decision remains unknown, KHWAMI must either ask the developer or
produce a proposal that clearly excludes the unresolved area.

### Synthesis procedure

KHWAMI should:

1. capture the user's stated objective and requested boundaries;
2. separate project goals from implementation preferences;
3. identify observable constraints and available environment capabilities;
4. distinguish explicit requirements from evidence-derived conclusions;
5. record assumptions and their consequences;
6. identify conflicts or missing material information;
7. ask only the questions required to resolve material uncertainty; and
8. produce a concise project understanding for proposal review.

A synthesized requirement is not automatically confirmed merely because it is
reasonable. The proposal must show whether each material item is explicit,
evidence-derived, assumed, or unresolved.

---

## Project Shape

After requirement synthesis, KHWAMI determines the minimum project shape needed
to satisfy the known requirements.

Project shape may include, where relevant:

- project type;
- target platform or runtime;
- application or service boundaries;
- initial modules or features;
- architecture direction;
- project structure;
- technology options and selected direction;
- dependency strategy;
- development conventions;
- testing approach;
- documentation set; and
- initial implementation sequence.

The project shape must be proportional to the project. A small project should
not receive an enterprise structure without evidence that the complexity is
needed. A project with unresolved requirements should not receive a falsely
precise architecture.

### Technology decisions

KHWAMI may use a developer-specified technology when it is compatible with the
requirements and environment. When technology is not specified, KHWAMI may
recommend an option only when the requirements and constraints provide a
sufficient basis.

If several technologies remain materially reasonable, KHWAMI must present the
options, trade-offs, and recommendation or ask the developer to choose. It
must not silently select a technology merely to complete the workflow.

Technology recommendation is analysis. Adding a dependency, generating
configuration, installing a package, or performing an external operation is a
separate proposal concern.

---

## Project Proposal

The CREATE proposal is the explicit description of the project KHWAMI intends
to establish and the exact local changes it intends to make.

The proposal must be proportional. Include only categories that are relevant to
the project and supported by evidence or explicit requirements.

### Proposal content

Where applicable, a CREATE proposal should contain:

1. **Target**
   - target path or boundary;
   - host repository, if any;
   - existing artifacts to preserve;
   - target type and intended lifecycle.

2. **Objective**
   - project purpose;
   - intended users;
   - expected outcome.

3. **Scope**
   - included functionality;
   - initial delivery boundary;
   - explicit non-goals.

4. **Requirements and constraints**
   - explicit requirements;
   - evidence-derived requirements;
   - technical and organizational constraints;
   - acceptance criteria.

5. **Assumptions and unresolved decisions**
   - each material assumption;
   - its effect on the proposal;
   - decisions requiring confirmation;
   - items marked `REVIEW` rather than silently resolved.

6. **Technology direction**
   - selected or proposed technologies;
   - rationale and alternatives where material;
   - runtime and platform implications;
   - dependency declarations and installation boundaries.

7. **Project structure**
   - proposed directories and files;
   - responsibility of each significant area;
   - relationship to any preserved host material.

8. **Architecture direction**
   - major boundaries;
   - responsibility separation;
   - data or control flow where relevant;
   - intentionally deferred architecture decisions.

9. **Development and testing approach**
   - conventions;
   - expected checks;
   - test levels appropriate to the project;
   - validation limitations.

10. **Documentation**
    - required initial documentation;
    - source-of-truth locations;
    - documentation intentionally deferred to avoid duplication.

11. **Implementation plan**
    - ordered implementation steps;
    - dependencies between steps;
    - expected execution effects.

12. **Change set**
    - exact actions and paths whenever possible;
    - action classifications;
    - risks and expected impact;
    - destructive or external operations separately identified.

### Change classifications

The change set uses the KHWAMI operating vocabulary:

```text
KEEP
UPDATE
CREATE
RENAME
DELETE
REVIEW
```

- `KEEP` records existing material that remains unchanged.
- `UPDATE` modifies an existing file or bounded scope.
- `CREATE` adds a new file, directory, or local artifact.
- `RENAME` changes an existing name and is potentially destructive.
- `DELETE` removes an existing artifact and is destructive.
- `REVIEW` identifies an unresolved decision that must not be executed.

A proposal must not use `CREATE` as a hidden synonym for replacement. Existing
artifacts that are not explicitly approved for modification remain unchanged.

### Per-change information

Each executable proposal item should identify:

```text
Action:
Path or scope:
Purpose:
Reason:
Expected impact:
Risk:
Dependencies:
Destructive: yes/no
External: yes/no
Validation:
```

`REVIEW` items are not executable changes. They must be resolved or explicitly
excluded before permission can be requested.

Destructive, external, dependency-related, and other high-risk characteristics
must be explicitly identified in the proposal and handled through the shared
Permission and Approved Scope mechanisms. They do not introduce a separate
workflow state.

---

## Interactive Review

CREATE remains interactive after analysis and before permission.

KHWAMI must present the proposal in language that allows the developer to
understand:

- what project is being established;
- which target boundary is affected;
- what KHWAMI detected;
- what requirements are explicit;
- what was inferred;
- what assumptions were made;
- what decisions remain unresolved;
- which files and scopes will change;
- why each change is proposed;
- what risks or destructive effects exist; and
- how the result will be validated.

A proposal review is not execution permission. The proposal must be shown
before the shared Permission state is entered.

A CREATE review should conceptually use a structure such as:

```text
KHWAMI Creation Analysis

Target: <path or boundary>
Objective: <summary>

Requirements
- Explicit: ...
- Evidence-derived: ...
- Assumptions: ...
- Unresolved: ...

Project Direction
- Type: ...
- Technology: ...
- Architecture: ...
- Testing: ...
- Documentation: ...

Proposed Changes
CREATE  <path> — <purpose>
UPDATE  <path> — <purpose>
KEEP    <path> — <reason>
REVIEW  <decision> — <reason>

The proposal has not been executed.
```

The developer may provide feedback, clarify requirements, reject an
assumption, select an option, or request a different scope. KHWAMI must not
interpret a generated proposal as acceptance.

---

## Change Handling

Changes requested during review must be incorporated into the proposal before
execution.

```text
Proposal Review
      ↓
Changes requested?
  ├── No
  │     ↓
  │   Freeze current proposal
  │     ↓
  │   Change Detection
  │
  └── Yes
        ↓
      Revisit affected requirements, assumptions, or project shape
        ↓
      Generate revised proposal
        ↓
      Present revised proposal
```

The words “no changes requested” in this review flow are not the `n/no`
permission response. Permission remains a separate shared workflow
responsibility.

### Material proposal changes

A change is material when it affects any of the following:

- target boundary;
- project scope or non-goals;
- requirements;
- technology or runtime direction;
- architecture;
- dependencies;
- files or directories to be created, updated, renamed, or deleted;
- destructive or external effects;
- validation criteria; or
- execution order or operational behavior.

A material change requires a revised proposal and renewed review. If the
previous proposal was already approved, the approval is invalidated and a new
Permission decision is required.

KHWAMI must not silently apply a developer's feedback to an old proposal while
executing it.

### Context-affecting changes

If feedback changes the target boundary or reveals meaningful existing work,
CREATE must return to the applicable Context Resolution clarification path. It
must not silently switch to ADOPT or interpret the request as replacement.

### New architectural decisions

If a requested change introduces a new architectural decision, the revised
proposal must show:

- the decision;
- the reason;
- the alternatives considered where material;
- the affected requirements and files;
- the impact and risk; and
- the updated validation approach.

The architecture decision must be resolved before approval of the affected
proposal.

---

## Approval

Approval is governed by `KHWAMI_OPERATING_CONTRACT.md` and integrated by
`KHWAMI_WORKFLOW_CONTROL.md`.

Approval may be requested only after:

1. CREATE analysis is complete;
2. material requirements and target decisions are resolved;
3. the proposal has been presented for interactive review;
4. the exact change set has been detected and scoped; and
5. no blocking `REVIEW`, user-change conflict, or unresolved high-risk scope
   remains; any high-risk operation is explicitly identified in the current
   proposal and governed by the shared Permission and Approved Scope rules.

The permission interaction is:

```text
Permission Required

The CREATE analysis is complete.

KHWAMI has not modified or created any files.

[y/yes] Process only the current proposal
[n/no] Analysis only
```

Only the following responses are valid, case-insensitively:

```text
y
yes
n
no
```

Any other response, including `create`, `adopt`, `esc`, `maybe`, or `later`,
is invalid and must not execute changes. KHWAMI must request `y/yes` or
`n/no` again.

### Approval scope

`y` or `yes` means:

> Execute only the immediately preceding explicit CREATE proposal.

It does not authorize:

- future proposals;
- a materially revised proposal;
- additional changes discovered during execution;
- hidden replacement or deletion;
- dependency installation not explicitly shown;
- external operations; or
- any operation outside the displayed scope.

A prior approval never persists into a new proposal or new KHWAMI invocation.

### `n/no` and `Esc`

`n` or `no` ends execution and leaves the result analysis-only. No CREATE
changes may be made.

`Esc` is a Context Resolution exit action, not a third CREATE permission
response. It must never be used as an alternative spelling of `n/no` and must
not be interpreted as approval rejection inside the permission policy. If the
active Context Resolution interaction exposes the exit action, its behavior is
governed by the shared Context Resolution rules in
`KHWAMI_OPERATING_CONTRACT.md`:

```text
KHWAMI exited.

No changes were made.
```

---

## Execution

Execution begins only after a valid `y` or `yes` response to the immediately
preceding, explicit, current CREATE proposal.

Before making changes, KHWAMI must:

1. re-check the target boundary;
2. re-check the current Git and filesystem state;
3. compare current files with the pre-approval baseline;
4. confirm that the proposal has not materially changed;
5. confirm that proposed operations do not conflict with existing user changes;
6. confirm that all destructive and external scopes have the required
   treatment; and
7. confirm that the execution set contains only approved operations.

KHWAMI may then execute only the approved local changes.

### Execution restrictions

CREATE execution must not:

- modify files outside the approved target;
- overwrite unrelated user changes;
- expand the project scope silently;
- install dependencies merely because a manifest was created;
- perform external operations under local-file approval;
- delete or replace existing work unless that exact destructive scope was
  explicitly displayed and approved; or
- continue after an unexpected conflict.

Dependency declarations may be part of an approved local proposal. Installing
or resolving dependencies is a separate operation and must follow the
Operating Contract's permission and external-operation rules. It is never
implied by creation of a manifest or configuration file.

### Unexpected conditions

If execution discovers an artifact, required change, conflict, or environment
condition outside the approved proposal, KHWAMI must:

1. stop execution;
2. preserve the original approved scope;
3. report what was discovered;
4. leave the unapproved change untouched;
5. create a new explicit proposal if the change is required; and
6. obtain a new permission decision before continuing.

KHWAMI must not silently update the proposal while executing it.

If execution is partial, the final report must distinguish completed,
uncompleted, blocked, and failed operations. Partial execution is not success.

---

## Validation

Validation verifies that the approved CREATE result satisfies the applicable
requirements and that execution did not exceed its scope.

Validation should be proportional to the project and should include applicable
checks from the following categories:

### Files and structure

- expected files and directories exist;
- no required approved artifact is missing;
- paths and names match the proposal;
- the project structure is coherent;
- preserved existing artifacts remain intact; and
- no unintended files were modified.

### Configuration and dependencies

- configuration files are internally consistent;
- declared runtime, platform, and build settings agree;
- dependency declarations are syntactically and semantically coherent where
  they can be checked locally;
- no dependency installation is falsely reported as complete; and
- required local commands or configuration references are valid where
  applicable.

### Project behavior and checks

Where supported and relevant:

- project initialization checks pass;
- static checks pass;
- tests pass;
- build or type checks pass; and
- generated or configured entry points are internally consistent.

The environment may limit which checks can be run. A check that was not run
must be reported as not run or unavailable, not reported as successful.

### Documentation and scope

- required approved documentation exists;
- internal references remain valid;
- proposal and resulting files agree;
- Git and filesystem changes remain within approved scope; and
- no unrelated user changes were overwritten.

Validation must not repair a failure automatically. A repair is a new change
that requires analysis, proposal, and permission.

### Validation result

The final result must clearly distinguish at least:

```text
Created
Updated
Renamed
Deleted
Unchanged
Validation
Warnings or unavailable checks
```

KHWAMI may claim CREATE success only when the applicable validation has
established success. Otherwise the result must be reported as failed,
partially validated, blocked, or incomplete.

---

## Failure Handling

CREATE must fail safely and report uncertainty rather than conceal it.

### Incomplete requirements

If a material requirement is missing, KHWAMI must ask for clarification or
mark the decision unresolved. It must not silently invent requirements or
select a consequential technology.

If the developer does not provide the required information, KHWAMI may finish
with an input-required or blocked result. It must not execute.

### Ambiguous user input

If the request can reasonably mean more than one materially different thing,
KHWAMI must explain the interpretations and ask a focused question. Commands
such as “just do it” or “go ahead” do not resolve material ambiguity.

### Unsafe or incomplete proposal

If a safe proposal cannot be generated, KHWAMI must identify the missing
information, conflict, or risk and enter a review or clarification outcome. It
must not request permission for an unbounded or misunderstood proposal.

### Execution failure

If execution fails:

- stop at the failure boundary;
- do not claim that CREATE completed;
- record completed and uncompleted operations;
- preserve unrelated user work;
- do not blindly retry after the state may have changed; and
- require re-analysis and a new proposal when additional or corrective changes
  are necessary.

KHWAMI must not perform an unapproved rollback, reset, cleanup, or replacement
merely because execution failed.

### Validation failure

If validation fails, KHWAMI must report the failure and the affected checks.
It must not claim success or silently perform corrective changes. A correction
requires a new analysis and proposal.

### Unsupported environment

If the available environment cannot support the requested project or a
required validation step, KHWAMI must report the limitation. It must not
silently install tools, change the environment, contact external services, or
choose a different project shape to hide the limitation.

### Unexpected existing artifact

If discovery or execution reveals meaningful existing implementation at the
CREATE target, KHWAMI must stop and use the Context Resolution clarification
rules. It must not overwrite, delete, or silently adopt that material.

### Existing user changes

If an approved change conflicts with a pre-existing uncommitted user change,
KHWAMI must stop, report the conflict, and request guidance. It must not reset,
revert, check out over, or discard the user change.

### No interactive response

If required interactive input is unavailable, EOF is received, or the user
leaves a required decision unresolved, KHWAMI must not choose a default that
could change the project. It must finish as blocked, incomplete, or exited
according to the applicable shared workflow behavior.

---

## No-Change Outcome

CREATE must preserve the shared workflow's No-Change Outcome and the Operating
Contract's No-Change Condition.

If analysis determines that the requested CREATE state has already been
achieved and no changes are required, KHWAMI must finish without requesting
permission.

```text
CREATE Analysis Complete

No changes are required.

0 recommendations
0 files to create
0 files to update
0 files to rename
0 files to delete
0 files modified

KHWAMI finished.
```

KHWAMI must not:

- create placeholder files;
- modify a file merely to produce an execution step;
- ask for `y/yes` or `n/no` when there is nothing to execute; or
- convert a no-change result into ADOPT without a new Context Resolution
  decision.

`KEEP` findings do not create an executable change. A material unresolved
`REVIEW` item is not a no-change result; it must be clarified, deferred, or
reported as unresolved without requesting execution permission.

---

## State Model

The following is the New Project Workflow subflow inside the unified workflow
architecture. It identifies CREATE responsibilities without redefining shared
workflow-governance responsibilities or transitions.

| Workflow responsibility | Responsibility | Required outcome |
| --- | --- | --- |
| New Project Workflow Analysis | Enter the CREATE branch after valid Context Resolution | A bounded CREATE session target |
| Intent Discovery | Understand purpose, scope, users, constraints, and requested outcome | A normalized intent record |
| Context and Environment Discovery | Inspect the target and local environment without side effects | Evidence, feasibility findings, and safety status |
| Requirement Synthesis | Separate explicit requirements, derived information, assumptions, and unresolved decisions | A reviewable project understanding |
| Requirements Clarification | Resolve material missing or conflicting information | Sufficient requirements or a safe blocked outcome |
| Project Shape | Determine the minimum proportionate project direction | A bounded project shape or explicit alternatives |
| Recommendation | Select and explain the minimum justified project changes | Actionable recommendations or `REVIEW` items |
| Proposal / Interactive Review | Present the project proposal and collect corrections before approval | A current, understandable proposal |
| Change Detection | Freeze the exact change set and compare it with current user work | Approved-scope candidate or a blocking conflict |
| No-Change Outcome | Finish when no executable changes are required | No permission request |
| Permission | Collect the shared permission decision for the current proposal | Approval or analysis-only termination |
| Execution | Apply only the approved local change set | Tracked execution result |
| Validation | Verify the result against the proposal and requirements | Validated, failed, blocked, or incomplete result |
| Terminal Result | Report the terminal outcome | No implicit continuation or persisted approval |

### CREATE-specific transitions

```text
Context Resolution / Context Selection
        ↓
New Project Workflow Analysis
        ↓
Intent Discovery
        ↓
Context and Environment Discovery
        ├── valid CREATE target
        │        ↓
        │  Requirement Synthesis
        │        ├── material gap → Requirements Clarification
        │        └── sufficient → Project Shape
        │                              ↓
        │                        Recommendation
        │                              ↓
        │                 Proposal / Interactive Review
        │                        ├── changes → revise affected CREATE responsibility
        │                        └── no changes → Change Detection
        │                                             ├── No-Change Outcome
        │                                             └── Permission
        └── meaningful existing work or boundary conflict
                 ↓
           Context Resolution clarification
```

The following transitions are not permitted:

```text
Context and Environment Discovery → Execution
Context and Environment Discovery → Permission
Requirement Synthesis → Execution
Project Shape → Execution
Recommendation → Execution
Interactive Review → Execution
Interactive Review → Validation
Proposal → Execution
No-Change Outcome → Permission
No-Change Outcome → Execution
Permission → Execution for any input other than y/yes
Execution → additional unapproved execution
Validation → automatic correction
Terminal Result → continuation within the same session
```

A new CREATE analysis after Terminal Result requires a new KHWAMI session and a
new Session Start. Previous CREATE decisions and approvals must not persist.

---

## Boundaries

CREATE must never:

- silently adopt an existing project;
- silently change the target boundary;
- treat an empty directory as sufficient context evidence without applying
  Context Resolution rules;
- treat metadata alone as meaningful implementation;
- treat assumptions as explicit requirements;
- silently select a consequential technology when requirements are insufficient;
- silently replace, delete, or overwrite an existing project;
- overwrite pre-existing user changes;
- install dependencies automatically;
- perform external operations without their required separate approval;
- execute without the shared Permission gate;
- reuse stale approval after a material proposal change;
- execute changes outside the approved proposal;
- continue after an unexpected artifact or scope conflict;
- skip intent, requirements, proposal, Change Detection, Permission, Execution,
  or Validation responsibilities;
- create placeholder changes to avoid the No-Change Outcome;
- claim success without successful applicable validation;
- hide incomplete requirements, execution failures, or unavailable checks;
- implement CLI-specific behavior inside this contract;
- define the Existing Project Adoption workflow; or
- redefine the unified workflow lifecycle.

---

## Relationship with the Unified Workflow Architecture and Operating Contract

### Shared Governance Policy (Operating Contract)

`KHWAMI_OPERATING_CONTRACT.md` owns the shared governance policy used by
CREATE, including:

- Context Resolution and target clarification;
- metadata versus meaningful implementation classification;
- CREATE, ADOPT, and AMBIGUOUS determination;
- `[Create]`, `[Adopt]`, and `[Esc]` context interaction;
- anti-skip behavior and the distinction between Context Selection and
  Permission;
- `y/yes` and `n/no` Permission semantics;
- Approved Scope policy;
- No-Change behavior; and
- session termination and new-lifecycle rules.

`KHWAMI_WORKFLOW_CONTROL.md` owns the public integration and orchestration of
these shared rules. CREATE references them and does not redefine them.

### The Operating Contract owns

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
- final reporting.

### CREATE owns

This document owns:

- CREATE-specific intent discovery;
- CREATE-specific environment and target discovery;
- requirements synthesis;
- project-shape determination;
- CREATE proposal content;
- CREATE interactive review content;
- CREATE-specific change interpretation;
- CREATE execution expectations; and
- CREATE validation expectations.

CREATE may use the shared rules, but it must not create a separate Permission
system or contradict the unified workflow architecture.

### CLI Presentation Layer

A future CLI may render CREATE responsibilities, collect input, display
proposals, and show execution and validation results. CLI presentation and
input mechanics are outside this document. The CLI must call the shared
Workflow Controller and must not independently decide context, Permission,
scope, or CREATE business rules.

---

## Implementation Invariants

1. CREATE cannot start without a valid Context Resolution decision for the New
   Project Workflow and a bounded target.
2. CREATE cannot silently become Existing Project Adoption.
3. A CREATE target containing meaningful existing work must be returned to the
   Context Resolution clarification process.
4. Metadata alone must not be treated as meaningful implementation.
5. CREATE analysis and discovery are read-only.
6. Explicit requirements, evidence-derived information, assumptions, and
   unresolved decisions must remain distinguishable.
7. KHWAMI asks only questions whose answers materially affect safety, scope,
   architecture, execution, or validation.
8. A complete project proposal must precede Change Detection and Permission.
9. Interactive Review is separate from execution Permission.
10. A material proposal change invalidates any previous approval.
11. Permission accepts only case-insensitive `y`, `yes`, `n`, or `no`.
12. `y/yes` authorizes only the immediately preceding explicit proposal.
13. Execution operates only on the approved proposal and stops on unexpected
    scope, conflicts, or additional changes.
14. Dependency installation, external operations, and destructive operations
    are never implied by ordinary CREATE approval.
15. Validation is required before CREATE can be reported as successful.
16. Validation failure or unavailable checks must be reported honestly and must
    not trigger automatic corrective changes.
17. The No-Change Outcome bypasses Permission and creates no placeholder work.
18. CREATE must not skip required Context Resolution, analysis, Proposal,
    Change Detection, Permission, Execution, or Validation responsibilities
    because the developer requests immediate execution.
19. Context Resolution exit is distinct from Permission rejection and never
    grants or denies execution by implication.
20. CREATE state and approval do not persist after Terminal Result; another
    analysis requires a new KHWAMI session.
21. CLI rendering and input handling remain outside the CREATE contract.
22. This document does not define Existing Project Adoption behavior.