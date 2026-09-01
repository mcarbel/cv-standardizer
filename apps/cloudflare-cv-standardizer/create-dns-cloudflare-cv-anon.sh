#!/usr/bin/env bash
set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN with DNS Edit permission for braineesys.lu}"

curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/80487acab4dda8af6341caaed23a8153/dns_records" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"type":"CNAME","name":"cv-anon","content":"cv-standardizer.pages.dev","ttl":1,"proxied":true}'
