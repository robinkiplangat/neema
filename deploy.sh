#!/bin/bash
set -e # Exit on error

# Step 1: Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Step 2: Build the frontend
echo "Building frontend..."
npm run build

# Step 3: Install backend dependencies
cd backend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20.17.0

echo "Installing backend dependencies..."
npm install

# Step 4: (Optional) Copy frontend build to backend/public if serving statically
# cp -r ../dist/* public/

# Step 5: (Optional) Start backend server
echo "Starting backend server..."
npm start

echo -e "\n---\nDeploy script completed successfully."
echo -e "\nTo start the backend server:"
echo "cd backend && npm start"