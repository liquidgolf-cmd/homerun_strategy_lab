#!/bin/bash
set -e

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Building backend..."
cd backend
npm install
npm run build
cd ..

echo "Copying frontend build to backend public directory..."
mkdir -p backend/public
cp -r frontend/dist/* backend/public/

echo "Build complete!"

