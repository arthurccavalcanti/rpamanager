#!/bin/bash

# --- Directory Variables ---
BACKEND_DIR="rpa_manager"
WORKER_DIR="python_workers"
FRONTEND_DIR="rpa_spa"

echo "=== Starting Development Environment ==="

# 1. Start Infrastructure (Docker)
echo "Starting Docker Containers..."
docker-compose up -d
echo "Waiting 5 seconds for Database..."
sleep 5

# Helper function to open a new Terminal Window
# (Tabs are flaky in scripts; Windows are 100% reliable)
open_terminal() {
    local dir="$1"
    local cmd="$2"
    
    osascript \
        -e "tell application \"Terminal\"" \
        -e "do script \"cd $PWD/$dir; $cmd\"" \
        -e "activate" \
        -e "end tell" > /dev/null
}

# 2. Start Apps in new Windows
echo "Launching Spring Boot API..."
open_terminal "$BACKEND_DIR" "set -a; source ../.env; set +a; mvn spring-boot:run"

echo "Launching Python Worker..."
open_terminal "$WORKER_DIR" "source venv/bin/activate && celery -A src.python_workers.worker_app worker --pool=solo -l info"

echo "Launching React SPA..."
open_terminal "$FRONTEND_DIR" "npm run dev"

echo "=== All services launched! Check the new Terminal windows. ==="