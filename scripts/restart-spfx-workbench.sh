#!/usr/bin/env zsh

set -euo pipefail

PORT="${PORT:-4321}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SPFX_DIR="$REPO_ROOT/apps/spfx-webpart"
WORKBENCH_URL="${WORKBENCH_URL:-https://braineesysms365.sharepoint.com/_layouts/15/workbench.aspx?debug=true&noredir=true&debugManifestsFile=https%3A%2F%2Flocalhost%3A4321%2Ftemp%2Fbuild%2Fmanifests.js}"

function stop_listener_on_port() {
  local pid
  pid="$(lsof -tiTCP:${PORT} -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"

  if [[ -z "$pid" ]]; then
    echo "No process is listening on port ${PORT}."
    return 0
  fi

  echo "Port ${PORT} is currently used by PID ${pid}."
  ps -p "$pid" -o pid=,ppid=,command=

  echo "Sending SIGTERM to PID ${pid}..."
  kill -TERM "$pid" 2>/dev/null || true

  for _ in {1..10}; do
    if ! lsof -tiTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
      echo "Port ${PORT} is now free."
      return 0
    fi
    sleep 1
  done

  echo "PID ${pid} did not stop in time. Sending SIGKILL..."
  kill -KILL "$pid" 2>/dev/null || true
  sleep 1

  if lsof -tiTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Failed to free port ${PORT}."
    exit 1
  fi

  echo "Port ${PORT} is now free after SIGKILL."
}

cd "$REPO_ROOT"

if command -v conda >/dev/null 2>&1; then
  eval "$(conda shell.zsh hook)"
  conda deactivate || true
fi

source ~/.nvm/nvm.sh
nvm use 20 >/dev/null

stop_listener_on_port

echo "Starting SPFx workbench server on https://localhost:${PORT} ..."
echo "SharePoint workbench URL:"
echo "$WORKBENCH_URL"

cd "$SPFX_DIR"
exec npx gulp serve-deprecated
