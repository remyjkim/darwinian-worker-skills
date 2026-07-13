// ABOUTME: Pins the Worker/Card-only Operator payload and canonical-copy boundary.
// ABOUTME: Rejects retired command grammar and dedicated Mind tooling in Operator.

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { PRIMARY_STABLE_SKILLS } from "../scripts/card-map.mjs";

const root = join(import.meta.dirname, "..");
const operatorRoot = join(root, "cards", "operator");
const canonicalRoot = join(root, "skills");
const expectedSkills = [
  "bootstrap-project",
  "manage-project-worker",
  "inspect-worker",
  "repair-worker",
  "author-card",
  "share-card",
  "manage-machine-inventory",
  "manage-machine-capabilities",
];
const forbiddenIds = [
  "apply-mind-card",
  "manage-active-mind-stack",
  "manage-library",
  "manage-defaults",
  "materialize-minds",
  "author-mind-card",
  "install-project",
  "inspect-minds",
  "repair-minds",
  "recommend-minds",
  "share-mind-card",
  "support-minds",
  "sync-card-skills",
  "import-mcp-from-claude",
  "author-mind-content",
  "audit-mind-visibility",
];
const forbiddenContent = [
  /drwn card (?:add|apply|pin|remove|update|detach)\b/,
  /drwn (?:mind|worker mind)\b/,
  /drwn library\b/,
  /drwn store\b/,
  /drwn skills (?:curate|uncurate)\b/,
  /--no-apply\b/,
  /\b(?:persona|beliefs?|memory|BeginningDB|Mind Card|Mind tooling)\b/i,
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function listDirs(path) {
  return readdirSync(path)
    .filter((name) => statSync(join(path, name)).isDirectory())
    .sort();
}

function listFiles(path, prefix = "") {
  return readdirSync(path).sort().flatMap((name) => {
    const absolute = join(path, name);
    const relative = prefix ? `${prefix}/${name}` : name;
    return statSync(absolute).isDirectory() ? listFiles(absolute, relative) : [relative];
  });
}

test("Operator exposes exactly the approved eight Worker/Card skills", () => {
  const manifest = readJson(join(operatorRoot, "card.json"));
  const packageJson = readJson(join(operatorRoot, "package.json"));
  assert.deepEqual(PRIMARY_STABLE_SKILLS, expectedSkills);
  assert.deepEqual(manifest.skills?.include, expectedSkills);
  assert.deepEqual(listDirs(join(operatorRoot, "skills")), [...expectedSkills].sort());
  assert.equal(manifest.version, "2.0.0");
  assert.equal(packageJson.version, "2.0.0");
  assert.deepEqual(manifest.harness, { minVersion: "0.9.0" });
  assert.equal(manifest.lastValidatedWith, "0.9.0");
  assert.deepEqual(manifest.servers, {});
});

test("Operator generated skills are byte-identical to canonical sources", () => {
  for (const skill of expectedSkills) {
    const canonical = join(canonicalRoot, skill);
    const generated = join(operatorRoot, "skills", skill);
    assert.equal(existsSync(canonical), true, `missing canonical skill ${skill}`);
    assert.deepEqual(listFiles(generated), listFiles(canonical), `${skill} file inventory drift`);
    for (const path of listFiles(canonical)) {
      assert.deepEqual(
        readFileSync(join(generated, path)),
        readFileSync(join(canonical, path)),
        `${skill}/${path} byte drift`,
      );
    }
  }
});

test("Operator contains no retired IDs, commands, or Mind-specific tooling", () => {
  const manifestText = readFileSync(join(operatorRoot, "card.json"), "utf8");
  const payload = [manifestText, ...listFiles(join(operatorRoot, "skills"))
    .map((path) => readFileSync(join(operatorRoot, "skills", path), "utf8"))].join("\n");
  for (const id of forbiddenIds) {
    assert.equal(payload.includes(id), false, `retired Operator ID: ${id}`);
  }
  for (const pattern of forbiddenContent) {
    assert.equal(pattern.test(payload), false, `forbidden Operator content: ${pattern}`);
  }
});

test("root bundle includes every Operator source without redefining its allowlist", () => {
  const bundle = readJson(join(root, "bundle.json"));
  const byName = new Map(bundle.skills.map((skill) => [skill.name, skill]));
  for (const skill of expectedSkills) {
    assert.deepEqual(byName.get(skill), { name: skill, scope: "shared", path: `skills/${skill}` });
  }
  assert.equal(new Set(PRIMARY_STABLE_SKILLS).size, expectedSkills.length);
});
