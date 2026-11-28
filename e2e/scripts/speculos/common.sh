#!/usr/bin/env bash

E2E_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CACHE_DIR="$E2E_DIR/.speculos"
LEDGER_AVALANCHE_VERSION="${LEDGER_AVALANCHE_VERSION:-v1.4.22}"
SPECULOS_PORT="${SPECULOS_PORT:-5050}"
APP_DIR="$CACHE_DIR/apps/$LEDGER_AVALANCHE_VERSION"
APP_ELF="$APP_DIR/app.elf"
COMPOSE_FILE="$E2E_DIR/scripts/speculos/docker-compose.yml"

require_docker() {
  if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
    echo "Docker is not available. Install and start Docker Desktop (or the Docker daemon), then retry." >&2
    exit 1
  fi
}

compose() {
  SPECULOS_APP_DIR="$APP_DIR" SPECULOS_PORT="$SPECULOS_PORT" \
    docker compose -f "$COMPOSE_FILE" "$@"
}
