/**
 * Semantic Versioning (semver.org) parsing and comparison.
 * Used as a safety net: the UI only offers an update whose version is
 * strictly newer than the installed one.
 */

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  /** Pre-release identifiers, e.g. ["beta", "2"] for "1.0.0-beta.2". Empty for releases. */
  prerelease: readonly string[];
}

const SEMVER_PATTERN =
  /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

/** Parses "1.2.3", "v1.2.3", "1.2.3-beta.1" or "1.2.3+build". Returns null if invalid. */
export function parseVersion(text: string): SemVer | null {
  const match = SEMVER_PATTERN.exec(text.trim());
  if (!match) return null;

  const [, major, minor, patch, prerelease] = match;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: prerelease ? prerelease.split(".") : [],
  };
}

const NUMERIC = /^\d+$/;

function compareIdentifiers(a: string, b: string): number {
  const aNumeric = NUMERIC.test(a);
  const bNumeric = NUMERIC.test(b);
  if (aNumeric && bNumeric) return Math.sign(Number(a) - Number(b));
  // Numeric identifiers have lower precedence than alphanumeric ones.
  if (aNumeric) return -1;
  if (bNumeric) return 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Negative if a < b, 0 if equal, positive if a > b. Build metadata is ignored. */
export function compareVersions(a: SemVer, b: SemVer): number {
  const core = a.major - b.major || a.minor - b.minor || a.patch - b.patch;
  if (core !== 0) return Math.sign(core);

  // A release ranks above its pre-releases: 1.0.0 > 1.0.0-beta.
  if (a.prerelease.length === 0 && b.prerelease.length === 0) return 0;
  if (a.prerelease.length === 0) return 1;
  if (b.prerelease.length === 0) return -1;

  const length = Math.max(a.prerelease.length, b.prerelease.length);
  for (let i = 0; i < length; i += 1) {
    const left = a.prerelease[i];
    const right = b.prerelease[i];
    if (left === undefined) return -1;
    if (right === undefined) return 1;
    const result = compareIdentifiers(left, right);
    if (result !== 0) return result;
  }
  return 0;
}

/** True only if both versions are valid and `candidate` is strictly newer than `installed`. */
export function isNewerVersion(candidate: string, installed: string): boolean {
  const next = parseVersion(candidate);
  const current = parseVersion(installed);
  if (!next || !current) return false;
  return compareVersions(next, current) > 0;
}
