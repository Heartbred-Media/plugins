# Heartbred plugin marketplace

This is an independent distribution repository, not the Ruthie application.
Keep all marketplace and package changes here. Backend, authentication and
website changes belong in the applicable product repository.

- Read README.md and CONTRIBUTING.md before editing.
- Work on a `codex/` feature branch. Ruzz merges pull requests.
- Run `bun test` and `git diff --check` before opening a ready PR.
- Keep production credentials, private application source/history, internal
  account identifiers and personal contact information out of this repository.
- Use Heartbred publisher branding and a privacy-preserving Git author email.
- Native host installation and OAuth own setup. Do not add bespoke installers,
  local MCP runtimes, authentication scripts or credential files.
- Do not enable an unavailable plugin until its product's production integration
  has been separately reviewed, deployed and verified.
- Repository visibility and public-directory submissions are deliberate release
  actions, not automatic consequences of a merge. Follow Ruzz's explicit approval.
- Add other real product packages under `plugins/`; do not add empty placeholders.

Passing package checks is not evidence of live sign-in, access control, or
compatibility with every host, operating system or account plan.
