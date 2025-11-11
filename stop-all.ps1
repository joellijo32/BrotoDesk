# ============================================
# Stop ALL services
# ============================================

Write-Host "Stopping all services..." -ForegroundColor Yellow
Write-Host ""

# Stop database
Write-Host "Stopping database container..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database stopped" -ForegroundColor Green
} else {
    Write-Host "⚠ No database container running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Note: If backend/frontend are still running," -ForegroundColor Yellow
Write-Host "close their terminal windows or press Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "Done! ✓" -ForegroundColor Green
