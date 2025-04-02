#!/bin/bash
set -e

# Start ScyllaDB in the background
/docker-entrypoint.py --developer-mode 1 --seeds scylla-db &

# Wait for ScyllaDB to be ready
until cqlsh -e 'DESCRIBE KEYSPACES'; do
    echo "Waiting for ScyllaDB to start..."
    sleep 2
done

# Execute schema file if it exists
if [ -f "/docker-entrypoint-initdb.d/schema.cql" ]; then
    echo "Initializing database schema..."
    cqlsh -f /docker-entrypoint-initdb.d/schema.cql
    echo "Schema initialized successfully."
else
    echo "No schema file found. Skipping initialization."
fi

# Bring ScyllaDB to the foreground to keep container running
wait
