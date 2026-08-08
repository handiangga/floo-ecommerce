#!/usr/bin/env bash
set -euo pipefail

set -a
. ./deploy/.env
set +a

EMAIL="${LETSENCRYPT_EMAIL:?LETSENCRYPT_EMAIL must be set in deploy/.env}"

docker compose --env-file deploy/.env --profile tools run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  --email "${EMAIL}" \
  --agree-tos --no-eff-email \
  -d floofashionn.com -d www.floofashionn.com -d api.floofashionn.com

cp deploy/nginx/https.conf deploy/nginx/current.conf
docker compose --env-file deploy/.env exec nginx nginx -s reload
