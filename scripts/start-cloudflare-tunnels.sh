#!/usr/bin/env zsh

set -euo pipefail

CLOUDFLARED_BIN="${CLOUDFLARED_BIN:-/opt/homebrew/bin/cloudflared}"
CLOUDFLARED_DIR="${CLOUDFLARED_DIR:-$HOME/.cloudflared}"

OLLAMA_TUNNEL_NAME="${OLLAMA_TUNNEL_NAME:-ollama-service}"
OLLAMA_CONFIG_FILE="${OLLAMA_CONFIG_FILE:-$CLOUDFLARED_DIR/${OLLAMA_TUNNEL_NAME}.yml}"

BACKEND_TUNNEL_NAME="${BACKEND_TUNNEL_NAME:-cv-standardizer-backend}"
BACKEND_CONFIG_FILE="${BACKEND_CONFIG_FILE:-$CLOUDFLARED_DIR/${BACKEND_TUNNEL_NAME}.yml}"

require_file() {
  if [[ ! -f "$1" ]]; then
    echo "Missing required file: $1" >&2
    exit 1
  fi
}

require_file "$CLOUDFLARED_BIN"
require_file "$OLLAMA_CONFIG_FILE"
require_file "$BACKEND_CONFIG_FILE"

echo "Starting Cloudflare tunnels..."
echo "  Ollama  : $OLLAMA_TUNNEL_NAME"
echo "  Backend : $BACKEND_TUNNEL_NAME"

"$CLOUDFLARED_BIN" tunnel --config "$OLLAMA_CONFIG_FILE" run "$OLLAMA_TUNNEL_NAME" &
OLLAMA_PID=$!

"$CLOUDFLARED_BIN" tunnel --config "$BACKEND_CONFIG_FILE" run "$BACKEND_TUNNEL_NAME" &
BACKEND_PID=$!

cleanup() {
  kill "$OLLAMA_PID" "$BACKEND_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

wait "$OLLAMA_PID" "$BACKEND_PID"
