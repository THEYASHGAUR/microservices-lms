@echo off
echo 🔧 LMS Quick Fix Script
echo =======================
echo.

REM Check if we're in the right directory
if not exist "start-microservices.sh" (
    echo ❌ Error: Please run this script from the project root directory
    echo    Current directory: %CD%
    echo    Expected files: start-microservices.sh, package.json
    pause
    exit /b 1
)

echo ✅ Found project files

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm is installed
npm --version

REM Install dependencies if needed
echo.
echo 📦 Checking dependencies...

if not exist "node_modules" (
    echo Installing root dependencies...
    npm install
)

if not exist "services\auth-service\node_modules" (
    echo Installing auth-service dependencies...
    cd services\auth-service
    npm install
    cd ..\..
)

if not exist "services\api-gateway\node_modules" (
    echo Installing api-gateway dependencies...
    cd services\api-gateway
    npm install
    cd ..\..
)

if not exist "web-frontend\node_modules" (
    echo Installing web-frontend dependencies...
    cd web-frontend
    npm install
    cd ..
)

echo ✅ All dependencies installed

REM Check if ports are available
echo.
echo 🔍 Checking ports...

REM Kill processes on ports if they exist
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":4000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo ✅ Ports are available

REM Start services
echo.
echo 🚀 Starting services...
echo    This will start:
echo    - Auth Service (port 3001)
echo    - API Gateway (port 3000)
echo    - Web Frontend (port 4000)
echo.
echo    Press Ctrl+C to stop all services
echo.

REM Run the start script
call start-microservices.bat
