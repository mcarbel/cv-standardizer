#!/usr/bin/env zsh

set -euo pipefail

cd "$(dirname "$0")/.."

if command -v conda >/dev/null 2>&1; then
  eval "$(conda shell.zsh hook)"
  conda deactivate || true
fi

source ~/.nvm/nvm.sh
nvm use 20

export PORT="${PORT:-8787}"
# zsh often predefines HOST with the machine name; force localhost for reliable local HTTPS binding.
export HOST="localhost"
export STORAGE_ROOT="${STORAGE_ROOT:-$(pwd)/apps/backend-api/storage}"
export DEFAULT_OLLAMA_BASE_URL="${DEFAULT_OLLAMA_BASE_URL:-http://localhost:11434}"
export HTTPS_KEY_FILE="${HTTPS_KEY_FILE:-$HOME/.rushstack/rushstack-serve.key}"
export HTTPS_CERT_FILE="${HTTPS_CERT_FILE:-$HOME/.rushstack/rushstack-serve.pem}"

if curl -sk "https://localhost:${PORT}/api/health" >/dev/null 2>&1; then
  echo "Backend already running on https://localhost:${PORT}; launchd service will not start a duplicate."
  while true; do
    sleep 300
  done
fi

npm run build -w @cv-standardizer/backend-api
node apps/backend-api/dist/apps/backend-api/src/server.js
