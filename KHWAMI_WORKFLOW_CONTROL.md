# KHWAMI Unified Workflow & CLI Architecture

Status: Architectural Contract

This document defines the public, unified architecture that integrates
KHWAMI's context resolution, workflow-specific analysis, shared proposal
lifecycle, change detection, permission, execution, validation, termination,
and CLI interaction.

It is a documentation contract only. It does not implement the CLI, workflow
controller, application code, repository logic, or execution logic.

The following authorities remain in force and are not redefined here:

- `KHWAMI_OPERATING_CONTRACT.md` — shared KHWAMI governance policy / WHAT,
  including context governance, safety, approved-scope policy, Permission,
  execution, validation, termination, and reporting.
- `KHWAMI_CREATE.md` — New Project Workflow analysis, proposal content, and
  new-project-specific expectations.
- `KHWAMI_ADOPT.md` — Existing Project Adoption analysis, proposal content,
  preservation-first expectations, and adoption-specific validation
  expectations.

This document owns only their integration and orchestration / HOW.

---

## Purpose

The unified architecture exists to make KHWAMI behave as one coherent,
controller-led system.

It defines:

- the end-to-end session lifecycle;
- the relationship between workflow context and workflow-specific analysis;
- the common proposal lifecycle shared by both project workflows;
- the distinction between analysis results, proposals, approval, execution,
  and validation;
- scope and baseline traceability across the session;
- the controller boundary with execution and validation;
- the controller boundary with the CLI presentation layer; and
- orchestration-level failure and interruption routing.

It does not replace the authoritative rules already owned by the Operating
Contract, the New Project Workflow, or the Existing Project Adoption workflow.

---

## Architectural Principles

The unified architecture follows these principles:

- **One Workflow Controller** — one Workflow Controller governs lifecycle
  progression for the session under the shared governance policy.
- **Context before workflow analysis** — the applicable workflow must be
  resolved before workflow-specific analysis begins.
- **Workflow context is not a proposal action** — the selected workflow and
  the actions inside a proposal are different kinds of information.
- **Analysis before proposal** — workflow-specific understanding must exist
  before an explicit proposal can be reviewed.
- **Proposal before permission** — findings and recommendations are not
  execution authority.
- **Shared proposal lifecycle** — both project workflows converge into the
  same review, change-detection, permission, execution, validation, and
  termination path.
- **Scope traceability** — requested, analyzed, proposed, approved, executed,
  and validated scope must remain distinguishable.
- **No hidden transitions** — context changes, scope changes, approval, and
  corrective work must remain explicit.
- **Execution is bounded** — execution receives approved scope and does not
  expand or reinterpret it.
- **Validation is separate** — validation verifies results after execution and
  does not silently repair failures.
- **CLI is a presentation boundary** — the CLI renders interaction and
  captures input; it is not the workflow authority.
- **Session-scoped authority** — proposal authority and approval authority are
  valid only within the current active session.

---

## Unified Lifecycle

KHWAMI operates as one controller-led lifecycle:

```text
User Intent
    ↓
Context Resolution
    ↓
Selected Workflow
    ├── New Project Workflow
    └── Existing Project Adoption
             ↓
       Workflow Analysis
             ↓
          Proposal
             ↓
     Interactive Review
             ↓
       Change Detection
          ├── No-Change Outcome → Terminal Result
          └── Current Executable Proposal
                         ↓
                     Permission
                         ↓
                     Execution
                         ↓
                    Validation
                         ↓
                  Terminal Result
```

When context cannot be safely resolved from available evidence, the session
remains in Context Resolution until the Operating Contract's governance rules
obtain the required clarification, a workflow is selected, or the session
terminates safely.

The New Project Workflow and Existing Project Adoption have different analysis
responsibilities, but they converge into the same shared lifecycle once a
current proposal exists.

---

## Ownership Boundaries

### Operating Rules

`KHWAMI_OPERATING_CONTRACT.md` remains authoritative for:

- analysis-only behavior;
- universal safety rules;
- preservation of existing work;
- destructive and external-operation handling;
- approved-scope policy;
- execution policy;
- validation policy; and
- reporting policy.

The unified architecture consumes these rules. It does not restate or replace
them. Shared governance policy remains owned by
`KHWAMI_OPERATING_CONTRACT.md`.

### Shared Governance Policy

`KHWAMI_OPERATING_CONTRACT.md` remains authoritative for shared workflow
governance policy, including:

