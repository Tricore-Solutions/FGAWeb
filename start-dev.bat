@echo off
REM FGAWeb Development Stack Startup Script for Windows
REM This script starts both the backend and frontend servers

echo.
echo ========================================
echo   FGAWeb Development Stack
echo ========================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Check if node_modules exist, if not install dependencies
if not exist "%SCRIPT_DIR%backend\node_modules" (
    echo [INFO] Installing backend dependencies...
    cd /d "%SCRIPT_DIR%backend"
    call npm install
)

if not exist "%SCRIPT_DIR%frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd /d "%SCRIPT_DIR%frontend"
    call npm install
)

echo.
echo [BACKEND] Starting Backend Server (Node.js/Express)...
cd /d "%SCRIPT_DIR%backend"
start "FGAWeb Backend" cmd /k "npm run dev"

REM Wait a moment for backend to initialize
timeout /t 2 /nobreak >nul

echo.
echo [FRONTEND] Starting Frontend Server (Vite/React)...
cd /d "%SCRIPT_DIR%frontend"
start "FGAWeb Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo.
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:5173
echo.
echo   Each server runs in its own window.
echo   Close the windows to stop the servers.
echo ========================================
echo.

pause

