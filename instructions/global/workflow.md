# AI Engineering Workflow

Version: 1.0

Status: Stable

---

# Purpose

This document defines the standard engineering workflows used when collaborating with AI.

The objective is to provide consistent, repeatable, and technology-agnostic processes for common software engineering tasks.

These workflows describe *how work should be approached*, not *how code should be written*.

---

# Scope

These workflows apply to all software projects unless a repository defines its own workflow.

Project-specific workflows may extend or replace individual sections where appropriate.

---

# Workflow Selection Guide

Use the workflow that best matches the current task.

| Task | Workflow |
|------|----------|
| Implement a new feature | Feature Implementation |
| Fix a bug | Bug Investigation |
| Improve existing code | Refactoring |
| Review changes | Code Review |
| Update documentation | Documentation Update |
| Upgrade dependencies | Dependency Update |
| Understand a repository | Repository Exploration |
| Assess project documentation | Project Documentation Adoption |

---

# Common Workflow Principles

The following principles apply to every workflow.

1. Understand the objective.
2. Analyse the current implementation.
3. Identify constraints.
4. Plan the minimum required changes.
5. Implement carefully.
6. Verify correctness.
7. Update documentation when necessary.

Avoid skipping analysis unless explicitly requested.

---

# Feature Implementation

## Objective

Implement new functionality while preserving the existing architecture.

## Standard Workflow

1. Understand requirements.
2. Locate affected components.
3. Review existing implementation.
4. Identify reusable code.
5. Plan the implementation.
6. Implement the minimum required changes.
7. Verify functionality.
8. Update documentation if required.

## Expected Outcome

A feature that integrates naturally with the existing project while minimising unnecessary changes.

---

# Bug Investigation

## Objective

Resolve defects by identifying and fixing the root cause rather than treating symptoms.

## Standard Workflow

1. Understand the reported behaviour.
2. Reproduce the issue.
3. Locate the affected implementation.
4. Identify the root cause.
5. Confirm the diagnosis with evidence.
6. Implement the smallest effective fix.
7. Perform regression checks.
8. Verify the solution.

## Expected Outcome

A verified fix that resolves the issue without introducing new regressions.

---

# Refactoring

## Objective

Improve maintainability without changing observable behaviour.

## Standard Workflow

1. Understand the current implementation.
2. Identify maintainability issues.
3. Evaluate expected benefits.
4. Refactor incrementally.
5. Preserve behaviour.
6. Verify correctness.
7. Update documentation if required.

## Expected Outcome

Cleaner code with improved readability or maintainability while preserving functionality.

---

# Code Review

## Objective

Evaluate implementation quality and identify opportunities for improvement.

## Standard Workflow

1. Understand the scope.
2. Review correctness.
3. Review architecture.
4. Review maintainability.
5. Review readability.
6. Review performance when relevant.
7. Provide objective recommendations.

## Expected Outcome

Clear, evidence-based feedback prioritised by impact.

---

# Documentation Update

## Objective

Keep documentation aligned with implementation.

## Standard Workflow

1. Identify implementation changes.
2. Locate affected documentation.
3. Update relevant sections.
4. Remove outdated information.
5. Verify consistency.

## Expected Outcome

Documentation accurately reflects the current implementation.

## Documentation Impact Check

Before completing a change that affects repository guidance, confirm whether it
changes:

1. a responsibility, location, or capability in `docs/`;
2. a repository-level decision in `docs/decisions.md`;
3. phase status, deliverables, or direction in `ROADMAP.md`; or
4. current objective, environment, or priorities in `WORKSPACE_STATE.md`.

Update only the applicable source-of-truth document and its direct references.
Do not update every document by default.

---

# Dependency Update

## Objective

Introduce or update dependencies responsibly.

## Standard Workflow

1. Understand the purpose.
2. Verify necessity.
3. Review compatibility.
4. Evaluate alternatives.
5. Implement changes.
6. Verify build.
7. Verify runtime behaviour.

## Expected Outcome

Dependencies remain minimal, compatible, and maintainable.

---

# Repository Exploration

## Objective

Understand only the repository context required for the current task.

## Standard Workflow

1. Review repository documentation.
2. Locate relevant files.
3. Inspect only the necessary implementation.
4. Expand exploration only when required.
5. Avoid repeatedly reading the same files.
6. Stop exploration when sufficient context has been gathered.