- Context Detection, Context Resolution, Context Selection, Ambiguity Handling,
  and Target Clarification semantics;
- anti-skip behavior and valid navigation conditions;
- Permission semantics and approval invalidation;
- Approved Scope policy;
- shared reanalysis and material-change behavior; and
- termination and new-lifecycle behavior.

Workflow Control applies and coordinates these rules through the one Workflow
Controller. It does not create or redefine a second governance system.

### New Project Workflow

`KHWAMI_CREATE.md` remains authoritative for:

- new-project intent;
- discovery and requirement synthesis;
- project shape;
- new-project analysis responsibilities;
- new-project proposal content; and
- new-project-specific validation expectations.

The unified architecture defines how the New Project Workflow enters and exits
the shared lifecycle.

### Existing Project Adoption

`KHWAMI_ADOPT.md` remains authoritative for:

- existing-project discovery;
- project understanding;
- requirement reconciliation;
- architecture assessment;
- change identification;
- preservation-first analysis;
- adoption-specific proposal content; and
- adoption-specific validation expectations.

The unified architecture defines how Existing Project Adoption enters and exits
the shared lifecycle.

### Unified Workflow Architecture

This document owns only:

- integration between the authoritative layers;
- session lifecycle coordination;
- controller responsibilities;
- shared state and data boundaries;
- shared proposal lifecycle coordination;
- scope traceability;
- baseline and change-detection coordination;
- execution and validation handoff; and
- controller/CLI separation.

### CLI Presentation Layer

The CLI owns only:

- presentation;
- input capture;
- progress display; and
- result display.

The CLI is not permitted to become workflow authority.

---

## Workflow State and Data Boundaries

The unified architecture keeps the following concepts separate.

| Concept | Meaning | Authority | Mutability |
| --- | --- | --- | --- |
| Workflow State | Where the session currently is in the shared lifecycle | Workflow Controller | Mutable during the active session |
| Workflow Context | Why the session is operating as New Project Workflow or Existing Project Adoption for the current target | `KHWAMI_OPERATING_CONTRACT.md` policy applied by Workflow Controller | Mutable only through renewed context resolution |
| Analysis State | What workflow-specific analysis has been completed and what remains current | Selected workflow | Mutable until superseded by new analysis |
| Proposal State | The current explicit proposed difference between current state and proposed state | Workflow Controller using selected-workflow analysis output | Mutable until replaced, approved, invalidated, or terminated |
| Change Detection State | Whether the current proposal is unchanged, executable, or in conflict with current reality | Derived by the controller from proposal, baseline, and current state | Recomputed when relevant inputs change |
| Permission State | Whether the current proposal has valid approval | `KHWAMI_OPERATING_CONTRACT.md` | Ephemeral and invalidated by material change or termination |
| Approved Scope | The exact scope authorized for execution | `KHWAMI_OPERATING_CONTRACT.md`, coordinated by Workflow Controller | Immutable once granted, but expires when invalidated or terminated |
| Execution State | Progress and result of applying approved scope | Execution subsystem | Mutable during execution, historical after completion |
| Validation State | Result of verifying that actual changes match the approved result | Validation subsystem | Final for a validation run |
| Terminal Result | How the session ended | Workflow Controller | Immutable once produced |

### Data classifications

The architecture also distinguishes the kind of information being carried
through the session:

| Artifact | Produced by | Used by | Nature |
| --- | --- | --- | --- |
| User Intent | User through the CLI | Context Resolution and selected workflow analysis | User input |
| Observed Evidence | Context Resolution or selected workflow analysis | Analysis, proposal formation, and change detection | Immutable historical evidence |
| Analysis Result | Selected workflow analysis | Proposal lifecycle | Authoritative workflow-specific result for the current cycle |
| Recommendation | Selected workflow analysis | Proposal formation or review discussion | Derived analysis output, not authorization |
| Proposal | Workflow Controller from current analysis result | Review, change detection, permission, execution, validation | Current explicit executable candidate |
| Review Feedback | User through the CLI | Selected workflow analysis and proposal revision | User input |
| Permission Decision | `KHWAMI_OPERATING_CONTRACT.md` policy applied by Workflow Controller | Controller | Authoritative approval or rejection record |
| Approved Scope | Controller under `KHWAMI_OPERATING_CONTRACT.md` | Execution and validation | Authoritative execution boundary |
| Execution Result | Execution subsystem | Validation and final reporting | Execution output |
| Validation Result | Validation subsystem | Final reporting | Validation output |
| Terminal Result | Workflow Controller | CLI and user | Final session result |

