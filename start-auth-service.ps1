# Start Auth Service
Write-Host "Starting Auth Service..." -ForegroundColor Green
Set-Location services/auth-service
npm install
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# Wait a moment for the service to start
Start-Sleep -Seconds 3

Write-Host "Auth Service started on port 3001" -ForegroundColor Green
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor Yellow
Write-Host "Admin: admin@lms.com / password" -ForegroundColor Cyan
Write-Host "Instructor: instructor@lms.com / password" -ForegroundColor Cyan
Write-Host "Student: student@lms.com / password" -ForegroundColor Cyan
Write-Host "Deepanshu: deepanshu@gmail.com / password" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now test the login functionality!" -ForegroundColor Green
