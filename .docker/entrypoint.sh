#!/bin/bash

wait_for_postgres() {
  until pg_isready -h base_db_postgres -p 5432 -q -U postgres; do
    echo "Waiting for PostgreSQL..."
    sleep 2
  done
  echo "PostgreSQL is ready."
}

wait_for_postgres

docker build -t api-tech-interview-loadbalancer:v1.0 .