A recommendation never becomes execution merely because it exists. Approval,
execution, and validation each require their own explicit artifacts.

### Shared data flow

The principal data flow through the unified architecture is:

```text
User Intent
    ↓
Context Resolution Result
    ↓
Workflow-Specific Analysis Result
    ↓
Proposal
    ↓
Review Feedback
    ↓
Current Proposal
    ↓
Change Detection Result
    ↓
Permission Decision
    ↓
Approved Scope
    ↓
Execution Result
    ↓
Validation Result
    ↓
Terminal Result
```

Review feedback may cause the selected workflow to produce a revised analysis
result and proposal. A material revision does not continue through the later
steps as though it were the previous proposal.

---

## Workflow Context and Proposal Actions

Workflow context and proposal actions are intentionally different concepts.

### Workflow context

Workflow context answers:

- Is KHWAMI operating as the New Project Workflow?
- Or is KHWAMI operating as Existing Project Adoption?
- What target boundary is that workflow responsible for right now?

### Proposal actions

Proposal actions answer:

- What is being preserved?
- What is being changed?
- What is being created, renamed, deleted, or deferred?

The shared proposal uses the established action vocabulary:

```text
KEEP
UPDATE
CREATE
RENAME
DELETE
REVIEW
```

These actions describe the contents of a proposal. They do not select the
workflow context.

For example:

```text
Existing Project Adoption
        ↓
Proposal
        ↓
CREATE docs/architecture.md
```

This remains Existing Project Adoption. The workflow context did not change.
The proposal simply includes a `CREATE` action within the adoption context.

A context change may occur only through renewed Context Resolution when the
current context is no longer valid for the target.

---

## Analysis Integration

The unified architecture separates workflow-specific analysis from shared
orchestration.

```text
Context Resolution
        ↓
Selected Workflow
        ↓
Workflow-Specific Analysis
        ↓
Analysis Result
        ↓
Unified Proposal Lifecycle
```

### Workflow-specific responsibilities

The selected workflow owns its own internal analysis policy.

- The New Project Workflow analyzes new-project intent, requirements,
  constraints, project shape, and proposal content according to
  `KHWAMI_CREATE.md`.
- Existing Project Adoption analyzes existing project evidence, project
  understanding, requirement reconciliation, architecture assessment,
  preservation decisions, and proposal content according to `KHWAMI_ADOPT.md`.

The unified architecture does not duplicate those rules.

### Shared analysis boundary

To enter the unified proposal lifecycle, each workflow produces a current
analysis result that is sufficient to support an explicit proposal.

That result should identify, where applicable:

- target boundary;
- current state or observed project understanding;
- current objective;
- preserved scope;
- candidate actions;
- assumptions;
- unresolved decisions;
- relevant risks or high-risk characteristics; and
- validation expectations.

The controller consumes that result. It does not reinterpret workflow-specific
policy or invent missing analysis.

---

## Workflow Integration

The New Project Workflow and Existing Project Adoption enter the shared
architecture through Context Resolution and leave it through the same proposal,
permission, execution, validation, and Terminal Result boundaries. Their
analysis responsibilities remain separate.

### New Project Workflow integration

- **Entry** — Context Resolution selects the New Project Workflow for a bounded
  target.
- **Analysis** — `KHWAMI_CREATE.md` governs intent discovery, requirements,
  project shape, and new-project analysis.
- **Shared boundary** — the New Project Workflow returns an analysis result
  containing the information needed to form the current unified proposal.
- **Proposal and review** — the controller presents that proposal for
  Interactive Review and accepts any required revision through the New Project
  Workflow's analysis responsibilities.
- **Shared control flow** — the current proposal enters Change Detection and
  then follows either the No-Change Outcome or the common Permission,
  Execution, Validation, and Terminal Result path.
- **Context continuity** — discovering evidence that invalidates the selected
  context returns control to Context Resolution; it does not silently switch
  to Existing Project Adoption.

### Existing Project Adoption integration

- **Entry** — Context Resolution selects Existing Project Adoption for a
  bounded target containing meaningful existing project work.
- **Analysis** — `KHWAMI_ADOPT.md` governs discovery, project understanding,
  requirement reconciliation, architecture assessment, preservation-first
  analysis, and change identification.
- **Shared boundary** — Existing Project Adoption returns an analysis result
  containing the information needed to form the current unified proposal.
