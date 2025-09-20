#!/usr/bin/env pwsh

# Apply database migration to Supabase
Write-Host "Applying database migration..." -ForegroundColor Green

# Read the migration file
$migrationContent = Get-Content "services/auth-service/migrations/004_fix_auth_setup.sql" -Raw

# Apply via Supabase API (requires service role key)
$supabaseUrl = "https://yzljqpxqnnzmntfsktjo.supabase.co"
$serviceKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $serviceKey) {
    Write-Host "❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set!" -ForegroundColor Red
    Write-Host "Please set it with: `$env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-key'" -ForegroundColor Yellow
    Write-Host "" 
    Write-Host "📋 Manual Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://supabase.com/dashboard/project/yzljqpxqnnzmntfsktjo/sql" -ForegroundColor White
    Write-Host "2. Copy and paste the SQL from: services/auth-service/migrations/004_fix_auth_setup.sql" -ForegroundColor White
    Write-Host "3. Click 'Run' to apply the migration" -ForegroundColor White
    exit 1
}

try {
    $headers = @{
        "apikey" = $serviceKey
        "Authorization" = "Bearer $serviceKey"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        query = $migrationContent
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/rpc/exec_sql" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to apply migration automatically: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "" 
    Write-Host "📋 Manual Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://supabase.com/dashboard/project/yzljqpxqnnzmntfsktjo/sql" -ForegroundColor White
    Write-Host "2. Copy and paste the SQL from: services/auth-service/migrations/004_fix_auth_setup.sql" -ForegroundColor White
    Write-Host "3. Click 'Run' to apply the migration" -ForegroundColor White
}
