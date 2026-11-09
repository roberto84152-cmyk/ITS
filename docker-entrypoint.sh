#!/bin/sh
set -e

echo "Applying database migrations..."
attempt=1
until npx prisma migrate deploy; do
  if [ "$attempt" -ge 10 ]; then
    echo "Migrations failed after $attempt attempts" >&2
    exit 1
  fi
  echo "Database is not ready, retrying ($attempt/10)..."
  attempt=$((attempt + 1))
  sleep 2
done

echo "Seeding database..."
node dist/database/seed.js

echo "Starting application..."
exec node dist/main.js
