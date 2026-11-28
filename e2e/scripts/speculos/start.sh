#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

require_docker

if [ ! -f "$APP_ELF" ]; then
  echo "Avalanche app $LEDGER_AVALANCHE_VERSION not found at $APP_ELF." >&2
  echo "Build it first: yarn speculos:build" >&2
  exit 1
fi

compose up -d --force-recreate

for _ in $(seq 1 30); do
  if curl -sf "http://localhost:$SPECULOS_PORT/events?currentscreenonly=true" >/dev/null; then
    echo "Speculos is running at http://localhost:$SPECULOS_PORT"
    exit 0
  fi
  sleep 1
done

echo "Speculos did not become reachable on port $SPECULOS_PORT. Logs:" >&2
compose logs speculos >&2
exit 1
