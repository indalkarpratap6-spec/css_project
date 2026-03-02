#!/bin/bash

# MCQ Exam System - Startup Script

echo "MCQ Exam System - Starting..."
echo ""

# Check if both backend and frontend node_modules exist
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd backend
  npm install
  cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
fi

echo ""
echo "=========================================="
echo "MCQ Exam System is ready!"
echo "=========================================="
echo ""
echo "To start the system:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