## Expected Outcome

Efficient repository understanding with minimal unnecessary context.

---

# Project Documentation Adoption

## Objective

Determine the minimum project documentation needed to support requirements,
constraints, workflows, maintainability, AI navigation, and durable project
knowledge without creating duplicate sources of truth.

This workflow applies to both new and existing application repositories. The
candidate roles are `AGENTS.md`, `PRD.md`, `README.md`,
`docs/architecture.md`, `docs/feature-map.md`, and `docs/decisions.md`. These
are documentation roles, not mandatory filenames or a required six-file set.

## Core Principle

Create or adopt documentation only when its expected value justifies its
maintenance and complexity cost. A missing canonical filename is not evidence
that documentation is missing.

## Required Assessment

Before assigning an action to a role, assess the following using observable
evidence. Mark unavailable information `UNKNOWN` or `INSUFFICIENT EVIDENCE`.

1. **Requirements** — product, functional, technical, acceptance, lifecycle,
   and explicit documentation requirements.
2. **Constraints** — project maturity, complexity, contributors, timeline,
   technology, governance, deployment, maintenance, and documented
   security or compliance requirements.
3. **Project context** — new or existing repository, repository scale, major
   features, expected growth, change frequency, AI-assisted development, and
   onboarding needs.
4. **Existing documentation** — location, purpose, authority, owner,
   maintenance state, consumers, references, overlap, and conflicts.
5. **Documentation value** — problem solved, consumers, expected use,
   prevented failure, preserved knowledge, and likely stability.
6. **Maintenance cost** — update frequency, ownership, staleness risk,
   duplication, synchronization burden, cognitive overhead, and repository
   complexity.
7. **Source-of-truth risk** — whether the required information already exists
   in an authoritative document.

Do not invent requirements, constraints, ownership, or project facts.

## Evidence and Decision Status

Classify evidence and decisions separately. These classifications are analysis
metadata for the current assessment. They are not workflow contexts, workflow
states, proposal actions, permission states, execution states, or validation
states. They inform analysis and decision-making only; they do not control
workflow transitions or create an alternative workflow state machine.

### Evidence status

Use these labels for the availability and strength of information:

- `CONFIRMED` — the information is supported by observable project evidence.
- `UNKNOWN` — no established knowledge or decision is currently available.
- `INSUFFICIENT EVIDENCE` — a likely answer, candidate interpretation, or
  indication may exist, but the available evidence is not sufficient to
  establish it confidently.

`UNKNOWN` does not imply that a likely answer has been identified, that the
answer is merely undocumented, or that an assumption has become accepted fact.
`INSUFFICIENT EVIDENCE` does not establish its candidate answer or
interpretation as fact.

### Decision status

Use decision status independently from evidence status:

- `PROPOSED` — an assessment, recommendation, candidate decision, or proposed
  interpretation pending appropriate confirmation.
- `CONFIRMED` — the appropriate authority explicitly accepted the decision;
  record its evidence, rationale, action, owner, and target path.

A `CONFIRMED` evidence status does not automatically confirm a project decision.
A `PROPOSED` decision does not become confirmed because it is reasonable,
well-supported, documented, or recommended. It does not constitute a confirmed
project fact, approved scope, execution authorization, or permission to modify
the project.

Where applicable, the progression is:

```text
Evidence → Assessment → Recommendation or Proposal → Confirmation
```

The agent may continue with a non-blocking unknown when it does not materially
affect the current requirements, constraints, authority, ownership,
source-of-truth selection, or safety of the recommendation. Keep the uncertainty
and any bounded assumption explicit.

The agent must ask for clarification when an unknown could materially change the
required documentation role, action, source of truth, ownership, scope, or cause
an irreversible or destructive change.

Technology information may be `UNKNOWN`; do not invent an unstated technology
choice. If technology is required for the current decision and remains unknown,
ask for clarification or make an explicitly permitted recommendation. A
recommendation or assumption must not silently convert unknown or insufficient
technology evidence into a confirmed technology decision. Specific tool or
technology adoption remains governed by the existing tool-selection rules and
must not bypass the evidence gate.

## Priority and Action

Classify priority independently from action:

- `MUST` — required for an important project need.
- `SHOULD` — valuable but not immediately essential.
- `COULD` — useful but low priority.
- `DEFER` — insufficient value or evidence at present.

