#!/bin/bash

if [ -n "$POSTGRES_DB_SCHEMA" ]; then
  echo "Creating schema: $POSTGRES_DB_SCHEMA"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE SCHEMA IF NOT EXISTS "$POSTGRES_DB_SCHEMA";
EOSQL
fi
