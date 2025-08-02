#!/bin/bash

# Production start script for Render deployment
echo "🚀 Starting production server..."

# Ensure tsx is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found, installing tsx globally..."
    npm install -g tsx
fi

# Check if tsx is available
if ! npx tsx --version &> /dev/null; then
    echo "❌ tsx not available, installing..."
    npm install tsx
fi

# Set production environment
export NODE_ENV=production

# Start the server with tsx
echo "✅ Starting server with tsx..."
exec npx tsx server/index.ts 