# Maintaining the marketplace

This repository owns the Heartbred catalog and distributable plugin packages.
It can contain multiple products. Each product keeps its own backend, identity,
access controls and deployments elsewhere.

## Review

1. Create a feature branch and make the complete package change.
2. Run `bun test` and `git diff --check`.
3. Open a PR here for CodeRabbit and human review; fix valid findings and rerun
   affected checks on the final revision.
4. Ruzz merges the reviewed PR. Do not merge automatically.

This repository is public. Review new commits, PR text, assets and author identity
before pushing, not just the final file contents. Any future repository visibility
change is a separate authorized action.
Never import another repository's Git history or private review discussions.

## Enabling a plugin

`NOT_AVAILABLE` means the catalog entry is prepared but not offered for installation.
It does not disable a deployed backend or affect installations from other sources.

The initial marketplace can be published while Ruthie is still unavailable.
Before changing its policy to `AVAILABLE`, verify the production hosted connection
with the native host's OAuth, scoped reads/writes, refresh/reconnect and revocation.
Record safe evidence in the enablement PR without tokens or personal agenda data.
Use another marketplace PR to update availability, version, README and checks.
Then verify installation from the published repository with an independent account
before advertising the public setup journey. Directory approval is separate.

Development rehearsal uses a separate non-public catalog/package and disposable
accounts. Never publish a development endpoint here or replace a user's existing
working connection as a test side effect.

## Package changes

Use a stable product name and a versioned package under `plugins/<product>/`.
Keep the catalog path inside this repository. Skills and assets belong to that
package. Remote MCP configuration contains only the transport, public HTTPS
endpoint and explicit OAuth scopes; credentials and local runtimes do not belong
in the package. Ruthie uses the supported Codex compatibility manifest and
`.mcp.json` to request only read, write and offline access. Do not add a portable
root manifest/MCP file that could take precedence and discard the explicit scopes.
Package tests check this boundary; native host authorization must separately prove
the actual request contains exactly the intended scopes without a CLI override.

Review package updates and live host update behavior rather than assuming a
changed version immediately refreshes every installation. Do not invent a license
grant for assets or source. Review applicable policy links before enabling a
package or submitting it to a public directory.

The root Bun test setup is for maintainers and CI only. Testers do not install Bun
or run this repository as an application.
