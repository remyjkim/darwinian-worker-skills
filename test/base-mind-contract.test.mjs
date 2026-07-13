// ABOUTME: Pins base-mind to dedicated Mind authoring and visibility responsibilities.
// ABOUTME: Rejects retired Mind-stack workflows and numbered or in-tree memory contracts.

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { BASE_MIND_SKILLS } from "../scripts/card-map.mjs";

const root = join(import.meta.dirname, "..");
const cardRoot = join(root, "cards", "base-mind");
const expectedSkills = ["author-mind-content", "audit-mind-visibility"];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function listDirs(path) {
  return readdirSync(path)
    .filter((name) => statSync(join(path, name)).isDirectory())
    .sort();
}

test("base-mind declares semantic Mind capability and exactly two dedicated skills", () => {
  const manifest = readJson(join(cardRoot, "card.json"));
  assert.deepEqual(BASE_MIND_SKILLS, expectedSkills);
  assert.deepEqual(manifest.skills?.include, expectedSkills);
  assert.deepEqual(listDirs(join(cardRoot, "skills")), [...expectedSkills].sort());
  assert.deepEqual(manifest.memory, {
    observations: { format: "jsonl" },
    insights: { format: "md" },
  });
  assert.equal(manifest.version, "0.2.0");
  assert.deepEqual(manifest.harness, { minVersion: "0.9.0" });
  assert.equal(manifest.lastValidatedWith, "0.9.0");
});

test("base-mind generated skills are byte-identical to canonical sources", () => {
  for (const skill of expectedSkills) {
    assert.deepEqual(
      readFileSync(join(cardRoot, "skills", skill, "SKILL.md")),
      readFileSync(join(root, "skills", skill, "SKILL.md")),
      `${skill} generated copy drift`,
    );
  }
});

test("base-mind contains no retired stack or numbered-memory contract", () => {
  const files = [
    join(cardRoot, "card.json"),
    ...readdirSync(join(cardRoot, "persona", "voice")).map((file) => join(cardRoot, "persona", "voice", file)),
    ...readdirSync(join(cardRoot, "beliefs"))
      .flatMap((belief) => readdirSync(join(cardRoot, "beliefs", belief))
        .map((file) => join(cardRoot, "beliefs", belief, file))),
    ...expectedSkills.map((skill) => join(root, "skills", skill, "SKILL.md")),
  ];
  const payload = files.map((file) => readFileSync(file, "utf8")).join("\n");
  const forbidden = [
    /manage-active-mind-stack/,
    /drwn mind (?:list|use|clear)\b/,
    /active mind stack/i,
    /add-memory|remove-memory/,
    /--layer\b/,
    /\b[Ll][456]\b|\/l[456](?:\/|\b)/,
  ];
  for (const pattern of forbidden) {
    assert.equal(pattern.test(payload), false, `forbidden base-mind content: ${pattern}`);
  }
  assert.match(payload, /memory has no visibility/i);
  assert.equal(existsSync(join(root, "skills", "manage-active-mind-stack")), false);
});

test("base-mind sync can be checked without selecting other Cards", () => {
  const result = spawnSync(process.execPath, ["scripts/sync-card-skills.mjs", "--check", "--card", "base-mind"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /base-mind/);
});
