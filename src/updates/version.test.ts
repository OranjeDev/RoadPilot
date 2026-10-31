import { describe, expect, it } from "vitest";
import { compareVersions, isNewerVersion, parseVersion } from "./version";

function compare(a: string, b: string): number {
  const left = parseVersion(a);
  const right = parseVersion(b);
  if (!left || !right) throw new Error(`invalid test version: ${a} / ${b}`);
  return compareVersions(left, right);
}

describe("parseVersion", () => {
  it("parses plain, v-prefixed, pre-release and build versions", () => {
    expect(parseVersion("0.1.0")).toEqual({ major: 0, minor: 1, patch: 0, prerelease: [] });
    expect(parseVersion("v0.2.0")).toEqual({ major: 0, minor: 2, patch: 0, prerelease: [] });
    expect(parseVersion("1.0.0-beta.2")?.prerelease).toEqual(["beta", "2"]);
    expect(parseVersion("1.0.0+build.7")?.prerelease).toEqual([]);
  });

  it("rejects invalid versions", () => {
    for (const text of ["", "1", "1.2", "1.2.3.4", "01.2.3", "1.2.x", "latest", "1.2.3-"]) {
      expect(parseVersion(text), text).toBeNull();
    }
  });
});

describe("compareVersions", () => {
  it("orders by major, minor and patch numerically", () => {
    expect(compare("0.2.0", "0.1.0")).toBe(1);
    expect(compare("0.1.0", "0.2.0")).toBe(-1);
    expect(compare("0.10.0", "0.9.0")).toBe(1);
    expect(compare("1.0.0", "0.99.99")).toBe(1);
    expect(compare("0.1.1", "0.1.0")).toBe(1);
    expect(compare("0.1.0", "v0.1.0")).toBe(0);
  });

  it("ranks releases above their pre-releases", () => {
    expect(compare("1.0.0", "1.0.0-rc.1")).toBe(1);
    expect(compare("1.0.0-rc.1", "1.0.0")).toBe(-1);
  });

  it("follows the semver pre-release precedence example", () => {
    const ordered = [
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-alpha.beta",
      "1.0.0-beta",
      "1.0.0-beta.2",
      "1.0.0-beta.11",
      "1.0.0-rc.1",
      "1.0.0",
    ];
    for (let i = 0; i < ordered.length - 1; i += 1) {
      const lower = ordered[i] ?? "";
      const higher = ordered[i + 1] ?? "";
      expect(compare(lower, higher), `${lower} < ${higher}`).toBe(-1);
    }
  });

  it("ignores build metadata", () => {
    expect(compare("1.0.0+a", "1.0.0+b")).toBe(0);
  });
});

describe("isNewerVersion", () => {
  it("is true only for strictly newer versions", () => {
    expect(isNewerVersion("0.2.0", "0.1.0")).toBe(true);
    expect(isNewerVersion("0.1.0", "0.1.0")).toBe(false);
    expect(isNewerVersion("0.0.9", "0.1.0")).toBe(false);
  });

  it("is false when either version is invalid", () => {
    expect(isNewerVersion("demo", "0.1.0")).toBe(false);
    expect(isNewerVersion("0.2.0", "")).toBe(false);
  });
});
