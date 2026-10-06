# KHWAMI

KHWAMI is a documentation-first repository for reusable AI-assisted engineering
guidance, prompt assets, repository intelligence, planning records, and current
state information.

The canonical identity and terminology baseline is defined in
[`KHWAMI.md`](KHWAMI.md).

## Repository Structure

- [`agents/`](agents/) — personal engineering and AI collaboration standards.
- [`instructions/global/`](instructions/global/) — reusable AI guidance,
  prompting, exploration, tool-selection, workflow, and RTK documentation.
- [`instructions/repository/`](instructions/repository/) — repository-specific
  instruction template.
- [`prompts/`](prompts/) — reusable engineering prompts and prompt templates.
- [`docs/`](docs/) — repository-intelligence documentation and templates.
- [`ROADMAP.md`](ROADMAP.md) — phases, deliverables, and future direction.
- [`WORKSPACE_STATE.md`](WORKSPACE_STATE.md) — current state, priorities, and
  environment records.

## Where to Start

- Read [`KHWAMI.md`](KHWAMI.md) for the official identity and terminology.
- Read [`KHWAMI_OPERATING_CONTRACT.md`](KHWAMI_OPERATING_CONTRACT.md) for KHWAMI's operating rules.
- Read [`docs/README.md`](docs/README.md) for the repository-intelligence index.
- Read [`docs/repository-overview.md`](docs/repository-overview.md) for a high-level
  repository map.
- Read [`ROADMAP.md`](ROADMAP.md) and [`WORKSPACE_STATE.md`](WORKSPACE_STATE.md)
  for documented phases and current state.

## Current Status

Phase 10 — CLI MVP is **closed for the bounded MVP scope**. The repository
provides the implemented CLI workflow for explicit CREATE actions and the
bounded, read-only ADOPT lifecycle. Phase 11 has not started.

## CLI

### Requirements

The CLI uses Node.js, plain JavaScript, and npm with no third-party runtime
dependencies. The package and executable name is `khwami`; when working from this
repository, use the local npm script or direct Node.js entry point below. The
target should be an existing directory.

### Getting Started / First Run

From the KHWAMI repository root, choose an existing target directory and run
`npm start -- --target <path> --intent <create|adopt>`. The CLI resolves the
request as `CREATE`, `ADOPT`, or `AMBIGUOUS`; review the proposal and provide
Permission when applicable. It then runs the applicable bounded
execution/validation flow and reports a Terminal Result. This is the Phase 10
MVP: ADOPT remains read-only and executable ADOPT mutation is deferred.

### Usage

Run the local CLI through the npm script:

```text
npm start -- [options]
```

The entry point can also be run directly:

```text
node ./src/cli/index.js [options]
```

Supported options are:

| Option | Purpose |
| --- | --- |
| `--target <path>` | Existing target directory; defaults to the current working directory. |
| `--intent <create\|adopt>` | Optional workflow intent hint. |
| `--purpose <text>` | CREATE project purpose. |
| `--project-type <text>` | CREATE project type. |
| `--scope <text>` | CREATE initial functionality and scope. |
| `--create-path <path>` | Explicit CREATE file path. |
| `--create-content <text>` | Explicit CREATE file content. |
| `--adopt-objective <text>` | Explicit ADOPT objective. |

After the proposal and Approved Scope are reviewed, the CLI requests Permission
with `y`, `yes`, `n`, or `no` when the workflow requires it.

### Examples

Explicit CREATE of one file:

```text
npm start -- --target ./new-project --intent create --purpose "Create a small CLI" --project-type "Node.js CLI application" --scope "Create the initial entry point" --create-path index.js --create-content "console.log('hello');\n"
```

Bounded ADOPT review of an existing project:

```text
npm start -- --target ./existing-project --intent adopt --adopt-objective "Add offline support to the existing sales module"
```

For the ADOPT example, enter `yes` to authorize the bounded read-only scope or
`no` to reject it.

### Workflow

The implemented lifecycle is:

```text
Context
→ Analysis
→ Proposal
→ Review / Permission
→ Approved Scope
→ Execution
→ Validation
→ Terminal Result
```

If the available target and intent information is insufficient to determine
whether the request is `CREATE` or `ADOPT`, the context is `AMBIGUOUS`.
KHWAMI does not proceed with execution in that state; the request must be
clarified before the workflow can continue.

### CREATE

CREATE supports explicit, resolved file actions within an authorized Approved
Scope. The resulting file is written and then validated. CREATE does not infer
project templates, invent files, or perform broader project generation.

### ADOPT

ADOPT supports existing-project analysis, objective handling, proposal and
review, Permission, Approved Scope, bounded execution behavior, validation, and
terminal results. Its current execution is intentionally read-only and blocked:
`REVIEW` actions are non-executable, and ADOPT does not currently perform
executable mutations. Authorized ADOPT validation confirms that the target was
preserved.

### Current Limitations

Available now:

- CLI MVP workflow routing and lifecycle presentation.
- Explicit CREATE file execution and validation.
- Bounded, non-mutating ADOPT workflow.
- Permission and Approved Scope handling.
- Change Detection, validation, and Terminal Results.

Deferred:

- Executable ADOPT mutation.
- Broader ADOPT mutation capabilities.
