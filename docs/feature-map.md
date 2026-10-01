# Repository Feature Map

## Purpose

Map KHWAMI's major reusable capabilities to their primary documentation and template locations so AI assistants can locate the right asset without broad repository exploration.

## Context

KHWAMI is a documentation-first repository. Its features are reusable engineering guidance, task prompts, templates, and KHWAMI records rather than user-facing application functionality.

This map uses `docs/repository-overview.md` for repository context and `docs/architecture.md` for responsibility boundaries. It identifies where capabilities are implemented without repeating their detailed contents.

## Scope

This document covers confirmed KHWAMI capabilities and their primary implementation locations.

It excludes individual prompt internals, application features, runtime flows, and planned-but-unimplemented repository-intelligence documents.

## Information

### Capability Map

| Capability | Primary implementation locations | Related components | Status |
| --- | --- | --- | --- |
| Personal AI engineering standards | `agents/PERSONAL_AGENTS.md` | Global and repository-specific instructions | Confirmed |
| Global AI workflow guidance | `instructions/global/` | `workflow.md`, `prompting-guide.md`, `search-strategy.md`, `tool-selection.md`, `rtk-workflow.md`, `copilot_instructions.md` | Confirmed |
| Repository-specific AI instruction starter | `instructions/repository/copilot_instructions-template.md` | Repository-specific guidance created from the template | Confirmed |
| General engineering task prompts | `prompts/general-engineering/` | Analysis, planning, investigation, review, refactoring, implementation, documentation, architecture, performance, and testing prompts | Confirmed |
| Language-specific prompt guidance | `prompts/programming-languages/` | `javascript.md`, `typescript.md` | Confirmed |
| Technology-specific prompt guidance | `prompts/technologies/` | `react.md`, `react-native.md`, `nodejs.md`, `express.md` | Confirmed |
| Prompt-library authoring | `prompts/README.md`, `prompts/TEMPLATE.md` | All prompt categories | Confirmed |
| Repository-intelligence authoring | `docs/TEMPLATE.md` | `docs/repository-overview.md`, `docs/architecture.md`, `docs/feature-map.md`, and `docs/decisions.md` | Confirmed |
| KHWAMI operating contract | `KHWAMI_OPERATING_CONTRACT.md` | `KHWAMI.md`, `README.md`, and KHWAMI governance documents | Confirmed |
| KHWAMI planning and state tracking | `ROADMAP.md`, `WORKSPACE_STATE.md` | All KHWAMI layers | Confirmed |

### Feature Location Guide

| Need | Start at |
| --- | --- |
| Apply durable engineering principles | `agents/PERSONAL_AGENTS.md` |
| Determine how AI should approach work | `instructions/global/copilot_instructions.md` and the relevant document in `instructions/global/` |
| Create repository-specific AI guidance | `instructions/repository/copilot_instructions-template.md` |
| Select or author a reusable task prompt | `prompts/README.md`, then the applicable prompt category |
| Understand KHWAMI | `docs/repository-overview.md`, then `docs/architecture.md` |
| Understand KHWAMI operating rules | `KHWAMI_OPERATING_CONTRACT.md` |
| Check phase status, priorities, or planned deliverables | `ROADMAP.md` and `WORKSPACE_STATE.md` |

### Boundaries and Uncertainty

- No product-facing features, screens, routes, services, databases, or executable application flows are confirmed in the repository.
- Phases 4 and 5 are complete; Phase 4's four core documents remain in `docs/`.
- The mapped capabilities are confirmed by current files and directories. Their detailed behavior remains defined by the referenced documents.

## References

- `docs/TEMPLATE.md` - required repository-intelligence structure and evidence rules.
- `KHWAMI_OPERATING_CONTRACT.md` - KHWAMI operating rules and change-control contract.
- `docs/repository-overview.md` - repository identity, component index, and environment context.
- `docs/architecture.md` - responsibility layers, boundaries, and information flows.
- `prompts/README.md` and `prompts/TEMPLATE.md` - prompt-library structure and authoring conventions.
- `ROADMAP.md` - completed capabilities, Phase 4 and 5 deliverables, and future roadmap phases.
- `WORKSPACE_STATE.md` - current KHWAMI state, priorities, decisions, environment, and continuation context.
- `agents/PERSONAL_AGENTS.md` and `instructions/global/` - authoritative guidance assets mapped above.

## Maintenance

Update this map when a KHWAMI capability is added, removed, renamed, moved, or materially reorganized, or when its authoritative implementation location changes.

Revise or remove entries that no longer correspond to existing repository assets. Do not update this map for wording-only changes that do not change a capability or its location.

## Notes

- This map identifies capability locations, not detailed task instructions or feature behavior.
- The repository instruction template path uses underscores: `instructions/repository/copilot_instructions-template.md`.
