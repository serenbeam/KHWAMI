"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const CLI_PATH = path.resolve(__dirname, "../src/cli/index.js");
const ADOPT_OBJECTIVE = "Add offline support to the existing sales module";

function createFixture() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "khwami-adopt-e2e-test-"));
  fs.writeFileSync(
    path.join(fixture, "package.json"),
    JSON.stringify({ name: "existing-project" }),
  );
  fs.mkdirSync(path.join(fixture, "src", "modules", "sales"), { recursive: true });
  fs.writeFileSync(
    path.join(fixture, "src", "modules", "sales", "index.js"),
    "module.exports = {};\n",
  );
  fs.writeFileSync(path.join(fixture, "README.md"), "# Existing\n");
  return fixture;
}

function removeFixture(fixture) {
  fs.rmSync(fixture, { recursive: true, force: true });
}

function snapshotTarget(targetPath) {
  const entries = [];

  function visit(currentPath, relativePrefix) {
    const children = fs
      .readdirSync(currentPath, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));

    for (const child of children) {
      const relativePath = path.join(relativePrefix, child.name);
      const childPath = path.join(currentPath, child.name);
      if (child.isDirectory()) {
        entries.push({ path: relativePath, kind: "directory" });
        visit(childPath, relativePath);
      } else if (child.isFile()) {
        entries.push({
          path: relativePath,
          kind: "file",
          content: fs.readFileSync(childPath, "utf8"),
        });
      } else {
        entries.push({ path: relativePath, kind: "other" });
      }
    }
  }

  visit(targetPath, "");
  return entries;
}

function runAdopt(fixture, permission) {
  return childProcess.spawnSync(
    process.execPath,
    [
      CLI_PATH,
      "--target",
      fixture,
      "--intent",
      "adopt",
      "--adopt-objective",
      ADOPT_OBJECTIVE,
    ],
    { input: `${permission}\n`, encoding: "utf8" },
  );
}

test("ADOPT CLI E2E completes the authorized blocked/read-only lifecycle", () => {
  const fixture = createFixture();
  try {
    const before = snapshotTarget(fixture);
    const result = runAdopt(fixture, "yes");

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Detected Type: ADOPT/);
    assert.match(result.stdout, /ADOPT Requirement Result/);
    assert.match(result.stdout, /Workflow Proposal/);
    assert.match(result.stdout, /ADOPT Action Derivation/);
    assert.match(result.stdout, /ADOPT Change Detection \+ Approved Scope/);
    assert.match(result.stdout, /Baseline: CAPTURED/);
    assert.match(result.stdout, /Change Detection: NO_CHANGE/);
    assert.match(result.stdout, /Approved Scope\nStatus: AUTHORIZED/);
    assert.match(result.stdout, /Permission Result\nStatus: AUTHORIZED/);
    assert.match(result.stdout, /Execution Result\nStatus: BLOCKED/);
    assert.match(result.stdout, /Execution started: false/);
    assert.match(result.stdout, /Changed paths: 0/);
    assert.match(result.stdout, /Validation Result\nStatus: PASSED/);
    assert.match(result.stdout, /Terminal Result\nStatus: UNRESOLVED/);
    assert.deepEqual(snapshotTarget(fixture), before);
  } finally {
    removeFixture(fixture);
  }
});

test("ADOPT CLI E2E rejects permission without mutating the target", () => {
  const fixture = createFixture();
  try {
    const before = snapshotTarget(fixture);
    const result = runAdopt(fixture, "no");

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Permission Result\nStatus: REJECTED/);
    assert.match(result.stdout, /Approved Scope\nStatus: NOT_ESTABLISHED/);
    assert.match(result.stdout, /Execution Result\nStatus: BLOCKED/);
    assert.match(result.stdout, /Validation Result\nStatus: FAILED/);
    assert.match(result.stdout, /Terminal Result\nStatus: REJECTED/);
    assert.deepEqual(snapshotTarget(fixture), before);
  } finally {
    removeFixture(fixture);
  }
});
