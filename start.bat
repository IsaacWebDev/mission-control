@echo off
REM Mission Control Startup Script for Windows

echo.
echo.
echo 🎮 Starting Mission Control...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Start the dev server
echo 🚀 Starting development server on http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev
pause
