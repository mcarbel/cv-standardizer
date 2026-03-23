#!/usr/bin/env zsh

set -euo pipefail

cd "$(dirname "$0")/.."

eval "$(conda shell.zsh hook)"
conda deactivate || true
source ~/.nvm/nvm.sh
nvm use 20

export PORT="${PORT:-8787}"
# zsh often predefines HOST with the machine name; force localhost for reliable local HTTPS binding.
export HOST="localhost"
export STORAGE_ROOT="${STORAGE_ROOT:-$(pwd)/apps/backend-api/storage}"
export DEFAULT_OLLAMA_BASE_URL="${DEFAULT_OLLAMA_BASE_URL:-http://localhost:11434}"
export HTTPS_KEY_FILE="${HTTPS_KEY_FILE:-$HOME/.rushstack/rushstack-serve.key}"
export HTTPS_CERT_FILE="${HTTPS_CERT_FILE:-$HOME/.rushstack/rushstack-serve.pem}"

npm run build -w @cv-standardizer/backend-api
node apps/backend-api/dist/apps/backend-api/src/server.js
