#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd -- "$SKILL_DIR/../../../.." && pwd)"
ASSET_DIR="$SKILL_DIR/assets/effect-ts-check"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

corepack pnpm --dir "$REPO_ROOT/packages/effect-ts-check" pack --pack-destination "$TMP_DIR"

shopt -s nullglob
TARBALLS=("$TMP_DIR"/*.tgz)
shopt -u nullglob

if [[ "${#TARBALLS[@]}" -ne 1 ]]; then
  printf 'Expected exactly one packed effect-ts-check tarball, found %s\n' "${#TARBALLS[@]}" >&2
  exit 1
fi

mkdir -p "$ASSET_DIR"
rm -f "$ASSET_DIR"/*.tgz
mv "${TARBALLS[0]}" "$ASSET_DIR/"