- **Proposal and review** — the controller presents that proposal for
  Interactive Review and accepts any required revision through Existing
  Project Adoption's analysis responsibilities.
- **Shared control flow** — the current proposal enters Change Detection and
  then follows either the No-Change Outcome or the common Permission,
  Execution, Validation, and Terminal Result path.
- **Context continuity** — a material target or context change returns control
  to Context Resolution; it does not silently become the New Project Workflow.

The unified architecture coordinates these entry, convergence, and exit
boundaries without reproducing either workflow's internal policy.

---

## Unified Proposal Lifecycle

The proposal is the shared convergence point between workflow-specific analysis
and shared execution governance.

```text
Current State
      ↓
Proposed State
```

The proposal expresses the controlled difference between those two states for
the current target.

### Proposal model

The current proposal should carry, where applicable:

- proposal identity;
- workflow context;
- target boundary;
- current state;
- proposed state;
- preserved scope;
- assumptions;
- unresolved decisions;
- itemized actions;
- expected impact;
- risk;
- dependencies;
- destructive or external characteristics; and
- validation plan.

Each proposal item should be concrete enough for the user to understand what
would change, what would remain unchanged, and why the action belongs in the
current scope.

### Distinguishing observations, recommendations, and proposals

The architecture keeps these levels separate:

- **Observation** — evidence about the current project or target.
- **Recommendation** — an analysis conclusion about what may be appropriate.
- **Proposal** — the current explicit change set to be reviewed and, if
  approved, executed.
- **Approved Scope** — the exact portion of the current proposal authorized for
  execution.
- **Execution Result** — what was actually done.
- **Validation Result** — what was actually verified.

These are related, but they are not interchangeable.

### Interactive Review

The proposal is presented for interactive review before permission is requested.

The review step exists so the user can:

- clarify intent;
- adjust scope;
- reject an assumption;
- resolve an unresolved decision;
- request another approach; or
- identify a material mismatch between the proposal and the objective.

Material feedback must revise the proposal before the proposal can move forward.
If a proposal changes materially after review, the revised proposal becomes the
current proposal. If approval had already existed, that approval is no longer
valid for the revised proposal.

The unified architecture does not introduce a second approval mechanism for
proposal revision.

---

## Scope Lifecycle and Traceability

The Workflow Controller must preserve traceability across the full scope
lifecycle:

```text
Requested Scope
      ↓
Analyzed Scope
      ↓
Proposed Scope
      ↓
Approved Scope
      ↓
Executed Scope
      ↓
Validated Scope
```

### Scope responsibilities

- **Requested Scope** comes from the user's objective and stated boundaries.
- **Analyzed Scope** comes from workflow-specific understanding of what the
  objective actually touches.
- **Proposed Scope** is the explicit scope of the current proposal.
- **Approved Scope** is the exact scope authorized under
  `KHWAMI_OPERATING_CONTRACT.md`.
- **Executed Scope** is the subset of approved scope that execution actually
  attempted or completed.
- **Validated Scope** is the portion of executed scope that validation actually
  confirmed.

### Controller responsibility

The controller preserves the chain between these stages so the session can
answer:

- what was requested;
- what was analyzed;
- what was proposed;
- what was approved;
- what was executed; and
- what was validated.

If a material change alters target, scope, affected artifacts, risk,
dependencies, or validation commitments, the controller must route the session
through renewed analysis, revised proposal, change detection, and new
permission before further execution.

This document defines the traceability requirement. Detailed approved-scope
policy remains owned by `KHWAMI_OPERATING_CONTRACT.md`.

---

## Baseline and Change Detection Coordination

The unified architecture maintains a clear relationship between:

- the state that was analyzed;
- the proposal derived from that analysis;
- the baseline relevant to approval;
- the current filesystem or repository state;
- active user changes;
- the approved scope; and
- the actual execution target.

### Baseline concept

The pre-approval baseline is the relevant known state against which the current
proposal is reviewed and later checked.

The architecture does not prescribe how that baseline is represented or stored.
It only requires that the controller be able to determine whether the proposal
still matches the state it is asking the user to approve.

### Change Detection

Change Detection is the shared coordination gate between reviewed proposal and
permission.

It evaluates, as applicable:

- proposal identity;
- target boundary;
- analyzed or pre-approval baseline;
- current filesystem or repository state;
- active user changes;
- unresolved decisions;
- explicit high-risk characteristics; and
- exact proposed scope.

### Change-detection outcomes

