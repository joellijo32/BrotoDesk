Write-Host "Checking TypeScript compilation..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Backend:" -ForegroundColor Yellow
Set-Location backend
npx tsc --noEmit
$backendCode = $LASTEXITCODE
Set-Location ..

Write-Host ""
Write-Host "Frontend:" -ForegroundColor Yellow
Set-Location frontend
npx tsc --noEmit
$frontendCode = $LASTEXITCODE
Set-Location ..

Write-Host ""
if ($backendCode -eq 0 -and $frontendCode -eq 0) {
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host "NO TYPESCRIPT ERRORS!" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "The errors in VS Code are just cache issues." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix:" -ForegroundColor Cyan
    Write-Host "1. Press Ctrl+Shift+P" -ForegroundColor White
    Write-Host "2. Type: TypeScript: Restart TS Server" -ForegroundColor White
    Write-Host "3. Press Enter" -ForegroundColor White
    Write-Host ""
    Write-Host "Your code is fine!" -ForegroundColor Green
} else {
    Write-Host "Found TypeScript errors above." -ForegroundColor Red
}
