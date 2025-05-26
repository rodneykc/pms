@echo off
echo Starting Practice Management System...
echo.
echo 1. Starting Backend Server (Port 3001)...
start "Backend Server" cmd /k "cd s4-api && node server.js"

timeout /t 3 /nobreak >nul

echo 2. Starting Frontend Development Server (Port 3000)...
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:3001
echo.
pause
