// ABOUTME: Declares which canonical skills are bundled into each card source.
// ABOUTME: Shared by sync, validation, card validation, and smoke scripts.

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

export const PRIMARY_STABLE_SKILLS = [
  "bootstrap-project",
  "manage-project-worker",
  "inspect-worker",
  "repair-worker",
  "author-card",
  "share-card",
  "manage-machine-inventory",
  "manage-machine-capabilities",
];

export const BASE_MIND_SKILLS = [
  "manage-active-mind-stack",
  "author-mind-content",
  "audit-mind-visibility",
];

export const WORKSPACE_EXPERIMENTAL_SKILLS = ["organize-workspace"];

export const cardMaps = [
  {
    name: "@darwinian/operator",
    slug: "operator",
    cardDir: join(rootDir, "cards", "operator"),
    targetDir: join(rootDir, "cards", "operator", "skills"),
    skills: PRIMARY_STABLE_SKILLS,
  },
  {
    name: "@darwinian/workspace-experimental",
    slug: "workspace-experimental",
    cardDir: join(rootDir, "cards", "workspace-experimental"),
    targetDir: join(rootDir, "cards", "workspace-experimental", "skills"),
    skills: WORKSPACE_EXPERIMENTAL_SKILLS,
  },
  {
    name: "@darwinian/base-mind",
    slug: "base-mind",
    cardDir: join(rootDir, "cards", "base-mind"),
    targetDir: join(rootDir, "cards", "base-mind", "skills"),
    skills: BASE_MIND_SKILLS,
  },
];
