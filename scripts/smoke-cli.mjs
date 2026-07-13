#!/usr/bin/env node
// ABOUTME: Runs an isolated drwn smoke test against the local Operator Card.
// ABOUTME: Exercises init, singular Worker selection, projection, and clearing selection.

import { existsSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { rootDir } from "./card-map.mjs";

const drwnBin = process.env.DRWN_BIN || "drwn";
const keepTemp = process.env.KEEP_SMOKE_TEMP === "1";
const tmp = mkdtempSync(join(tmpdir(), "darwinian-worker-skills-smoke-"));
const home = join(tmp, "home");
const project = join(tmp, "project");
mkdirSync(home, { recursive: true });
mkdirSync(project, { recursive: true });

function run(args, options = {}) {
  const command = `${drwnBin} ${args}`;
  const result = spawnSync(command, {
    cwd: options.cwd ?? project,
    env: {
      ...process.env,
      HOME: home,
      AGENTS_DIR: join(home, ".agents"),
      DRWN_ANALYTICS_DISABLED: "1",
    },
    shell: true,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command}\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function assertExists(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label}: ${path}`);
  }
}

function assertMissing(path, label) {
  if (existsSync(path)) {
    throw new Error(`Unexpected ${label}: ${path}`);
  }
}

try {
  run("--version");
  run("init --non-interactive");
  run(`apply file:${join(rootDir, "cards", "operator")} --active @darwinian/operator`);
  run("write --dry-run --json");
  run("write");
  run("status --json --explain");

  const generatedDir = join(project, ".agents", "drwn", "generated");
  const workerDir = join(generatedDir, "workers", "@darwinian", "operator");
  assertExists(join(workerDir, "worker.json"), "Operator Worker bundle");
  assertExists(join(generatedDir, "workers.json"), "Worker registry");
  assertExists(join(generatedDir, "active-worker.json"), "active Worker selection");
  assertExists(join(project, ".claude", "skills", "manage-project-worker", "SKILL.md"), "projected Claude skill");
  assertExists(join(project, ".codex", "skills", "manage-project-worker", "SKILL.md"), "projected Codex skill");
  assertMissing(join(project, ".claude", "skills", "manage-active-mind-stack"), "retired Operator skill");
  assertMissing(join(project, ".codex", "skills", "apply-mind-card"), "retired Operator skill");

  run("use --none --no-write");
  run("write");
  assertExists(join(workerDir, "worker.json"), "installed Operator Worker bundle after clear");
  assertMissing(join(generatedDir, "active-worker.json"), "active Worker selection after clear");
  assertMissing(join(project, ".claude", "skills", "manage-project-worker"), "projected Claude skill after clear");
  assertMissing(join(project, ".codex", "skills", "manage-project-worker"), "projected Codex skill after clear");

  console.log(`✓ Isolated CLI smoke passed in ${project}`);
} catch (error) {
  console.error(`✘ ${error.message}`);
  console.error(`Temp project kept at ${project}`);
  process.exitCode = 1;
} finally {
  if (!keepTemp && process.exitCode !== 1) {
    rmSync(tmp, { recursive: true, force: true });
  }
}
