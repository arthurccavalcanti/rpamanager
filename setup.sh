#!/bin/bash

# --- Directory Variables (Change these if your folders are named differently) ---
BACKEND_DIR="rpa_manager"      # Directory containing pom.xml
WORKER_DIR="python_workers"    # Directory containing pyproject.toml
FRONTEND_DIR="rpa_spa"         # Directory containing package.json

# --- Colors for Output ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Project Setup ===${NC}"

# 1. Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "Homebrew not found. Please install it first: https://brew.sh/"
    exit 1
fi

# 2. JAVA SETUP (Spring Boot)
echo -e "\n${GREEN}--- Setting up Java/Spring Boot environment ---${NC}"
if ! brew list openjdk &> /dev/null; then
    echo "Installing OpenJDK..."
    brew install openjdk
    # Suggest symlink if needed, but usually brew handles env vars
else 
    echo "OpenJDK is already installed."
fi

if ! command -v mvn &> /dev/null; then
    echo "Installing Maven..."
    brew install maven
else
    echo "Maven is already installed."
fi

echo "Installing Backend Dependencies..."
cd "$BACKEND_DIR" || { echo "Directory $BACKEND_DIR not found"; exit 1; }
mvn install -DskipTests # Skip tests to speed up initial build
cd ..

# 3. PYTHON SETUP (Task Queue)
echo -e "\n${GREEN}--- Setting up Python Worker environment ---${NC}"
if ! command -v python3 &> /dev/null; then
    echo "Installing Python..."
    brew install python
fi

cd "$WORKER_DIR" || { echo "Directory $WORKER_DIR not found"; exit 1; }

# Create Venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate and Install
source venv/bin/activate
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -e .
echo "Installing Playwright browsers..."
python -m playwright install
deactivate
cd ..

# 4. NODE SETUP (SPA App)
echo -e "\n${GREEN}--- Setting up React/Node environment ---${NC}"
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    brew install node
fi

cd "$FRONTEND_DIR" || { echo "Directory $FRONTEND_DIR not found"; exit 1; }
echo "Installing Node dependencies..."
npm install
cd ..

# 5. DOCKER CHECK
echo -e "\n${GREEN}--- Checking Infrastructure Tools ---${NC}"
if ! command -v docker &> /dev/null; then
    echo "Warning: Docker is not found. Please install Docker Desktop manually."
else
    echo "Docker is installed."
fi

echo -e "\n${BLUE}=== Setup Complete! You can now run ./start_apps.sh ===${NC}"