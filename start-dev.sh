#!/bin/bash

# FGAWeb Development Stack Startup Script
# This script starts both the backend and frontend servers

echo "🚀 Starting FGAWeb Development Stack..."
echo "========================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped. Goodbye!${NC}"
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Check if node_modules exist, if not install dependencies
if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd "$SCRIPT_DIR/backend" && npm install
fi

if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd "$SCRIPT_DIR/frontend" && npm install
fi

# Start Backend Server
echo ""
echo -e "${BLUE}🔧 Starting Backend Server (Node.js/Express)...${NC}"
cd "$SCRIPT_DIR/backend"
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}   Backend PID: $BACKEND_PID${NC}"

# Wait a moment for backend to initialize
sleep 2

# Start Frontend Server
echo ""
echo -e "${BLUE}🎨 Starting Frontend Server (Vite/React)...${NC}"
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}   Frontend PID: $FRONTEND_PID${NC}"

echo ""
echo "========================================="
echo -e "${GREEN}✅ Both servers are starting!${NC}"
echo ""
echo -e "   Backend:  ${BLUE}http://localhost:3000${NC}"
echo -e "   Frontend: ${BLUE}http://localhost:5173${NC} (Vite default)"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo "========================================="
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

