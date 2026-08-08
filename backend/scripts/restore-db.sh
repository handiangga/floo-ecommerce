#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set}"

BACKUP_FILE="${1:?Usage: ./scripts/restore-db.sh /path/to/floo-backup.dump}"

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "Backup file not found: ${BACKUP_FILE}" >&2
  exit 1
fi

read -r -p "This will replace database data. Type RESTORE to continue: " CONFIRMATION
if [[ "${CONFIRMATION}" != "RESTORE" ]]; then
  echo "Restore cancelled."
  exit 0
fi

pg_restore --dbname="${DATABASE_URL}" --clean --if-exists --no-owner --no-privileges "${BACKUP_FILE}"
echo "Restore completed."
