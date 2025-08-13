#!/bin/bash
export NODE_ENV=production
export PORT=5000
pkill -f "tsx\|vite" 2>/dev/null || true
sleep 2
echo "Starting production server..."
node dist/index.js