Change Detection produces one of the following architectural outcomes:

- **No-Change Outcome** — there is no executable difference requiring
  permission or execution.
- **Current Executable Proposal** — the current proposal is still the proposal
  that may be presented for permission.
- **Mismatch or Conflict** — the proposal, baseline, or current state no longer
  aligns safely.

A mismatch or conflict must not silently rewrite the proposal. The controller
must route the session back to the appropriate analysis or review mechanism, or
terminate safely when continuation is no longer appropriate.

The No-Change Outcome terminates cleanly without permission or execution.

---

## Permission Coordination

Permission is defined by `KHWAMI_OPERATING_CONTRACT.md`. It is not owned by
the CLI, the New Project Workflow, Existing Project Adoption, or a presentation
layer of the controller.

The unified architecture does not define alternative approval semantics, a
separate permission parser, or a second approval path.

### Controller role

The controller coordinates when permission is required. It does not decide its
meaning independently of the Operating Contract's governance policy.

The controller must ensure that permission is bound to the immediately
preceding explicit current proposal and to its exact execution boundary.

### Approval binding

A valid approval is bound to the current:

- session;
- target;
- proposal identity;
- relevant baseline; and
- approved scope.

If any of those materially changes, the previous approval no longer authorizes
execution of the revised work.

### No hidden approval

The unified architecture forbids treating any of the following as implicit
approval:

- a context-selection choice;
- proposal display;
- review feedback;
- general agreement language outside the permission interaction;
- a previous approval from an earlier proposal; or
- a previous approval from an earlier session.

Detailed permission semantics remain owned by the Operating Contract.

---

## Execution Boundary

Execution is a separate subsystem that receives explicit approved scope from the
Workflow Controller.

```text
Workflow Controller
        ↓
Approved Proposal
        ↓
Approved Scope
        ↓
Execution Subsystem
```

### Execution inputs

Execution receives only:

- the approved proposal;
- the approved scope;
- relevant baseline and state information; and
- applicable execution constraints.

### Execution boundary rules

Execution must not:

- decide workflow context;
- expand scope;
- reinterpret approval;
- silently add work;
- act as a second controller; or
- continue through unexpected out-of-scope conditions without returning
  control.

If execution encounters an unexpected condition, additional required work, or a
conflict with the approved boundary, control returns to the Workflow Controller
so the appropriate workflow mechanism can decide the next step.

Detailed execution rules remain owned by the Operating Contract.

---

## Validation Boundary

Validation is a separate post-execution responsibility.

```text
Approved Result
      ↓
Actual Result
```

Validation determines whether the actual result matches the approved proposal
and approved scope.

### Validation role

The validation boundary may consume:

- the approved proposal;
- the approved scope;
- the execution result; and
- workflow-specific validation expectations supplied by the selected workflow.

### Validation boundary rules

Validation must remain separate from execution.

Validation must not:

- silently repair failures;
- authorize corrective work on its own; or
- reinterpret a failed validation as implicit permission for more changes.

If corrective work is required, the controller must route the session back
through new analysis, revised proposal, change detection, and new permission.

Detailed validation policy remains owned by the Operating Contract and the
selected workflow.

---

## CLI Presentation Layer

The CLI is the presentation and input boundary between the user and the
Workflow Controller.

```text
Workflow Controller
        ↕
CLI Presentation Layer
        ↕
User
```

### CLI responsibilities

The CLI may:

- render context questions or choices;
- display workflow analysis;
- display project understanding;
- display proposals;
- collect review feedback;
- collect permission input;
- display execution progress;
- display validation results; and
- display final results.

### CLI restrictions

The CLI must not independently decide:

- workflow context;
- workflow transitions;
- permission meaning;
- approved scope;
- execution authorization;
- validation success; or
- terminal state.

The CLI must not become a parallel state machine.

### Interaction flow

Interaction follows this controller-led pattern:

```text
Controller determines required interaction
        ↓
CLI renders the interaction
        ↓
User responds
        ↓
CLI returns the response
        ↓
Controller evaluates the response
        ↓
Controller determines the next action
```

The CLI captures input. The controller interprets it according to workflow
state and authoritative governance rules.

---

## Failure and Interruption Routing

The unified architecture defines how control returns when the session cannot
continue normally. It does not replace the detailed failure policy already
owned elsewhere.

