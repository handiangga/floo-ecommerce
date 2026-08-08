# Production service configuration

Use these values after the domain and VPS are active. Do not put any secret in Git or in the frontend environment file.

## Public URLs

| Purpose | Value |
| --- | --- |
| Storefront | `https://floofashionn.com` |
| API | `https://api.floofashionn.com` |
| Customer API base URL | `https://api.floofashionn.com/api/v1` |

## Google OAuth

In Google Cloud, add:

- Authorized JavaScript origin: `https://floofashionn.com`
- Authorized redirect URI: `https://api.floofashionn.com/api/v1/customer-auth/google/callback`

Set the same callback URL in `GOOGLE_REDIRECT_URI`. Rotate the existing client secret before production, then put the new one only in `backend/.env`.

## Midtrans

- Set `MIDTRANS_IS_PRODUCTION=true`.
- Add production Server Key and Client Key only in `backend/.env`.
- Configure the payment notification URL as `https://api.floofashionn.com/api/v1/payments/webhook`.

## Supabase Storage

- Create or select an admin-managed bucket named by `SUPABASE_BUCKET` (for example `ecommerce`).
- Put only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and bucket name in `backend/.env`.
- Never expose the service role key in `NEXT_PUBLIC_*` variables.

## Frontend

Create `frontend/.env.local` on the server:

```env
NEXT_PUBLIC_API_URL=https://api.floofashionn.com/api/v1
```

## Backend

Copy `backend/.env.example` to `backend/.env`, replace every placeholder, and set:

```env
NODE_ENV=production
CORS_ORIGINS=https://floofashionn.com,https://www.floofashionn.com
FRONTEND_URL=https://floofashionn.com
GOOGLE_REDIRECT_URI=https://api.floofashionn.com/api/v1/customer-auth/google/callback
MIDTRANS_IS_PRODUCTION=true
```

## Database initialization and backup

After PostgreSQL is ready on the VPS, run once from `backend/`:

```bash
npm run db:migrate
npm run db:seed:roles
npm run db:seed:owner
```

The Owner seed requires `INITIAL_OWNER_*` values from `backend/.env`. It does not create demo accounts in production.

Install the PostgreSQL client on the VPS, then schedule daily backup:

```bash
sudo apt-get install -y postgresql-client
chmod 700 backend/scripts/backup-db.sh backend/scripts/restore-db.sh
crontab -e
```

Cron entry (daily at 02:30 UTC):

```cron
30 2 * * * cd /opt/floo-ecommerce/backend && /usr/bin/env bash scripts/backup-db.sh >> /var/log/floo-backup.log 2>&1
```

Backups are stored in `/var/backups/floo` for 14 days by default. Copy them to separate storage before relying on the server in production.
