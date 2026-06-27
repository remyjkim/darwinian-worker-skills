#!/usr/bin/env node
// ABOUTME: Runs an isolated drwn smoke test against local cards in a temp project.
// ABOUTME: Exercises init, card apply, write, mind list, mind clear, and artifacts.

import { existsSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { rootDir } from "./card-map.mjs";

const drwnBin = process.env.DRWN_BIN || "drwn";
const keepTemp = process.env.KEEP_SMOKE_TEMP === "1";
const tmp = mkdtempSync(join(tmpdir(), "darwinian-minds-skills-smoke-"));
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
  run(`card apply file:${join(rootDir, "cards", "base-mind")} file:${join(rootDir, "cards", "mind-skills")}`);
  run("write --dry-run --json");
  run("write");
  run("mind list --json");

  const generatedDir = join(project, ".agents", "drwn", "generated");
  assertExists(join(generatedDir, "minds", "@darwinian", "base-mind", "mind.json"), "per-mind bundle");
  assertExists(join(generatedDir, "minds", "@darwinian", "mind-skills", "mind.json"), "primary tools mind bundle");
  assertExists(join(generatedDir, "mind", "mind.json"), "composed mind");
  assertExists(join(project, ".claude", "skills", "manage-active-mind-stack", "SKILL.md"), "projected Claude skill");
  assertExists(join(project, ".claude", "skills", "apply-mind-card", "SKILL.md"), "projected primary Claude skill");
  assertExists(join(project, ".codex", "skills", "manage-active-mind-stack", "SKILL.md"), "projected Codex skill");
  assertExists(join(project, ".codex", "skills", "apply-mind-card", "SKILL.md"), "projected primary Codex skill");

  run("mind clear --json");
  run("write");
  assertExists(join(generatedDir, "minds", "@darwinian", "base-mind", "mind.json"), "per-mind bundle after clear");
  assertExists(join(generatedDir, "minds", "@darwinian", "mind-skills", "mind.json"), "primary tools mind bundle after clear");
  assertMissing(join(generatedDir, "mind"), "composed mind after clear");
  assertMissing(join(project, ".claude", "skills", "manage-active-mind-stack"), "projected Claude skill after clear");
  assertMissing(join(project, ".claude", "skills", "apply-mind-card"), "projected primary Claude skill after clear");
  assertMissing(join(project, ".codex", "skills", "manage-active-mind-stack"), "projected Codex skill after clear");
  assertMissing(join(project, ".codex", "skills", "apply-mind-card"), "projected primary Codex skill after clear");

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
