# Simple Microservices Startup Script for Windows
# Fast approach: Kill processes on ports, start services immediately

Write-Host "Starting LMS Microservices..." -ForegroundColor Green

# Function to kill process on port using netstat and taskkill (fastest approach)
function Kill-ProcessOnPort {
    param([int]$Port)
    
    Write-Host "Checking port $Port..." -ForegroundColor Yellow
    
    # Use netstat to find process using the port
    $netstatOutput = netstat -ano | findstr ":$Port "
    
    if ($netstatOutput) {
        Write-Host "Port $Port is in use. Killing process..." -ForegroundColor Red
        
        # Extract PID from netstat output and kill it
        $pids = $netstatOutput | ForEach-Object {
            $parts = $_ -split '\s+'
            $parts[-1]  # Last part is the PID
        } | Where-Object { $_ -match '^\d+$' } | Sort-Object -Unique
        
        foreach ($pid in $pids) {
            if ($pid) {
                Write-Host "Killing process $pid on port $Port" -ForegroundColor Red
                taskkill /F /PID $pid 2>$null
            }
        }
        
        Start-Sleep -Seconds 1
    } else {
        Write-Host "Port $Port is free" -ForegroundColor Green
    }
}

# Kill processes on required ports
Write-Host "Freeing up ports..." -ForegroundColor Yellow
Kill-ProcessOnPort -Port 3000  # API Gateway
Kill-ProcessOnPort -Port 3001  # Auth Service  
Kill-ProcessOnPort -Port 4000  # Web Frontend

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan

# Start Auth Service
Write-Host "Starting Auth Service on port 3001..." -ForegroundColor Blue
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd services\auth-service && npm run dev" -WindowStyle Hidden

# Start API Gateway  
Write-Host "Starting API Gateway on port 3000..." -ForegroundColor Blue
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd services\api-gateway && npm run dev" -WindowStyle Hidden

# Start Web Frontend
Write-Host "Starting Web Frontend on port 4000..." -ForegroundColor Blue
$env:NEXT_PUBLIC_API_BASE_URL = if ($env:NEXT_PUBLIC_API_BASE_URL) { $env:NEXT_PUBLIC_API_BASE_URL } else { "http://localhost:3000" }
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd web-frontend && set NEXT_PUBLIC_API_BASE_URL=$env:NEXT_PUBLIC_API_BASE_URL && npm run dev" -WindowStyle Hidden

Write-Host ""
Write-Host "SUCCESS: All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  Frontend:     http://localhost:4000" -ForegroundColor White
Write-Host "  API Gateway:  http://localhost:3000/api" -ForegroundColor White  
Write-Host "  Auth Service: http://localhost:3001/auth" -ForegroundColor White
Write-Host ""
Write-Host "Services are running in background. Check Task Manager to stop them." -ForegroundColor Yellow
Write-Host "Press any key to exit..." -ForegroundColor Gray

# Wait for user input
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
