# Heartbred plugins

Plugin packages for Heartbred products. Each package contains its skills,
presentation assets, and connection information. Ruthie's MCP service is hosted;
the package does not install or run a local MCP server.

## Availability

Ruthie's remote Codex plugin is available here for invited beta testers with an
existing Ruthie account. This is a controlled beta, not an announcement of support
for every Codex client, operating system or account plan.

Installation does not create a Ruthie account or grant access to anyone's
agenda. Ruthie admission and Space permissions are enforced by the service.

## Install for the beta

Use an up-to-date Codex client with plugin marketplace support. Register this
repository using the official Codex CLI:

```sh
codex plugin marketplace add Heartbred-Media/plugins --ref main
```

Then restart the desktop app, open its Plugins Directory, choose **Heartbred**,
and install **Ruthie**. Sign in to your Ruthie account in the browser and approve
the requested read, write and offline access. Check that the consent screen shows
the intended Ruthie account before approving. Start a new chat and ask Codex to
list your Ruthie Spaces before making changes.

If you registered the catalog while Ruthie was unavailable, refresh it first:

```sh
codex plugin marketplace upgrade heartbred
```

These are [OpenAI's supported marketplace commands](https://developers.openai.com/plugins/build/plugins),
not a custom installer. If your client lacks the command or the Heartbred entry,
contact beta support; do not substitute a development endpoint or another person's
credentials. Existing owner-local installations are not migrated by these instructions;
ask beta support before replacing one.

Do not paste passwords, sign-in codes, or access tokens into a chat. There is no
Bun installation, local authentication script, or application source checkout in
this setup. A local cached plugin package is not a local MCP server.

## Verification status

Production verification on October 3, 2026 used native Codex 0.159.2 with an
isolated installation of the package preceding this availability/version update.
Sign-in, scoped reads, guarded create/edit/complete, duplicate prevention,
stale-write rejection, token refresh, revocation and reconnect passed. Refresh
used simulated local-cache expiry against the real provider, not a full token-lifetime
endurance test. This release leaves the MCP configuration and skill unchanged.

An independent-account installation from the published catalog remains
the next acceptance check before broader onboarding. Package checks alone do not
prove that journey or compatibility with every client.

## Ruthie

Ruthie is the shared operating record for a person and the assistants they choose.
Assistants read and update it through guarded operations; later human corrections
remain authoritative. The remote endpoint is `https://mcp.ruthie.app/mcp`.

Learn about [Ruthie](https://ruthie.app) or [get support](https://ruthie.app/support/).
Do not put private agenda contents or credentials into a public repository issue.

## Package layout

The catalog is `.agents/plugins/marketplace.json`. The Ruthie package is
`plugins/ruthie/`, with `.codex-plugin/plugin.json`, `.mcp.json`, `skills/`,
and `assets/`. This uses the supported Codex compatibility layout in
[OpenAI's plugin packaging format](https://developers.openai.com/plugins/build/plugins).
The MCP configuration explicitly requests `ruthie:read`, `ruthie:write`, and
`offline_access` so authorization does not default to broader provider scopes.
There is no competing portable root manifest or MCP configuration.

This marketplace is separate from OpenAI's public plugin directory. Presence
here does not imply directory review or approval by OpenAI.

## Maintaining this repository

This is the authoritative home for Heartbred's marketplace files. It is independent
of each product's application repository. Future products can add their own
package under `plugins/` and a catalog entry through a reviewed PR.

Maintainers run `bun test`; no dependency installation is needed. Bun is not a
tester requirement. See [CONTRIBUTING.md](CONTRIBUTING.md) for review, publication
and plugin-enablement gates.
