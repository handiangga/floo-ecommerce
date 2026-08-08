#!/usr/bin/env bash
set -euo pipefail

STORE_URL="${STORE_URL:-https://floofashionn.com}"
API_URL="${API_URL:-https://api.floofashionn.com/api/v1/health/ready}"

curl --fail --silent --show-error --max-time 10 "${STORE_URL}" > /dev/null
curl --fail --silent --show-error --max-time 10 "${API_URL}" > /dev/null

echo "Floo health check passed at $(date -Is)"
