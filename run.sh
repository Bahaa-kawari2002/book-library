#!/bin/bash

# Book Library - Run Script
# This script helps you run the project locally or with Docker

echo "📚 Book Library - Setup and Run"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo "⚠️  Please edit .env and add your MongoDB URI before continuing"
    echo ""
    exit 1
fi

echo "Choose how to run the application:"
echo "1) Docker (Recommended)"
echo "2) Local Development"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🐳 Running with Docker..."
        echo "========================="
        echo ""
        
        # Check if Docker is running
        if ! docker info > /dev/null 2>&1; then
            echo "❌ Docker is not running!"
            echo "Please start Docker Desktop and try again."
            exit 1
        fi
        
        echo "Building and starting containers..."
        docker-compose up --build
        ;;
        
    2)
        echo ""
        echo "💻 Running Local Development..."
        echo "==============================="
        echo ""
        
        # Check if Node.js is installed
        if ! command -v node &> /dev/null; then
            echo "❌ Node.js is not installed!"
            echo "Please install Node.js 18+ and try again."
            exit 1
        fi
        
        # Check if backend dependencies are installed
        if [ ! -d "backend/node_modules" ]; then
            echo "📦 Installing backend dependencies..."
            cd backend && npm install && cd ..
        fi
        
        # Check if frontend dependencies are installed
        if [ ! -d "frontend/node_modules" ]; then
            echo "📦 Installing frontend dependencies..."
            cd frontend && npm install && cd ..
        fi
        
        echo ""
        echo "✅ Starting backend on http://localhost:5000"
        echo "✅ Starting frontend on http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop the servers"
        echo ""
        
        # Run both services using npx concurrently
        npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
        ;;
        
    *)
        echo "❌ Invalid choice! Please run again and choose 1 or 2."
        exit 1
        ;;
esac
