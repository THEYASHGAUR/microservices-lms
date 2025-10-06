@echo off
REM Microservices LMS Startup Script for Windows Batch
REM This script starts all services in the correct order following microservices architecture

echo 🚀 Starting LMS Microservices...

REM Function to check if a port is in use (simplified for batch)
:check_port
set port=%1
netstat -an | findstr ":%port% " >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port %port% is already in use. Attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%port% "') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)
goto :eof

REM Check and free up ports
echo 🔍 Checking ports...
call :check_port 3000
call :check_port 3001
call :check_port 4000

REM Start Auth Service first (dependency for API Gateway)
echo 🔐 Starting Auth Service...
cd services\auth-service
start "Auth Service" cmd /c "npm run dev"
cd ..\..

REM Wait a bit for Auth Service to start
echo ⏳ Waiting for Auth Service to start...
timeout /t 10 /nobreak >nul

REM Start API Gateway
echo 🌐 Starting API Gateway...
cd services\api-gateway
start "API Gateway" cmd /c "npm run dev"
cd ..\..

REM Wait a bit for API Gateway to start
echo ⏳ Waiting for API Gateway to start...
timeout /t 10 /nobreak >nul

REM Start Web Frontend
echo 💻 Starting Web Frontend...
cd web-frontend
if not defined NEXT_PUBLIC_API_BASE_URL set NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
start "Web Frontend" cmd /c "npm run dev"
cd ..

echo.
echo 🎉 All services started successfully!
echo.
echo 📱 Access Points:
echo    Frontend:     http://localhost:4000
echo    API Gateway:  http://localhost:3000/api
echo    Auth Service: http://localhost:3001/auth
echo.
echo 🛑 To stop all services, close this window or press Ctrl+C
echo.

REM Keep the script running
pause
