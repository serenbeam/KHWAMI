# Repository Decisions

## Purpose

Record significant, evidence-supported decisions that explain why KHWAMI is organized as it is and guide future maintenance without duplicating its architecture or feature map.

## Context

KHWAMI's documentation-first resources standardize reusable assets for AI-assisted engineering. `ROADMAP.md` identifies the KHWAMI plan and `WORKSPACE_STATE.md` records the completed Phase 5 KHWAMI Optimization milestone.

The repository has no dedicated ADR directory or formal decision-record format. The decisions below are reconstructed from current authoritative documentation and relevant Git history; unrecorded rationale and alternatives are identified as unknown.

## Scope

This document covers repository-level decisions about KHWAMI governance, documentation layering, prompt-library organization, and repository intelligence.

It excludes personal engineering preferences, routine content choices, individual prompt wording, and undocumented historical motivations.

## Information

### Confirmed Decisions

| Decision | Evidence | Confirmed rationale | Consequence |
| --- | --- | --- | --- |
| Use a phase-based roadmap as the KHWAMI plan. | `ROADMAP.md` defines completed phases, future phases, and describes itself as the single source of truth. | Track progress, prevent repeated work, organize reusable assets, and support KHWAMI evolution. | New KHWAMI capabilities are planned and tracked by phase. |
| Keep KHWAMI identity and operating rules in separate documents. | `KHWAMI.md` establishes the identity-only boundary; `KHWAMI_OPERATING_CONTRACT.md` defines operating rules. | Prevent identity and operating-rule duplication while keeping both sources discoverable. | KHWAMI identity remains in `KHWAMI.md`; operating rules remain in the root-level operating contract. |
| Separate personal standards, global instructions, task prompts, repository instructions, and repository intelligence by responsibility. | `agents/`, `instructions/`, `prompts/`, and `docs/` are distinct top-level areas with distinct stated purposes. | Avoid duplicated responsibilities and preserve clear sources of truth. | Repository knowledge belongs in `docs/`; AI behavior, operating methods, and task requests remain in their respective layers. |
| Organize the prompt library by purpose. | `prompts/README.md` defines the `general-engineering/`, `programming-languages/`, and `technologies/` categories. | Enable growth without changing the library's overall structure while retaining reusable, focused prompts. | New prompts should be placed in the narrowest appropriate category and begin from `prompts/TEMPLATE.md`. |
| Introduce repository intelligence as a dedicated Phase 4 capability. | `ROADMAP.md` and `WORKSPACE_STATE.md` define the Phase 4 goal, milestone, and core documents. | Reduce unnecessary repository exploration, improve AI context, and standardize repository documentation. | `docs/` uses `docs/TEMPLATE.md` as its shared repository-intelligence standard. |
| Use a documented CLI toolset for focused repository work. | `WORKSPACE_STATE.md` lists installed tools and configured Git/RTK integration; `instructions/global/tool-selection.md` and `search-strategy.md` assign tool responsibilities. | Improve repository exploration efficiency, terminal readability, and context use. | Tool guidance is maintained in `instructions/global/`; individual repositories may define additional requirements. |
| Evaluate additional tools before adoption. | `instructions/global/tool-selection.md` defines the required evidence, compatibility, cost, workflow-benefit, and context-impact assessment. | Avoid adding tooling that does not solve a confirmed workflow gap. | Material adoption, rejection, or replacement decisions are recorded here; no new tool was adopted in Phase 5. |

#### Option C — Architecture Baseline + Phase 6.5 Project Milestone

The project selected Option C — Architecture Baseline + Phase 6.5 Project
Milestone. These are two distinct, non-equivalent meanings.

**Architecture Baseline** is a non-restrictive documentation/status term limited
to the F-01-supported findings:

- no residual governance findings;
- no architecture impact;
- no change required; and
- `FREEZE CANDIDATE — NO GOVERNANCE FINDINGS`.

This Architecture Baseline is not the pre-approval baseline used by the KHWAMI
workflow Change Detection process. F-02 and F-03 provide project-history or
milestone context only and do not enlarge the Architecture Baseline.

**Phase 6.5 Project Milestone** is a project-progress and documentation-status
milestone only. Phase 6 remains deferred, and Phase 6.5 does not activate
Phase 6.

Neither concept declares Architecture Frozen or creates architecture,
contract, implementation, dependency, repository-structure, documentation, or
future-decision immutability. Neither creates a Candidate → Frozen transition,
freeze authority, exception/unfreeze mechanism, or new approval path. Existing
KHWAMI governance remains unchanged.

### Decision Evidence and Unknowns

| Topic | Confirmed information | Unknown or inferred information |
| --- | --- | --- |
| Prompt-library evolution | Git history records staged commits that establish and expand the prompt library. | Detailed alternatives and trade-offs for its categories are not recorded. |
| Repository-intelligence design | Current documentation establishes Phase 4 goals and the shared `docs/TEMPLATE.md` structure. | The original decision date, alternatives, and implementation trade-offs are not recorded. |
| Tool selection | The current toolset, intended responsibilities, and evaluation criteria are documented. | Historical rejected-tool evaluations before Phase 5 are not recorded. |

### Architectural Consequences

- Changes to a responsibility layer should preserve its stated boundary rather than duplicate content from another layer.
- New repository-intelligence documents must follow `docs/TEMPLATE.md` and reference source-of-truth material.
- The roadmap must be maintained when new deliverables are created so its phase status reflects the existing documentation.

## References

- `ROADMAP.md` - KHWAMI phases, phase objectives, core deliverables, and roadmap governance.
- `KHWAMI_OPERATING_CONTRACT.md` - KHWAMI operating rules and change-control contract.
- `WORKSPACE_STATE.md` - completed milestone, KHWAMI priorities, environment, and installed tooling.
- `docs/TEMPLATE.md` - repository-intelligence standard.
- `docs/repository-overview.md` - repository identity and component context.
- `docs/architecture.md` - responsibility layers and architectural boundaries.
- `docs/feature-map.md` - capability locations and completed Phase 4 document status.
- `prompts/README.md` and `prompts/TEMPLATE.md` - prompt-library organization and authoring model.
- `instructions/global/tool-selection.md` and `instructions/global/search-strategy.md` - documented tool responsibilities and exploration approach.
- Git history - staged prompt-library commits through `b6cd47e`.

## Maintenance

Update this document when a repository-level decision is adopted, superseded, reversed, or materially changed, or when evidence changes the confidence of a recorded rationale.

Add alternatives and trade-offs only when they are supported by decision records, discussions, configuration history, or other repository evidence. Remove unsupported inferences rather than presenting them as history.

## Notes

- All listed decisions and rationales are confirmed only to the extent stated by their cited sources.
- No formal ADRs, recorded alternatives, or decision-specific historical rationale were found in the inspected repository documentation and relevant Git history.
