#!/usr/bin/env zsh

set -euo pipefail

LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
LOGS_DIR="$HOME/Library/Logs/cv-standardizer"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$LAUNCH_AGENTS_DIR" "$LOGS_DIR"

cp "$SCRIPT_DIR/launchd/com.braineesys.cloudflared.ollama-service.plist" \
  "$LAUNCH_AGENTS_DIR/com.braineesys.cloudflared.ollama-service.plist"

cp "$SCRIPT_DIR/launchd/com.braineesys.cloudflared.cv-standardizer-backend.plist" \
  "$LAUNCH_AGENTS_DIR/com.braineesys.cloudflared.cv-standardizer-backend.plist"

cp "$SCRIPT_DIR/launchd/com.braineesys.cv-standardizer.backend.plist" \
  "$LAUNCH_AGENTS_DIR/com.braineesys.cv-standardizer.backend.plist"

launchctl bootout "gui/$(id -u)" "$LAUNCH_AGENTS_DIR/com.braineesys.cloudflared.ollama-service.plist" 2>/dev/null || true
launchctl bootout "gui/$(id -u)" "$LAUNCH_AGENTS_DIR/com.braineesys.cloudflared.cv-standardizer-backend.plist" 2>/dev/null || true
launchctl bootout "gui/$(id -u)" "$LAUNCH_AGENTS_DIR/com.braineesys.cv-standardizer.backend.plist" 2>/dev/null || true

launchctl bootstrap "gui/$(id -u)" "$LAUNCH_AGENTS_DIR/com.braineesys.cloudflared.ollama-service.plist"
launchctl bootstrap "gui/$(id -u)" "$LAUNCH_AGENTS_DIR/com.braineesys.cloudflared.cv-standardizer-backend.plist"
launchctl bootstrap "gui/$(id -u)" "$LAUNCH_AGENTS_DIR/com.braineesys.cv-standardizer.backend.plist"

launchctl enable "gui/$(id -u)/com.braineesys.cloudflared.ollama-service"
launchctl enable "gui/$(id -u)/com.braineesys.cloudflared.cv-standardizer-backend"
launchctl enable "gui/$(id -u)/com.braineesys.cv-standardizer.backend"

echo "Installed and loaded LaunchAgents:"
echo "  - com.braineesys.cloudflared.ollama-service"
echo "  - com.braineesys.cloudflared.cv-standardizer-backend"
echo "  - com.braineesys.cv-standardizer.backend"
