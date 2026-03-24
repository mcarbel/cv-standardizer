# Tunnels And Launchd

This document explains how the local backend and Cloudflare tunnels are operated on macOS.

## Services installed with launchd

- `com.braineesys.cv-standardizer.backend`
- `com.braineesys.cloudflared.ollama-service`
- `com.braineesys.cloudflared.cv-standardizer-backend`

These LaunchAgents are installed in:

- `~/Library/LaunchAgents`

## Public endpoints

- Ollama: `https://ollama.braineesys.lu`
- Backend health: `https://cv-standardizer.braineesys.lu/api/health`

## Scripts

- create tunnels from scratch:
  - `scripts/create-cloudflare-tunnels.sh`
- start both tunnels manually:
  - `scripts/start-cloudflare-tunnels.sh`
- start backend manually:
  - `scripts/start-backend-local.sh`
- install or reload LaunchAgents:
  - `scripts/install-cloudflare-launchd.sh`

## Useful launchctl commands

### Check service state

```bash
launchctl print gui/$(id -u)/com.braineesys.cv-standardizer.backend
launchctl print gui/$(id -u)/com.braineesys.cloudflared.ollama-service
launchctl print gui/$(id -u)/com.braineesys.cloudflared.cv-standardizer-backend
```

### Restart one service

```bash
launchctl kickstart -k gui/$(id -u)/com.braineesys.cv-standardizer.backend
launchctl kickstart -k gui/$(id -u)/com.braineesys.cloudflared.ollama-service
launchctl kickstart -k gui/$(id -u)/com.braineesys.cloudflared.cv-standardizer-backend
```

### Stop one service

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.braineesys.cv-standardizer.backend.plist
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.braineesys.cloudflared.ollama-service.plist
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.braineesys.cloudflared.cv-standardizer-backend.plist
```

### Start one service again

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.braineesys.cv-standardizer.backend.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.braineesys.cloudflared.ollama-service.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.braineesys.cloudflared.cv-standardizer-backend.plist
```

## Logs

- backend:
  - `~/Library/Logs/cv-standardizer/backend.out.log`
  - `~/Library/Logs/cv-standardizer/backend.err.log`
- Ollama tunnel:
  - `~/Library/Logs/cv-standardizer/ollama-tunnel.out.log`
  - `~/Library/Logs/cv-standardizer/ollama-tunnel.err.log`
- backend tunnel:
  - `~/Library/Logs/cv-standardizer/cv-standardizer-backend-tunnel.out.log`
  - `~/Library/Logs/cv-standardizer/cv-standardizer-backend-tunnel.err.log`

## Notes

- backend local listens on `https://localhost:8787`
- Ollama local listens on `http://localhost:11434`
- backend tunnel uses `noTLSVerify: true` because the local backend uses a local development certificate
- if you install the backend LaunchAgent, avoid keeping a second manual backend process on port `8787`; the launcher now detects an existing healthy backend and avoids starting a duplicate
