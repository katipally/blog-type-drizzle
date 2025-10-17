#!/bin/bash

PORT=3001
PROJECT_NAME="blog-type-drizzle"

echo "🚀 Starting $PROJECT_NAME..."
echo "📍 Target Port: $PORT"
echo ""

# Function to kill processes on the port
kill_port_process() {
    local port=$1
    echo "🔍 Checking for processes on port $port..."
    
    # Find process using the port
    local pid=$(lsof -ti:$port)
    
    if [ ! -z "$pid" ]; then
        echo "⚠️  Found process $pid using port $port"
        echo "🔪 Killing process..."
        kill -9 $pid 2>/dev/null
        
        # Wait a moment for the port to be released
        sleep 1
        
        # Verify it's killed
        local check_pid=$(lsof -ti:$port)
        if [ -z "$check_pid" ]; then
            echo "✅ Port $port is now free"
        else
            echo "⚠️  Warning: Port might still be in use"
        fi
    else
        echo "✅ Port $port is available"
    fi
    echo ""
}

# Kill any process on the target port
kill_port_process $PORT

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies..."
    npm install
    echo ""
fi

# Start the development server
echo "🎬 Starting NestJS development server..."
echo "🌐 Server will be available at: http://localhost:$PORT"
echo "🎨 Dashboard: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
nest start --watch
