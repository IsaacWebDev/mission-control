#!/bin/bash

# Mission Control Startup Script

echo "🎮 Starting Mission Control..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the dev server
echo "🚀 Starting development server on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
