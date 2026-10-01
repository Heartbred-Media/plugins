---
name: manage-ruthie
description: Review and work with the user's shared Ruthie agenda when they ask what is coming up, capture or organize work, move or schedule an item, mark progress, or reconcile plans with current reality.
---

# Manage Ruthie

Use Ruthie as the authoritative operating record for the agenda the person asks
you to manage. A conversation can explain a change, but it is not recorded until
the corresponding tool succeeds. Explicit user instructions take precedence over
workflow suggestions here; they do not remove service-enforced access controls.

## Connection and Space

- Use the plugin's hosted MCP connection. Sign-in and renewal belong to Codex's
  native OAuth flow. Never run a local authentication script, read another
  plugin's credential file, request a password/token in chat, or switch to a
  development endpoint to recover access.
- If authorization is missing or revoked, direct the person to the host's
  connection controls. A temporary outage is not proof of revoked permission.
  Do not claim that installation alone proves a working account connection.
- Call `list_spaces` before planning. Bind this conversation to a stable Space
  ID and pass `spaceId` on each planning read and write. If only Personal exists,
  use it; otherwise ask when the intended Space is ambiguous.
- A phone's current selection does not redirect this conversation. Never silently
  fall back to Personal or combine revisions and item IDs from different Spaces.
  If the bound Space disappears, stop and ask; do not rebind by a matching name.
- A review across Spaces is read-only unless the person explicitly requests
  changes. There is no cross-Space move tool; do not emulate one by copying an
  item and completing the original. Manage Spaces in Ruthie's human interface.

## Daily planning

- Hosted today-based tools need the person's confirmed IANA time zone. Ask once
  if unknown and pass `timeZone`; never use the server's zone or guess today.
- Begin daily planning with `get_carry_forward_review` before
  `get_planning_overview`. Reading candidates moves nothing. Describe unfinished
  items with their original dates and ask which to bring to today, leave behind,
  or move elsewhere, including order when bringing several forward.
- An explicit choice in the initiating request counts as approval. A general
  request to review today does not approve moving every unfinished item.
- After the decision, reread the review for current candidates and revisions,
  apply exactly the chosen decision, then read the updated overview. Leaving a
  candidate behind means `bringToToday: false`, not a permanent classification.
- Disclose truncated results. Continue review batches before calling a review
  complete; never infer that an absent item does not exist in a partial result.

## Changes

- Before ordinary writes, call `get_planning_overview` in the same turn and use
  its exact planning revision and current item revision. Carry-forward uses its
  fresh review revisions. Current records supersede recollection and old output.
- Apply small explicit requests such as adding an item or marking it done.
  Propose multi-item reorganizations and obtain approval before writing.
- Keep one canonical item for one commitment. Edit or move it rather than
  duplicating it. Never reopen completed work without an explicit request.
- Preserve the person's wording unless they ask for rewriting or clarification
  is necessary. Record reported completed work, including unplanned work.
- Top of Mind holds at most three unfinished items per Space. Set or clear it
  only when requested. If full, ask which held item to replace and use its ID as
  `replacesTopOfMindLineId` in the same `edit_line` request as the new flag; do
  not clear the old flag in a separate operation.
- Date moves and waiting preserve Top of Mind; completion clears it. An undated
  open item is Flexible. Enter waiting only when the triggering outreach/action
  happened, with the person's dependency, not merely because it is planned.
- Calendar events remain separate commitments. A timed Ruthie item does not
  authorize creating or changing a calendar event.
- Delete and cancel tools are not available. Do not invent them or use another
  service to bypass the supported operations.
- On a revision conflict, stop and reread. Explain and reconcile the newer
  human record rather than retrying the stale write. After an uncertain delivery,
  inspect current state before retrying so a successful write is not duplicated.
