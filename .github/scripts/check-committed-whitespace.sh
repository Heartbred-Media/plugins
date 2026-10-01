#!/usr/bin/env bash
set -euo pipefail

base="${BASE_SHA:?BASE_SHA must identify the PR base or previous push commit}"
if [[ "$base" =~ ^0+$ ]]; then
  # A new branch push has no previous commit; inspect its entire tree.
  base="$(git hash-object -w -t tree /dev/null)"
fi
git diff --check "$base" HEAD
