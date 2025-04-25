#!/bin/bash
# Simple Deploy Script for Neema Project
# This script installs dependencies, builds the frontend, and prepares the backend.
# Usage: bash deploy.sh

set -e

# Ensure this script is executable
chmod +x "$0"

# Use Node.js version 20.17.0 (requires nvm to be installed)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20.17.0

# Step 1: Install dependencies for frontend
cd "$(dirname "$0")"
echo "Installing frontend dependencies..."
npm install

# Step 2: Build the frontend
echo "Building frontend..."
npm run build

# Step 3: Install dependencies for backend
cd backend
# Use Node.js version 20.17.0 (requires nvm to be installed)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20.17.0

echo "Installing backend dependencies..."
npm install

# Step 4: (Optional) Copy frontend build to backend/public if serving statically
# Uncomment the next line if you want to serve the frontend from the backend
# cp -r ../dist/* public/

# Step 5: (Optional) Start backend server
echo "Starting backend server..."
npm start

# echo "\n---\nDeploy script completed successfully."
# echo "\nTo start the backend server:"
# echo "cd backend && npm start"
