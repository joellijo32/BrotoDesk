# ============================================
# Fix TypeScript Errors in VS Code
# ============================================

Write-Host "🔧 Fixing TypeScript errors in VS Code..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify files exist
Write-Host "📁 Checking backend files..." -ForegroundColor Yellow
$backendRoutes = @(
    "backend\src\routes\auth.routes.ts",
    "backend\src\routes\complaint.routes.ts",
    "backend\src\routes\notification.routes.ts",
    "backend\src\routes\analytics.routes.ts",
    "backend\src\routes\user.routes.ts"
)

$backendMiddleware = @(
    "backend\src\middleware\auth.middleware.ts",
    "backend\src\middleware\error.middleware.ts"
)

$frontendPages = @(
    "frontend\src\pages\Login.tsx",
    "frontend\src\pages\Register.tsx",
    "frontend\src\pages\StudentDashboard.tsx",
    "frontend\src\pages\AdminDashboard.tsx",
    "frontend\src\pages\ComplaintDetail.tsx"
)

$allFiles = $backendRoutes + $backendMiddleware + $frontendPages
$allExist = $true

foreach ($file in $allFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file MISSING!" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host ""
    Write-Host "❌ Some files are missing! Cannot continue." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All files exist!" -ForegroundColor Green
Write-Host ""

# Step 2: Verify TypeScript compilation
Write-Host "🔍 Checking TypeScript compilation..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Backend:" -ForegroundColor Cyan
Push-Location backend
$backendResult = npx tsc --noEmit 2>&1
$backendExitCode = $LASTEXITCODE
Pop-Location

if ($backendExitCode -eq 0) {
    Write-Host "  ✅ Backend compiles successfully!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend has TypeScript errors:" -ForegroundColor Red
    Write-Host $backendResult -ForegroundColor Red
}

Write-Host ""
Write-Host "Frontend:" -ForegroundColor Cyan
Push-Location frontend
$frontendResult = npx tsc --noEmit 2>&1
$frontendExitCode = $LASTEXITCODE
Pop-Location

if ($frontendExitCode -eq 0) {
    Write-Host "  ✅ Frontend compiles successfully!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend has TypeScript errors:" -ForegroundColor Red
    Write-Host $frontendResult -ForegroundColor Red
}

Write-Host ""

if ($backendExitCode -eq 0 -and $frontendExitCode -eq 0) {
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ NO ACTUAL TYPESCRIPT ERRORS!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "The errors you see in VS Code are just cache issues." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix them:" -ForegroundColor Cyan
    Write-Host "1. Press Ctrl+Shift+P in VS Code" -ForegroundColor White
    Write-Host "2. Type: TypeScript: Restart TS Server" -ForegroundColor White
    Write-Host "3. Press Enter" -ForegroundColor White
    Write-Host ""
    Write-Host "OR just close and reopen VS Code!" -ForegroundColor White
    Write-Host ""
    Write-Host "Your code is actually fine! 🎉" -ForegroundColor Green
} else {
    Write-Host "❌ There are actual TypeScript errors that need fixing." -ForegroundColor Red
}

Write-Host ""
Write-Host "Done! 🚀" -ForegroundColor Cyan
