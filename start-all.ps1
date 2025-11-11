# ============================================
# Start ALL services (Backend + Frontend)
# SQLite version - No Docker needed!
# ============================================

Write-Host "Starting BrotoDesk..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend and Frontend servers..." -ForegroundColor Yellow
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend Server' -ForegroundColor Green; npm run dev"

# Wait a bit
Start-Sleep -Seconds 2

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Server' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All services started! 🚀" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Two new windows opened:" -ForegroundColor Cyan
Write-Host "  1. Backend (http://localhost:5000)" -ForegroundColor White
Write-Host "  2. Frontend (http://localhost:5173)" -ForegroundColor White
Write-Host ""
Write-Host "Visit: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "To stop: Close the two terminal windows" -ForegroundColor Yellow
Write-Host ""
