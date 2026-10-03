# Production Operations

## Required Configuration

Set these values in the hosting provider's secret/configuration store. Do not commit them:

- `JWT_SECRET`: at least 32 random characters. Rotating it invalidates all active access tokens.
- `ALLOWED_ORIGINS`: comma-separated exact frontend origins, including approved preview origins only.
- `SQLITE_DB_PATH`: persistent-volume path. The Render blueprint uses `/var/data/sakhisilai.db`.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`: test keys in staging and live keys in production.
- `DB_BACKUP_DIR`: backup destination on a separately managed volume or mounted object-storage sync path.
- `DB_BACKUP_RETENTION_DAYS`: local retention count by age; defaults to 30 days.

Configure the Razorpay webhook URL as `/api/payments/razorpay/webhook` and subscribe to `payment.captured`. Copy the webhook signing secret into `RAZORPAY_WEBHOOK_SECRET`. Verify the account's capture and settlement configuration before enabling live keys.

## Authentication

Run the service once to initialize the database, then provision the first administrator from the backend directory with `ADMIN_EMAIL`, `ADMIN_PHONE`, and a unique `ADMIN_PASSWORD` of at least 12 characters in the environment, followed by `npm run create-admin`. Never place the password in shell history or source control. New customer registration is enabled; password recovery intentionally remains unavailable until a verified email/SMS delivery provider is configured.

## Load Testing

Run `k6 run backend/loadtest/orders.js` only against an isolated staging deployment with a dedicated customer access token and a staging tailor ID. Supply `BASE_URL`, `AUTH_TOKEN`, and `TAILOR_ID` as environment variables. The scenario writes real staging orders; clean that dataset after the run. The thresholds are initial targets, not a service-level guarantee. Record peak request rate, p95/p99 latency, error rate, CPU, memory, database latency, and disk queue/write latency. Do not point the script at production.

## Backup and Recovery

Run `npm run backup` from the backend directory, with `SQLITE_DB_PATH` set to the active database and `DB_BACKUP_DIR` set to a destination outside the database volume. Schedule it at least daily using the hosting provider's scheduler or an external job runner, then copy completed backups to separate object storage with encryption and access controls. Alert on nonzero exit status and verify backups with `npm run restore -- --check` before relying on them.

For recovery, stop the backend to prevent writes, set `BACKUP_FILE` and `SQLITE_DB_PATH`, then run `npm run restore`. The script verifies the backup, preserves the current database as a pre-restore copy, and replaces the database file. Start the backend and verify `/health`, user login, order listing, and a test order before routing customer traffic back.

## Scaling and Deployment Gate

The current SQLite deployment is single-instance and single-writer. The persistent Render disk protects against service restarts but prevents horizontal replicas and is not an offsite backup. Do not scale this blueprint horizontally. Before claiming 1,000+ orders/day, migrate application data and idempotency/payment-intent records to managed PostgreSQL, configure automated point-in-time recovery, run the k6 scenario at the expected peak plus headroom, and review payment-provider and database alerts. Configure deployment secrets, webhook delivery, domain/TLS, rollback, and restore drills before switching Razorpay to live mode.