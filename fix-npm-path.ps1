# Quick fix script to add Node.js to PATH for current PowerShell session
# Run this at the start of each new terminal session if npm is not recognized
# Usage: .\fix-npm-path.ps1

Write-Host "Adding Node.js to PATH for this session..." -ForegroundColor Yellow

# Add Node.js to PATH
$env:PATH += ";C:\Program Files\nodejs"

# Verify installation
Write-Host "`nVerifying Node.js installation..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if ($nodeVersion) {
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

if ($npmVersion) {
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
    Write-Host "`n✅ npm is now available in this terminal session!" -ForegroundColor Green
    Write-Host "You can now run: npm install" -ForegroundColor Cyan
} else {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}


