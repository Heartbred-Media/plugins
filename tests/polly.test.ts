import { expect, test } from "bun:test";
import { readFileSync, readdirSync, lstatSync } from "node:fs";
import { resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path: string) => readFileSync(join(root, path), "utf8");
const json = (path: string) => JSON.parse(read(path));
const plugin = "plugins/polly";

test("both catalogs resolve Polly to the same in-repository package", () => {
  for (const [path, host] of [[".agents/plugins/marketplace.json", "codex"], [".claude-plugin/marketplace.json", "claude"]]) {
    const entries = json(path).plugins;
    expect(new Set(entries.map((e: {name: string}) => e.name)).size).toBe(entries.length);
    const polly = entries.find((e: {name: string}) => e.name === "polly");
    const source = host === "codex" ? polly.source.path : polly.source;
    expect(relative(root, resolve(root, source))).toBe(plugin);
    const manifest = json(`${source}/.${host}-plugin/plugin.json`);
    expect(manifest.name).toBe(polly.name);
  }
});

test("host manifests share one skill and version without runtime hooks", () => {
  const codex = json(`${plugin}/.codex-plugin/plugin.json`);
  const claude = json(`${plugin}/.claude-plugin/plugin.json`);
  expect(codex.version).toBe(claude.version);
  expect(codex.version).toMatch(/^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/);
  for (const manifest of [codex, claude]) {
    expect(manifest.skills).toBe("./skills/");
    expect(manifest.mcpServers).toBeUndefined();
    expect(manifest.hooks).toBeUndefined();
    expect(manifest.author.name).toBe("Heartbred");
  }
  const skill = read(`${plugin}/skills/use-polly/SKILL.md`);
  expect(skill).toMatch(/^---\nname: use-polly\ndescription: .+\n---\n/);
  for (const match of skill.matchAll(/\]\((references\/[^)]+)\)/g)) {
    expect(read(`${plugin}/skills/use-polly/${match[1]}`).length).toBeGreaterThan(0);
  }
});

test("Polly ships only instructions and manifests without machine-specific data", () => {
  function walk(dir: string): string[] {
    return readdirSync(join(root, dir)).flatMap(name => {
      const path = `${dir}/${name}`;
      const stat = lstatSync(join(root, path));
      expect(stat.isSymbolicLink()).toBe(false);
      if (stat.isDirectory()) return walk(path);
      expect(stat.isFile()).toBe(true);
      expect(stat.mode & 0o111).toBe(0);
      return [path];
    }).sort();
  }
  const files = walk(plugin);
  expect(files).toEqual([
    `${plugin}/.claude-plugin/plugin.json`, `${plugin}/.codex-plugin/plugin.json`,
    `${plugin}/skills/use-polly/SKILL.md`, `${plugin}/skills/use-polly/references/commands.md`,
  ]);
  for (const path of [...files, ".claude-plugin/marketplace.json"]) {
    expect(read(path)).not.toMatch(/\/Users\/|localhost|127\.0\.0\.1|Bearer\s+[A-Za-z0-9_-]+|-----BEGIN .*PRIVATE KEY-----/);
  }
});
