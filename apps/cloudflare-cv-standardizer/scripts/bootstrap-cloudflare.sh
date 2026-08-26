#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRANGLER="WRANGLER_LOG_PATH=/tmp/wrangler-logs npx wrangler"

cd "$ROOT_DIR"

echo "Checking Cloudflare authentication..."
eval "$WRANGLER whoami"

echo "Ensuring D1 database exists..."
if ! eval "$WRANGLER d1 list" | grep -q "cv-standardizer"; then
  eval "$WRANGLER d1 create cv-standardizer"
else
  echo "D1 database cv-standardizer already exists."
fi

echo "Ensuring Queue exists..."
if ! eval "$WRANGLER queues list" | grep -q "cv-standardizer-jobs"; then
  eval "$WRANGLER queues create cv-standardizer-jobs --message-retention-period-secs 60 --delivery-delay-secs 0"
else
  echo "Queue cv-standardizer-jobs already exists."
fi

echo "Ensuring R2 bucket exists..."
if ! eval "$WRANGLER r2 bucket list" | grep -q "cv-standardizer-files"; then
  echo "Creating R2 bucket cv-standardizer-files..."
  if ! eval "$WRANGLER r2 bucket create cv-standardizer-files"; then
    echo "R2 bucket creation failed. Enable R2 in the Cloudflare Dashboard, then rerun this script."
    exit 2
  fi
else
  echo "R2 bucket cv-standardizer-files already exists."
fi

echo "Applying D1 migrations remotely..."
eval "$WRANGLER d1 migrations apply cv-standardizer --config worker/wrangler.toml --remote"

echo "Cloudflare bootstrap complete."
