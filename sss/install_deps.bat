@echo off
echo Installing required dependencies...

:: Install frontend dependencies
call npm install react-router-dom@6.17.0
call npm install @mui/material @emotion/react @emotion/styled
call npm install @mui/icons-material
call npm install normalize.css

:: Install backend dependencies
cd s4-api
call npm install cors express mysql2 dotenv
cd ..

echo.
echo Installation complete!
echo.
echo To start the application:
echo 1. Start the backend: cd s4-api && node server.js
echo 2. In a new terminal, start the frontend: npm start
echo.
pause
