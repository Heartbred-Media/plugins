import { describe, expect, test } from "bun:test";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const plugin = "plugins/ruthie";
const read = (path: string) => readFileSync(join(root, path), "utf8");
const json = (path: string) => JSON.parse(read(path));

function inventory(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) throw new Error("Packages cannot contain symlinks");
    if (stat.isDirectory()) return inventory(path);
    if (!stat.isFile()) throw new Error("Packages must contain regular files");
    return [relative(root, path).replaceAll("\\", "/")];
  }).sort();
}

describe("Heartbred marketplace foundation", () => {
  test("catalog offers Ruthie's remote beta with authentication on install", () => {
    expect(json(".agents/plugins/marketplace.json")).toEqual({
      name: "heartbred",
      interface: { displayName: "Heartbred" },
      plugins: [{
        name: "ruthie",
        source: { source: "local", path: "./plugins/ruthie" },
        policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
        category: "Productivity",
      }],
    });
  });

  test("Ruthie package contains only the reviewed distribution files", () => {
    expect(inventory(join(root, plugin))).toEqual([
      `${plugin}/.codex-plugin/plugin.json`,
      `${plugin}/.mcp.json`,
      `${plugin}/assets/ruthie-icon.png`,
      `${plugin}/skills/manage-ruthie/SKILL.md`,
    ]);
  });

  test("MCP is production HTTPS only with explicit least-privilege OAuth scopes", () => {
    expect(json(`${plugin}/.mcp.json`)).toEqual({
      mcpServers: { ruthie: {
        type: "http",
        url: "https://mcp.ruthie.app/mcp",
        scopes: ["ruthie:read", "ruthie:write", "offline_access"],
      } },
    });
  });

  test("Codex manifest explicitly wires skills and scoped MCP without a portable override", () => {
    const manifest = json(`${plugin}/.codex-plugin/plugin.json`);
    expect(Object.keys(manifest).sort()).toEqual([
      "author", "description", "homepage", "interface", "mcpServers", "name", "skills", "version",
    ]);
    expect(manifest.skills).toBe("./skills/");
    expect(manifest.mcpServers).toBe("./.mcp.json");
    expect(manifest.name).toBe("ruthie");
    expect(manifest.version).toBe("0.1.0-beta.3");
    expect(manifest.author).toEqual({ name: "Heartbred", url: "https://ruthie.app" });
    expect(manifest.interface.developerName).toBe("Heartbred");
    expect(manifest.interface.composerIcon).toBe("./assets/ruthie-icon.png");
    expect(manifest.interface.logo).toBe("./assets/ruthie-icon.png");
    expect(readFileSync(join(root, plugin, "assets/ruthie-icon.png")).subarray(0, 8))
      .toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  });

  test("public package text excludes known private paths, hosts and secret patterns", () => {
    const files = ["README.md", ".agents/plugins/marketplace.json", ...inventory(join(root, plugin))];
    for (const path of files.filter((path) => !path.endsWith(".png"))) {
      expect(read(path)).not.toMatch(
        /\/Users\/|dev-mcp\.|dev-account\.|localhost|127\.0\.0\.1|sk_live_|sk_test_|Bearer\s+[A-Za-z0-9_-]+|-----BEGIN .*PRIVATE KEY-----/,
      );
    }
  });

  test("beta instructions use the native marketplace and retain acceptance boundaries", () => {
    const readme = read("README.md");
    expect(readme).toContain("codex plugin marketplace add Heartbred-Media/plugins --ref main");
    expect(readme).toContain("codex plugin marketplace upgrade heartbred");
    expect(readme).toContain("independent-account installation from the published catalog remains");
    expect(readme).toContain("does not imply directory review or approval by OpenAI");
    expect(readme).not.toContain("currently unavailable");
  });

  test("skill has hosted planning safeguards without a local diagnostic dependency", () => {
    const skill = read(`${plugin}/skills/manage-ruthie/SKILL.md`);
    expect(skill.startsWith("---\nname: manage-ruthie\n")).toBe(true);
    for (const required of ["list_spaces", "spaceId", "timeZone", "IANA", "get_carry_forward_review", "get_planning_overview", "revision", "approval", "replacesTopOfMindLineId"]) {
      expect(skill).toContain(required);
    }
    expect(skill).not.toContain("get_connection_status");
    expect(skill).not.toContain("make plugin-connect");
  });
});
