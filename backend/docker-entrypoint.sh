#!/bin/sh
set -eu

uploads_dir="${UPLOADS_DIR:-/app/uploads}"
mkdir -p "$uploads_dir"
chown -R floo:floo "$uploads_dir"

exec runuser -u floo -- "$@"
