Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BrotoDesk Development Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "1. Checking Docker..." -ForegroundColor Yellow
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerInstalled) {
    $dockerVersion = docker --version
    Write-Host "   ✓ Docker found: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "   ✗ Docker is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Check if Docker is running
Write-Host "2. Checking if Docker is running..." -ForegroundColor Yellow
docker ps | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Docker is running" -ForegroundColor Green
} else {
    Write-Host "   ✗ Docker is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Start PostgreSQL container
Write-Host "3. Starting PostgreSQL database..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Database container started" -ForegroundColor Green
} else {
    Write-Host "   ✗ Failed to start database" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Wait for database to be ready
Write-Host "4. Waiting for database to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

for ($i = 0; $i -lt $maxAttempts; $i++) {
    $attempt = $i + 1
    docker exec broto-desk-db pg_isready -U postgres 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Database is ready!" -ForegroundColor Green
        break
    }
    Write-Host "   Waiting... ($attempt/$maxAttempts)" -ForegroundColor Gray
    Start-Sleep -Seconds 1
}

if ($attempt -ge $maxAttempts) {
    Write-Host "   ✗ Database failed to start" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Push database schema
Write-Host "5. Setting up database schema..." -ForegroundColor Yellow
Push-Location backend
npm run db:push 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Database schema created" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Running db:push with output..." -ForegroundColor Yellow
    npm run db:push
}
Pop-Location

Write-Host ""

# Generate Prisma Client
Write-Host "6. Generating Prisma Client..." -ForegroundColor Yellow
Push-Location backend
npm run db:generate 2>&1 | Out-Null
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
Write-Host "Now run the following commands in separate terminals:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or run: .\start-all.ps1 (opens both automatically)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then visit: http://localhost:5173" -ForegroundColor Green
Write-Host ""
