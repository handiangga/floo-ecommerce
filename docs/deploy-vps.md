# Deploy Floo Fashion to a VPS

This guide assumes Ubuntu 24.04, Docker Engine, Docker Compose Plugin, and a domain with DNS records already pointing to the VPS.

## DNS records

Create these A records before requesting HTTPS certificates:

| Host | Value |
| --- | --- |
| `@` | VPS public IP |
| `www` | VPS public IP |
| `api` | VPS public IP |

## Server prerequisites

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
# Install Docker Engine and Docker Compose Plugin from Docker's official repository.
```

Clone the repository to `/opt/floo-ecommerce`, then create environment files:

```bash
cd /opt/floo-ecommerce
cp deploy/.env.example deploy/.env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
chmod 600 deploy/.env backend/.env frontend/.env.local
chmod 700 deploy/scripts/*.sh backend/scripts/*.sh
```

Fill all placeholders. Generate server-only secrets without printing them into source files:

```bash
cd backend
npm run generate:secrets
```

Copy each generated value into `backend/.env`.

## First deployment

```bash
cd /opt/floo-ecommerce
docker compose --env-file deploy/.env build
docker compose --env-file deploy/.env up -d db backend frontend nginx
docker compose --env-file deploy/.env --profile tools run --rm migrate
docker compose --env-file deploy/.env exec backend npm run db:seed:roles
docker compose --env-file deploy/.env exec backend npm run db:seed:owner
```

Check status:

```bash
docker compose --env-file deploy/.env ps
docker compose --env-file deploy/.env logs --tail=100 backend
curl http://localhost:5000/api/v1/health
```

## Enable HTTPS

After DNS resolves to the VPS:

```bash
cd /opt/floo-ecommerce
./deploy/scripts/enable-https.sh
```

Set up renewal cron:

```cron
15 3 * * * cd /opt/floo-ecommerce && /usr/bin/env bash deploy/scripts/renew-certificates.sh >> /var/log/floo-certbot.log 2>&1
```

## Updates

```bash
cd /opt/floo-ecommerce
git pull
docker compose --env-file deploy/.env build
docker compose --env-file deploy/.env up -d
docker compose --env-file deploy/.env --profile tools run --rm migrate
```

Never use `docker compose down -v` in production: it deletes the PostgreSQL volume.

## Monitoring and routine checks

The API exposes two read-only monitoring endpoints:

| Endpoint | Purpose |
| --- | --- |
| https://api.floofashionn.com/api/v1/health | Confirms that the API process is running. |
| https://api.floofashionn.com/api/v1/health/ready | Confirms that the API process and database connection are healthy. |

Create external uptime checks for both the storefront and API readiness URL. A five-minute interval is enough for an early-stage store; set the alert destination to the store owner email or WhatsApp.

Useful VPS commands:

    cd /opt/floo-ecommerce
    docker compose --env-file deploy/.env ps
    docker compose --env-file deploy/.env logs --tail=150 backend
    docker compose --env-file deploy/.env logs --tail=150 nginx
    ./deploy/scripts/check-health.sh

Add a local check every 10 minutes and a daily database backup:

    */10 * * * * cd /opt/floo-ecommerce && /usr/bin/env bash deploy/scripts/check-health.sh >> /var/log/floo-health.log 2>&1
    30 2 * * * cd /opt/floo-ecommerce && docker compose --env-file deploy/.env --profile tools run --rm backup >> /var/log/floo-backup.log 2>&1

The backup files are stored in the project backups folder and are excluded from Git. After the first deployment, test the restore process once on a separate database, never on the live production database.
