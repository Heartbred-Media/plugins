import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../.github/scripts/check-committed-whitespace.sh", import.meta.url));
const fixtures: string[] = [];

function git(cwd: string, ...args: string[]): string {
  const result = Bun.spawnSync(["git", ...args], { cwd });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
}

function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), "heartbred-whitespace-"));
  fixtures.push(cwd);
  git(cwd, "init", "--quiet");
  git(cwd, "config", "user.name", "Test fixture");
  git(cwd, "config", "user.email", "fixture@example.invalid");
  git(cwd, "config", "commit.gpgsign", "false");
  git(cwd, "commit", "--allow-empty", "-m", "Base");
  return { cwd, base: git(cwd, "rev-parse", "HEAD") };
}

function commitText(cwd: string, text: string) {
  writeFileSync(join(cwd, "example.txt"), text);
  git(cwd, "add", "example.txt");
  git(cwd, "commit", "-m", "Fixture change");
}

function check(cwd: string, base: string) {
  return Bun.spawnSync(["bash", script], { cwd, env: { ...process.env, BASE_SHA: base } });
}

afterEach(() => {
  for (const directory of fixtures.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("committed whitespace check", () => {
  test("catches committed whitespace when the working tree is clean", () => {
    const { cwd, base } = fixture();
    commitText(cwd, "trailing space \n");
    expect(git(cwd, "status", "--porcelain")).toBe("");
    expect(check(cwd, base).exitCode).not.toBe(0);
  });

  test("passes a clean committed range", () => {
    const { cwd, base } = fixture();
    commitText(cwd, "clean line\n");
    expect(check(cwd, base).exitCode).toBe(0);
  });

  test("checks the whole tree on an initial push", () => {
    const { cwd } = fixture();
    commitText(cwd, "trailing space \n");
    expect(check(cwd, "0".repeat(40)).exitCode).not.toBe(0);
  });

  test("fails closed if the base is missing or unavailable", () => {
    const { cwd } = fixture();
    expect(check(cwd, "").exitCode).not.toBe(0);
    expect(check(cwd, "1".repeat(40)).exitCode).not.toBe(0);
  });

  test("workflow fetches history and passes an event commit through the environment", () => {
    const workflow = readFileSync(new URL("../.github/workflows/validate.yml", import.meta.url), "utf8");
    expect(workflow).toContain("fetch-depth: 0");
    expect(workflow).toContain("BASE_SHA: ${{ github.event.pull_request.base.sha || github.event.before }}");
    expect(workflow).toContain("run: bash .github/scripts/check-committed-whitespace.sh");
    expect(workflow).toContain("oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6");
  });
});
