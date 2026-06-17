#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ASSET_DIR="$SCRIPT_DIR/../assets/effect-ts-check"
shopt -s nullglob
TARBALLS=("$ASSET_DIR"/prover-coder-ai-effect-ts-check-*.tgz)
shopt -u nullglob

if [[ "${#TARBALLS[@]}" -eq 0 ]]; then
  printf 'Bundled effect-ts-check tarball not found in: %s\n' "$ASSET_DIR" >&2
  exit 1
fi

TARBALL="${TARBALLS[0]}"

if [[ "$#" -eq 0 ]]; then
  set -- "."
fi

exec npx --yes --package "$TARBALL" effect-ts-check "$@"
