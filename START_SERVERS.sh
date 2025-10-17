#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║   🚀 Hybrid ORM Blog API - TypeORM + Drizzle             ║${NC}"
echo -e "${BLUE}║      Starting Backend & Frontend Servers                  ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Kill existing processes
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
sleep 2

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

# Start backend
echo -e "${GREEN}🔧 Starting Backend API (port 3001)...${NC}"
npm run start:dev > /tmp/blog-backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
echo -e "${BLUE}⏳ Waiting for backend to initialize...${NC}"
sleep 10

# Check if backend started successfully
if lsof -ti:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Backend started successfully${NC}"
else
    echo -e "${RED}   ❌ Backend failed to start${NC}"
    echo -e "${RED}   Check logs: tail -f /tmp/blog-backend.log${NC}"
    exit 1
fi

# Start frontend
echo -e "${GREEN}🎨 Starting Frontend UI (port 3002)...${NC}"
cd frontend
npx http-server . -p 3002 -c-1 --cors > /tmp/blog-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
cd ..

sleep 3

# Check if frontend started successfully  
if lsof -ti:3002 > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Frontend started successfully${NC}"
else
    echo -e "${RED}   ❌ Frontend failed to start${NC}"
    echo -e "${RED}   Check logs: tail -f /tmp/blog-frontend.log${NC}"
    exit 1
fi

# Test endpoints
echo ""
echo -e "${BLUE}🧪 Testing API endpoints...${NC}"

# Test health
HEALTH=$(curl -s http://localhost:3001/health | grep -o '"status":"ok"' || echo "")
if [ ! -z "$HEALTH" ]; then
    echo -e "${GREEN}   ✅ Health check: OK${NC}"
else
    echo -e "${RED}   ❌ Health check: Failed${NC}"
fi

# Test users endpoint
USERS=$(curl -s http://localhost:3001/users | grep -o '\[' || echo "")
if [ ! -z "$USERS" ]; then
    echo -e "${GREEN}   ✅ Users endpoint: OK${NC}"
else
    echo -e "${RED}   ❌ Users endpoint: Failed${NC}"
fi

# Test frontend
FRONTEND=$(curl -s http://localhost:3002 | grep -o 'DOCTYPE html' || echo "")
if [ ! -z "$FRONTEND" ]; then
    echo -e "${GREEN}   ✅ Frontend UI: OK${NC}"
else
    echo -e "${RED}   ❌ Frontend UI: Failed${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║   ✅ BOTH SERVERS RUNNING SUCCESSFULLY                    ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║   🔗 Backend API:  http://localhost:3001                  ║${NC}"
echo -e "${GREEN}║   🎨 Frontend UI:  http://localhost:3002                  ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║   👉 Open http://localhost:3002 in your browser!          ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 API Endpoints:${NC}"
echo -e "   Health:   ${YELLOW}http://localhost:3001/health${NC}"
echo -e "   Users:    ${YELLOW}http://localhost:3001/users${NC}"
echo -e "   Posts:    ${YELLOW}http://localhost:3001/posts${NC}"
echo -e "   Tags:     ${YELLOW}http://localhost:3001/tags${NC}"
echo -e "   Comments: ${YELLOW}http://localhost:3001/comments${NC}"
echo ""
echo -e "${BLUE}📝 View Logs:${NC}"
echo -e "   Backend:  ${YELLOW}tail -f /tmp/blog-backend.log${NC}"
echo -e "   Frontend: ${YELLOW}tail -f /tmp/blog-frontend.log${NC}"
echo ""
echo -e "${RED}🛑 To stop both servers:${NC}"
echo -e "   ${YELLOW}lsof -ti:3001,3002 | xargs kill -9${NC}"
echo ""
echo -e "${GREEN}✨ Servers are running in the background. Press any key to exit this script.${NC}"
echo -e "${YELLOW}   (The servers will continue running)${NC}"
read -n 1 -s
