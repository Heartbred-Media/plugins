# Command examples

Run `--cli help` for the installed version's complete commands. Commands return `{ "ok": true, "result": ... }` or `{ "ok": false, "error": { "code": ..., "message": ... } }` with a nonzero exit status. Read the envelope and status before using a result. Help and `drawing-help` return plain text.

The examples below assume `app` is the user-selected application path resolved by the skill. They do not configure another library.

```python
import base64
import json
from pathlib import Path
import subprocess

# If the user supplied an app path, validate and use that instead.
candidates = [Path('/Applications/Polly Draws.app'),
              Path.home() / 'Applications/Polly Draws.app']
apps = [p for p in candidates if (p / 'Contents/MacOS/Polly Draws').is_file()]
if len(apps) != 1:
    raise RuntimeError('No unique Polly installation: ask the user for its location.')
app = apps[0]
cli = [str(app / 'Contents/MacOS/Polly Draws'), '--cli']

def polly(command, **options):
    args = cli + [command]
    for key, value in options.items():
        args += ['--' + key.replace('_', '-'), str(value)]
    process = subprocess.run(args, capture_output=True, text=True, check=True)
    envelope = json.loads(process.stdout)
    if not envelope.get('ok'):
        raise RuntimeError(envelope['error'])
    return envelope['result']

context = polly('context')
# Resolve the requested project by its name, then use the returned ID.
# Inspect matching artwork and choose the intended variation before exporting.
```

Search: `find --project PROJECT_ID --query 'toolbar head'`. Search matches metadata and variation names; if a detailed phrase yields no match, list the project's artwork or use fewer meaningful words. `inspect --asset ID` returns variations, each with its revisions in order; the last revision is current.

After choosing actual IDs returned by `inspect`:

```python
result = polly('export-data', asset=asset_id, variation=variation_id,
               expected=revision_id, format='svg')
assert result['revisionID'] == revision_id
output = Path('assets/header.svg')  # The requested consuming-project destination.
output.parent.mkdir(parents=True, exist_ok=True)
output.write_bytes(base64.b64decode(result['dataBase64'], validate=True))
```

For PNG, use `format='png', width=64` for a 32 pt asset at 2×. `width` is not valid for SVG. Keep image payloads out of conversation logs; save the bytes and report the filename and revision instead.

An ordinary edit is `edit --asset ID --variation ID --expected REVISION_ID --element ELEMENT_ID --color '#E87524' --channel fill`. `scale --factor 2` scales the canvas, drawing and strokes together. Use `vary` first if the request calls for a separate variation. Keep `--expected` tied to the particular variation being changed.

Pass complete drawing/operation JSON with `subprocess.run(..., input=json.dumps(recipe), text=True)` and `--drawing -` or `--operations -`; do not interpolate JSON into a shell command. The installed `drawing-help` describes shape, path, grouping and transform fields.
