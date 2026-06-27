#!/usr/bin/env node
// ABOUTME: Validates every local card source with the current drwn CLI.
// ABOUTME: Uses DRWN_BIN for repo-local CLI smoke tests when provided.

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { cardMaps } from "./card-map.mjs";

const drwnBin = process.env.DRWN_BIN || "drwn";
const errors = [];

function run(command) {
  const result = spawnSync(command, {
    shell: true,
    stdio: "pipe",
    encoding: "utf8",
  });
  return result;
}

const version = run(`${drwnBin} --version`);
if (version.status !== 0) {
  console.error(version.stderr || version.stdout);
  console.error("✘ drwn CLI is unavailable; set DRWN_BIN to a repo-local CLI command");
  process.exit(1);
}

for (const card of cardMaps) {
  if (!existsSync(card.cardDir)) {
    errors.push(`${card.name}: missing card directory ${card.cardDir}`);
    continue;
  }
  const command = `${drwnBin} card validate file:${card.cardDir} --json`;
  const result = run(command);
  if (result.status !== 0) {
    errors.push(`${card.name}: validation failed\n${result.stderr || result.stdout}`);
    continue;
  }
  try {
    const parsed = JSON.parse(result.stdout);
    if (parsed.ok === false) {
      errors.push(`${card.name}: validation returned ok=false`);
    }
  } catch {
    errors.push(`${card.name}: validation did not emit JSON`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`✘ ${error}`);
  }
  process.exit(1);
}

console.log(`✓ Validated ${cardMaps.length} card sources`);
