# Heartbred plugins

Plugin packages for Heartbred products. Each package contains its skills,
presentation assets, and connection information. Ruthie's MCP service is hosted;
the package does not install or run a local MCP server.

## Availability

Ruthie's remote Codex beta connection is being prepared. Its catalog entry is
currently unavailable. Installation and sign-in have not yet passed the complete
independent-account rehearsal; this repository is not an announcement of support
for every Codex client or account plan.

When enabled, an invited tester will use Codex's supported marketplace and plugin
installation flow, then sign in to Ruthie through the provider-owned authorization
screen. Installation does not create a Ruthie account or grant access to anyone's
agenda. Ruthie admission and Space permissions are enforced by the service.

Do not paste passwords, sign-in codes, or access tokens into a chat. There is no
Bun installation, local authentication script, or application source checkout in
this setup. A local cached plugin package is not a local MCP server.

## Ruthie

Ruthie is the shared operating record for a person and the assistants they choose.
Assistants read and update it through guarded operations; later human corrections
remain authoritative. The remote endpoint is `https://mcp.ruthie.app/mcp`.

Learn about [Ruthie](https://ruthie.app) or [get support](https://ruthie.app/support/).
Do not put private agenda contents or credentials into a public repository issue.

## Package layout

The catalog is `.agents/plugins/marketplace.json`. The Ruthie package is
`plugins/ruthie/`, with `plugin.json`, `mcp.json`, `skills/`, and `assets/`.
This follows [OpenAI's plugin packaging format](https://developers.openai.com/plugins/build/plugins).

This marketplace is separate from OpenAI's public plugin directory. Presence
here does not imply directory review or approval by OpenAI.

## Maintaining this repository

This is the authoritative home for Heartbred's marketplace files. It is independent
of each product's application repository. Future products can add their own
package under `plugins/` and a catalog entry through a reviewed PR.

Maintainers run `bun test`; no dependency installation is needed. Bun is not a
tester requirement. See [CONTRIBUTING.md](CONTRIBUTING.md) for review, publication
and plugin-enablement gates.
