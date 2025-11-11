Write-Host "Restarting servers..." -ForegroundColor Cyan
Write-Host ""

# Kill any existing Node processes
Write-Host "Stopping existing servers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "  ✓ Stopped" -ForegroundColor Green

Write-Host ""
Write-Host "Starting fresh servers..." -ForegroundColor Yellow
Write-Host ""

# Start backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend Server - Check for errors below' -ForegroundColor Green; Write-Host ''; npm run dev"

Start-Sleep -Seconds 3

# Start frontend  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend Server' -ForegroundColor Blue; Write-Host ''; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servers Restarted! " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Check the backend terminal for any errors!" -ForegroundColor Yellow
Write-Host ""
