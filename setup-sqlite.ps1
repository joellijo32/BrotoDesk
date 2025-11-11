Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BrotoDesk - SQLite Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Setting up database (SQLite - No Docker needed!)..." -ForegroundColor Yellow
Write-Host ""

# Push database schema
Write-Host "1. Creating database schema..." -ForegroundColor Yellow
Push-Location backend
npm run db:push
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Database schema created" -ForegroundColor Green
} else {
    Write-Host "   ✗ Failed to create schema" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host ""

# Generate Prisma Client
Write-Host "2. Generating Prisma Client..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "   ✗ Failed to generate Prisma Client" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Database created at: backend\prisma\dev.db" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now start the servers:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or run: .\start-all.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then visit: http://localhost:5173" -ForegroundColor Green
Write-Host ""
