Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing All Issues" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Creating admin and student users..." -ForegroundColor Yellow
Push-Location backend
npm run db:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Users created successfully" -ForegroundColor Green
} else {
    Write-Host "   ✗ Failed to create users" -ForegroundColor Red
}
Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All Fixes Applied!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Login:" -ForegroundColor Yellow
Write-Host "  Email: admin@brototype.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Student Login:" -ForegroundColor Yellow
Write-Host "  Email: student@brototype.com" -ForegroundColor White
Write-Host "  Password: student123" -ForegroundColor White
Write-Host ""
Write-Host "Now restart the servers and test!" -ForegroundColor Green
Write-Host ""
