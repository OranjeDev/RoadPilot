// Checks that every place holding the RoadPilot version agrees.
//
//   node scripts/check-versions.mjs          compare the project files
//   node scripts/check-versions.mjs v0.2.0   also require this release tag to match
//
// Exits with code 1 and lists the differences if anything disagrees.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

/** Version of the `[package]` section in Cargo.toml. */
function cargoTomlVersion() {
  const packageSection = read("src-tauri/Cargo.toml")
    .split(/^\[/m)
    .find((s) => s.startsWith("package]"));
  return packageSection?.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
}

/** Version of the `roadpilot` entry in Cargo.lock. */
function cargoLockVersion() {
  return read("src-tauri/Cargo.lock").match(
    /\[\[package\]\]\r?\nname = "roadpilot"\r?\nversion = "([^"]+)"/,
  )?.[1];
}

const sources = {
  "package.json": JSON.parse(read("package.json")).version,
  "package-lock.json": JSON.parse(read("package-lock.json")).version,
  "src-tauri/tauri.conf.json": JSON.parse(read("src-tauri/tauri.conf.json")).version,
  "src-tauri/Cargo.toml": cargoTomlVersion(),
  "src-tauri/Cargo.lock": cargoLockVersion(),
};

const tag = process.argv[2];
if (tag) {
  sources[`release tag ${tag}`] = tag.replace(/^v/, "");
}

const expected = sources["package.json"];
const mismatches = Object.entries(sources).filter(([, version]) => version !== expected);

if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(expected ?? "")) {
  console.error(`package.json has no valid semantic version: ${expected}`);
  process.exit(1);
}

if (mismatches.length > 0) {
  console.error(`Version mismatch. package.json says ${expected}, but:`);
  for (const [source, version] of mismatches) {
    console.error(`  ${source}: ${version ?? "(not found)"}`);
  }
  process.exit(1);
}

console.log(`All versions agree: ${expected}`);