| Condition | Controller routing | Primary owner of next decision |
| --- | --- | --- |
| Ambiguous context | Remain in Context Resolution until clarification, selection, or safe termination | Operating Contract policy, coordinated by Workflow Controller |
| Unresolved target boundary | Return to Context Resolution or clarification before workflow analysis continues | Operating Contract policy, coordinated by Workflow Controller |
| Missing requirements or insufficient workflow understanding | Return to the selected workflow's analysis or clarification path, or finish blocked/incomplete | Selected workflow |
| Unresolved review decisions | Revise the proposal, defer the unresolved item, or terminate without execution | Selected workflow and controller |
| Changed filesystem or repository state | Re-run Change Detection and route to revised analysis/proposal or safe termination as needed | Controller using Operating Contract rules |
| Conflicting user changes | Stop progression and return to the appropriate workflow mechanism or terminate safely | Controller using Operating Contract rules |
| Unexpected artifacts or evidence that invalidate the current context | Return to Context Resolution or the affected workflow analysis as appropriate | Controller under Operating Contract policy |
| Unsupported environment or unavailable tooling | Surface the limitation and return to proposal/review or terminate safely | Selected workflow and Operating Contract |
| External-operation requirement | Return to proposal/review so the external boundary can be handled under the proper authority | Operating Contract policy and Workflow Controller |
| Permission rejection | Terminate with an analysis-only or rejected-execution result | Operating Contract policy, coordinated by Workflow Controller |
| Esc or explicit exit | Terminate safely without execution | Operating Contract policy, coordinated by Workflow Controller |
| EOF or unavailable required interaction | Terminate or remain blocked safely; do not guess | Operating Contract policy, coordinated by Workflow Controller |
| Execution failure or unexpected execution condition | Stop execution and return control to the controller for follow-up analysis/proposal if needed | Execution boundary and Operating Contract |
| Validation failure | Report the failure; if corrective work is desired, begin a new analysis/proposal/permission cycle | Validation boundary and Operating Contract |

The architecture forbids hidden execution, hidden context switching, silent
scope expansion, and automatic repair as interruption responses.

---

## Session Lifecycle and Terminal Integrity

The session lifecycle is always fresh and bounded.

```text
Session Start
    ↓
Fresh Intent
    ↓
Context Resolution
    ↓
Workflow Analysis
    ↓
Proposal / Interactive Review
    ↓
Change Detection
    ↓
No-Change Outcome
    OR
Permission
    ↓
Execution
    ↓
Validation
    ↓
Terminal Result
```

### Session-scoped authority

The following are session-scoped and non-transferable:

- current workflow context;
- current analysis state;
- current proposal identity;
- current permission state; and
- current approved scope.

### Terminal integrity

After Terminal Result:

- active proposal authority expires;
- approval authority expires;
- transient workflow state expires; and
- a new analysis requires a new lifecycle.

No stale proposal, stale approval, or incomplete transition may continue
silently after termination.

The terminal result must reflect what actually happened. It must not imply
successful execution or successful validation when those results were not
established.

---

## Integration Invariants

The following invariants belong specifically to the unified integration
architecture:

- One Workflow Controller owns lifecycle progression for the session.
- The New Project Workflow and Existing Project Adoption are branches inside a
  shared lifecycle, not competing workflow systems.
- Workflow context and proposal actions are distinct concepts.
- Workflow-specific analysis must produce a current analysis result that can
  enter the shared proposal lifecycle.
- Proposal, change-detection result, permission decision, approved scope,
  execution result, validation result, and terminal result remain separate
  session artifacts.
- Material change to target, proposal, baseline, scope, risk, or validation
  commitments invalidates current approval.
- The No-Change Outcome terminates without permission or execution.
- Execution receives only approved scope and cannot expand that scope on its
  own.
- Validation is separate from execution and cannot silently repair or authorize
  additional work.
- The CLI is a presentation and input adapter, not a parallel controller or
  state machine.
- No hidden context switch, hidden approval, or hidden transition exists in
  the unified architecture.
- Terminal completion clears active proposal authority and approval authority.

---

## Non-Goals

This architecture does not:

- implement the CLI;
- define command syntax, UI layout, or terminal styling;
- define classes, interfaces, storage mechanisms, or runtime libraries;
- implement context resolution logic;
- redefine shared governance policy owned by the Operating Contract;
- redefine New Project Workflow policy;
- redefine Existing Project Adoption policy;
- redefine Operating Contract safety, permission, execution, or validation
  policy; or
- introduce another controller, approval system, proposal system, or workflow
  state machine.
