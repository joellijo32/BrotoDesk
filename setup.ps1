# BrotoDesk Quick Setup Script
# Run this after you've added your DATABASE_URL to backend/.env

Write-Host ""
Write-Host "🚀 BrotoDesk Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ Error: backend\.env file not found!" -ForegroundColor Red
    Write-Host "Please create backend\.env from backend\.env.example first" -ForegroundColor Yellow
    exit 1
}

# Check for DATABASE_URL
$envContent = Get-Content "backend\.env" -Raw
if ($envContent -match 'YOUR_PASSWORD|YOUR_HOST') {
    Write-Host "⚠️  Warning: Please update DATABASE_URL in backend\.env" -ForegroundColor Yellow
    Write-Host "   See START_HERE.md for instructions" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 0
    }
}

Write-Host "📦 Step 1: Installing Backend Dependencies..." -ForegroundColor Green
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Step 2: Installing Frontend Dependencies..." -ForegroundColor Green
Set-Location ..\frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

Write-Host "🗄️  Step 3: Setting up Database..." -ForegroundColor Green
Set-Location ..\backend
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push database schema" -ForegroundColor Red
    Write-Host "   Make sure your DATABASE_URL is correct in backend\.env" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Database schema created" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 Step 4: Generating Prisma Client..." -ForegroundColor Green
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

Write-Host "✅ ✅ ✅  Setup Complete! ✅ ✅ ✅" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 BrotoDesk is ready to run!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "  1. Open Terminal 1:" -ForegroundColor White
Write-Host "     cd backend" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Open Terminal 2:" -ForegroundColor White
Write-Host "     cd frontend" -ForegroundColor Gray
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Then visit: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "See START_HERE.md for detailed instructions!" -ForegroundColor Yellow
Write-Host ""

Set-Location ..
