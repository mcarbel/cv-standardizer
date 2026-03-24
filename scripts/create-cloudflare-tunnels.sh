#!/usr/bin/env zsh

set -euo pipefail

OLLAMA_TUNNEL_NAME="${OLLAMA_TUNNEL_NAME:-ollama-service}"
OLLAMA_HOSTNAME="${OLLAMA_HOSTNAME:-ollama.braineesys.lu}"
OLLAMA_SERVICE_URL="${OLLAMA_SERVICE_URL:-http://localhost:11434}"

BACKEND_TUNNEL_NAME="${BACKEND_TUNNEL_NAME:-cv-standardizer-backend}"
BACKEND_HOSTNAME="${BACKEND_HOSTNAME:-cv-standardizer.braineesys.lu}"
BACKEND_SERVICE_URL="${BACKEND_SERVICE_URL:-https://localhost:8787}"

CLOUDFLARED_DIR="${CLOUDFLARED_DIR:-$HOME/.cloudflared}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cloudflare_login() {
  if [[ ! -f "$CLOUDFLARED_DIR/cert.pem" ]]; then
    echo "No Cloudflare login found in $CLOUDFLARED_DIR/cert.pem" >&2
    echo "Run this first:" >&2
    echo "  cloudflared tunnel login" >&2
    exit 1
  fi
}

extract_tunnel_id() {
  local tunnel_name="$1"
  cloudflared tunnel list | awk -v target="$tunnel_name" '$2 == target { print $1 }'
}

delete_tunnel_if_exists() {
  local tunnel_name="$1"
  local tunnel_id
  tunnel_id="$(extract_tunnel_id "$tunnel_name" || true)"

  if [[ -n "${tunnel_id:-}" ]]; then
    echo "Deleting existing tunnel $tunnel_name ($tunnel_id)"
    cloudflared tunnel delete -f "$tunnel_name"
  fi
}

create_tunnel() {
  local tunnel_name="$1"
  echo "Creating tunnel $tunnel_name"
  cloudflared tunnel create "$tunnel_name" >/tmp/"${tunnel_name}".create.log
  cat /tmp/"${tunnel_name}".create.log
}

write_ollama_config() {
  local tunnel_id="$1"
  cat > "$CLOUDFLARED_DIR/${OLLAMA_TUNNEL_NAME}.yml" <<EOF
tunnel: ${tunnel_id}
credentials-file: ${CLOUDFLARED_DIR}/${tunnel_id}.json

ingress:
  - service: ${OLLAMA_SERVICE_URL}
EOF
}

write_backend_config() {
  local tunnel_id="$1"
  cat > "$CLOUDFLARED_DIR/${BACKEND_TUNNEL_NAME}.yml" <<EOF
tunnel: ${tunnel_id}
credentials-file: ${CLOUDFLARED_DIR}/${tunnel_id}.json

ingress:
  - service: ${BACKEND_SERVICE_URL}
    originRequest:
      noTLSVerify: true
EOF
}

route_dns() {
  local tunnel_id="$1"
  local hostname="$2"
  echo "Routing ${hostname} to tunnel ${tunnel_id}"
  cloudflared tunnel route dns --overwrite-dns "$tunnel_id" "$hostname"
}

print_next_steps() {
  local ollama_id="$1"
  local backend_id="$2"

  cat <<EOF

Done.

Ollama tunnel:
  name: ${OLLAMA_TUNNEL_NAME}
  id:   ${ollama_id}
  url:  https://${OLLAMA_HOSTNAME}
  run:  cloudflared tunnel --config ${CLOUDFLARED_DIR}/${OLLAMA_TUNNEL_NAME}.yml run ${OLLAMA_TUNNEL_NAME}

Backend tunnel:
  name: ${BACKEND_TUNNEL_NAME}
  id:   ${backend_id}
  url:  https://${BACKEND_HOSTNAME}
  run:  cloudflared tunnel --config ${CLOUDFLARED_DIR}/${BACKEND_TUNNEL_NAME}.yml run ${BACKEND_TUNNEL_NAME}

Health check:
  curl https://${BACKEND_HOSTNAME}/api/health

Ollama check:
  curl https://${OLLAMA_HOSTNAME}
EOF
}

main() {
  require_command cloudflared
  require_cloudflare_login
  mkdir -p "$CLOUDFLARED_DIR"

  delete_tunnel_if_exists "$OLLAMA_TUNNEL_NAME"
  delete_tunnel_if_exists "$BACKEND_TUNNEL_NAME"

  create_tunnel "$OLLAMA_TUNNEL_NAME"
  create_tunnel "$BACKEND_TUNNEL_NAME"

  local ollama_id backend_id
  ollama_id="$(extract_tunnel_id "$OLLAMA_TUNNEL_NAME")"
  backend_id="$(extract_tunnel_id "$BACKEND_TUNNEL_NAME")"

  if [[ -z "$ollama_id" || -z "$backend_id" ]]; then
    echo "Failed to retrieve one or both tunnel IDs after creation." >&2
    exit 1
  fi

  write_ollama_config "$ollama_id"
  write_backend_config "$backend_id"

  route_dns "$ollama_id" "$OLLAMA_HOSTNAME"
  route_dns "$backend_id" "$BACKEND_HOSTNAME"

  print_next_steps "$ollama_id" "$backend_id"
}

main "$@"
