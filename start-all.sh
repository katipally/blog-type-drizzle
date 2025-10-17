#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║   🚀 Starting Hybrid ORM Blog Application                 ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Kill existing processes
echo -e "${BLUE}🧹 Cleaning up existing processes...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend API
echo -e "${GREEN}🔧 Starting Backend API (port 3001)...${NC}"
npm run start:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo -e "${BLUE}⏳ Waiting for backend to start...${NC}"
sleep 8

# Install http-server if not exists
if ! command -v http-server &> /dev/null; then
    echo -e "${BLUE}📦 Installing http-server globally...${NC}"
    npm install -g http-server
fi

# Start frontend UI
echo -e "${GREEN}🎨 Starting Frontend UI (port 3002)...${NC}"
cd frontend
npx http-server . -p 3002 -c-1 --cors > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

sleep 2

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║   ✅ BOTH SERVERS RUNNING                                 ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║   Backend API: http://localhost:3001                       ║${NC}"
echo -e "${GREEN}║   Frontend UI: http://localhost:3002                       ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║   👉 Open http://localhost:3002 in your browser           ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo -e "   Backend: tail -f /tmp/backend.log"
echo -e "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo -e "${RED}To stop servers: lsof -ti:3001,3002 | xargs kill -9${NC}"
echo ""

# Keep script running
wait
