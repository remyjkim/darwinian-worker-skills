#!/usr/bin/env node
// ABOUTME: Checks package, plugin, lockfile, and public documentation identity.
// ABOUTME: Prevents stale Darwinian Harness or singular product naming drift.

import { readFileSync } from "node:fs";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readText(path) {
  return readFileSync(path, "utf8");
}

function assert(condition, message, errors) {
  if (!condition) {
    errors.push(message);
  }
}

const errors = [];
const pkg = readJson("package.json");
const lock = readJson("package-lock.json");
const bundle = readJson("bundle.json");
const version = readText("VERSION").trim();
const claudePlugin = readJson(".claude-plugin/plugin.json");
const claudeMarketplace = readJson(".claude-plugin/marketplace.json");
const codexPlugin = readJson(".codex-plugin/plugin.json");

assert(pkg.name === "darwinian-worker-skills", "package.json name must be darwinian-worker-skills", errors);
assert(pkg.version === version, "package.json version must match VERSION", errors);
assert(lock.name === pkg.name, "package-lock.json root name must match package.json", errors);
assert(lock.version === pkg.version, "package-lock.json root version must match package.json", errors);
assert(lock.packages?.[""]?.name === pkg.name, "package-lock packages[''] name must match package.json", errors);
assert(lock.packages?.[""]?.version === pkg.version, "package-lock packages[''] version must match package.json", errors);
assert(bundle.bundleName === pkg.name, "bundle.json bundleName must match package.json name", errors);
assert(bundle.version === pkg.version, "bundle.json version must match package.json", errors);
assert(bundle.displayName === "Darwinian Worker Skills", "bundle.json displayName must be Darwinian Worker Skills", errors);

for (const [label, manifest] of [
  [".claude-plugin/plugin.json", claudePlugin],
  [".codex-plugin/plugin.json", codexPlugin],
]) {
  assert(manifest.version === pkg.version, `${label} version must match package.json`, errors);
  assert(manifest.homepage?.includes("darwinian-worker-skills"), `${label} homepage must use darwinian-worker-skills`, errors);
  assert(manifest.repository?.includes("darwinian-worker-skills"), `${label} repository must use darwinian-worker-skills`, errors);
  assert(manifest.description?.includes("Darwinian Worker"), `${label} description must use Darwinian Worker`, errors);
}

assert(claudeMarketplace.metadata?.version === pkg.version, ".claude-plugin/marketplace.json metadata version must match package.json", errors);
for (const plugin of claudeMarketplace.plugins ?? []) {
  assert(plugin.version === pkg.version, ".claude-plugin/marketplace.json plugin version must match package.json", errors);
  assert(plugin.description?.includes("Darwinian Worker"), ".claude-plugin/marketplace.json plugin description must use Darwinian Worker", errors);
}

const publicFiles = [
  "README.md",
  "cards/README.md",
  "examples/cards/README.md",
  "examples/cards/minimal-card/card.json",
  "MAINTAINERS.md",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".codex-plugin/plugin.json",
];

const forbiddenPatterns = [
  /Darwinian Harness Skills/g,
  /Darwinian Harness Card/g,
  /Darwinian Harness card/g,
  /Harness Cards/g,
  /harness-cards/g,
  /darwinian-harness-skills/g,
];

for (const file of publicFiles) {
  const text = readText(file);
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) {
      errors.push(`${file}: contains stale identity pattern ${pattern}`);
    }
    pattern.lastIndex = 0;
  }
}

const readme = readText("README.md");
assert(readme.includes("@darwinian/operator"), "README.md must document @darwinian/operator", errors);
assert(readme.includes("@darwinian/base-mind"), "README.md must document @darwinian/base-mind", errors);
assert(readme.includes("npm run check:identity"), "README.md must document identity validation", errors);

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`✘ ${error}`);
  }
  process.exit(1);
}

console.log("✓ Identity metadata and public docs are consistent");
