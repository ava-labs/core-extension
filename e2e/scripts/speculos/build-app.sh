#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

# Digest of `latest` verified on 2026-11-24; no release tag points at it.
BUILDER_IMAGE="${LEDGER_APP_BUILDER_IMAGE:-ghcr.io/ledgerhq/ledger-app-builder/ledger-app-builder@sha256:20ea271c99f5055c1cbe04f285351af577d4ff2a5c8f95dcd980ed59a9846a09}"

if [ -f "$APP_ELF" ]; then
  echo "Avalanche app $LEDGER_AVALANCHE_VERSION already built: $APP_ELF"
  exit 0
fi

require_docker

# Build from ava-labs/ledger-avalanche: the LedgerHQ/app-avalanche mirror tags a
# different commit for the same version.
SRC_DIR="$CACHE_DIR/src/$LEDGER_AVALANCHE_VERSION"
rm -rf "$SRC_DIR"
mkdir -p "$(dirname "$SRC_DIR")" "$APP_DIR"

git clone --depth 1 --branch "$LEDGER_AVALANCHE_VERSION" \
  --recurse-submodules --shallow-submodules \
  https://github.com/ava-labs/ledger-avalanche.git "$SRC_DIR"

# The -lite builder image lacks cargo, which the app needs.
docker run --rm -v "$SRC_DIR:/app" -w /app \
  "$BUILDER_IMAGE" \
  bash -c 'make -C app BOLOS_SDK=$NANOSP_SDK -j$(nproc)'

BUILT_ELF="$SRC_DIR/app/build/nanos2/bin/app.elf"
if [ ! -f "$BUILT_ELF" ]; then
  echo "Build finished but $BUILT_ELF was not produced." >&2
  exit 1
fi

cp "$BUILT_ELF" "$APP_ELF"
rm -rf "$SRC_DIR"
echo "Built Avalanche app $LEDGER_AVALANCHE_VERSION: $APP_ELF"
