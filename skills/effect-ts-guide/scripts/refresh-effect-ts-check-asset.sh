#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd -- "$SKILL_DIR/../.." && pwd)"
ASSET_DIR="$SKILL_DIR/assets/effect-ts-check"

mkdir -p "$ASSET_DIR"
rm -f "$ASSET_DIR"/*.tgz

pnpm --dir "$REPO_ROOT/packages/effect-ts-check" pack --pack-destination "$ASSET_DIR"