Use exactly one action:

- `KEEP` — an appropriate authoritative document already occupies the role.
- `REUSE` — an equivalent document fulfills the role under another name or
  location.
- `UPDATE` — an existing role document needs substantive correction or
  completion.
- `CREATE` — no suitable document exists and the role has demonstrated value.
- `MERGE` — multiple documents substantially overlap and should be consolidated.
- `DEFER` — the role is unnecessary, premature, unsupported, or not currently
  valuable.

Priority must not determine action. For example, a `MUST` role may be `REUSE`,
and a `COULD` role may be `DEFER`.

## New Project Workflow

### New Project → Context Assessment → Role Evaluation → Trade-Off → Decision → Adoption Plan

1. Assess purpose, requirements, constraints, maturity, complexity,
   contributors, lifecycle, and documentation consumers.
2. Evaluate each candidate role independently for need, evidence, consumers,
   value, maintenance cost, duplication risk, and priority.
3. Compare the expected benefit with maintenance, staleness, synchronization,
   and complexity costs.
4. Assign `CREATE` only to roles with demonstrated value and `DEFER` to roles
   not justified by evidence.
5. Produce an adoption plan containing role, path, purpose, owner, source
   material, priority, dependencies, and maintenance responsibility.
6. Generate only documents approved by the adoption plan.
7. Verify that requirements, product knowledge, AI operating rules,
   repository facts, architecture, and decisions have distinct ownership.

Do not create all candidate roles by default.

## Existing Project Workflow

### Existing Project → Inventory → Semantic Mapping → Gap/Overlap Analysis → Value/Cost Analysis → Decision → Adoption Plan

1. Inventory relevant documentation beyond canonical filenames.
2. Establish apparent authority from references, project conventions,
   ownership, update patterns, and explicit statements.
3. Map existing documents to candidate roles by semantic purpose, scope,
   authority, consumers, and maintenance ownership.
4. Detect a gap only when a meaningful need exists and current documentation
   does not adequately support it.
5. Detect duplicate or conflicting sources, ambiguous ownership, and
   substantially overlapping scope.
6. Compare KEEP, REUSE, UPDATE, MERGE, CREATE, and DEFER alternatives.
7. Assign exactly one action to each relevant role and record the minimum
   justified adoption plan.
8. Do not rename, move, split, or merge documents solely to match canonical
   filenames or directories.

## Semantic Equivalence and Duplicate Prevention

Filename matching is discovery evidence only. Determine equivalence using:

- primary purpose and scope;
- authority and source-of-truth status;
- expected content coverage;
- consumers;
- ownership and maintenance responsibility;
- references and project conventions.

For example, `docs/product-requirements.md` may fulfill the `PRD` role,
`docs/system-design.md` may fulfill the architecture role, and an ADR
collection may fulfill the decisions role. Reuse these documents when they
adequately serve the role rather than creating canonical-name duplicates.

A document may serve more than one role only when its combined scope,
authority, and ownership remain clear. Product requirements must not be mixed
with AI operating rules; repository facts must not be duplicated in project
instructions; architecture and decisions must not be copied into multiple
competing sources of truth.

## Decision Record

For each non-trivial role decision, record enough reasoning to make it
explainable:

- Role and current document(s)
- Priority and project need
- Requirements and constraints
- Evidence and existing coverage
- Consumers and ownership
- Overlap risk
- Expected benefit and maintenance cost
- Trade-off
- Decision and reason
- Target path and dependencies, when applicable

Use `N/A` or `UNKNOWN` where a field does not apply or evidence is unavailable.

## Expected Outcome

A minimum adoption plan that identifies what to KEEP, REUSE, UPDATE, CREATE,
MERGE, or DEFER, with evidence and trade-offs. The plan must not treat
canonical filenames as mandatory and must not create documentation solely to
standardize appearance.

---

# Verification

Before considering any task complete, verify:

- requirements have been satisfied,
- architecture remains consistent,
- existing patterns have been preserved,
- imports and references are valid,
- naming remains consistent,
- unnecessary changes have not been introduced,
- documentation has been updated when required.

---

# Guiding Principle

Follow structured engineering workflows that maximise correctness, maintainability, and consistency while minimising unnecessary changes and context usage.

---

# End of Document