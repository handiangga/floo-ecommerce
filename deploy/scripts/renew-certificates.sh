#!/usr/bin/env bash
set -euo pipefail

docker compose --env-file deploy/.env --profile tools run --rm certbot renew
docker compose --env-file deploy/.env exec nginx nginx -s reload
