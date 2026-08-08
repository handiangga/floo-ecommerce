#!/usr/bin/env bash
set -euo pipefail
umask 077

: "${DATABASE_URL:?DATABASE_URL must be set}"

BACKUP_DIR="${BACKUP_DIR:-/var/backups/floo}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_FILE="${BACKUP_DIR}/floo-${TIMESTAMP}.dump"

mkdir -p "${BACKUP_DIR}"
pg_dump "${DATABASE_URL}" --format=custom --no-owner --no-privileges --file="${BACKUP_FILE}"
find "${BACKUP_DIR}" -type f -name 'floo-*.dump' -mtime "+${RETENTION_DAYS}" -delete

echo "Backup created: ${BACKUP_FILE}"
