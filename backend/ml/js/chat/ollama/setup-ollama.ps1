# Ollama Quick Setup Script for Windows
# Run this in PowerShell after installing Ollama

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ScanMed - Ollama Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
Write-Host "1. Checking if Ollama is installed..." -ForegroundColor Yellow
try {
    $version = ollama --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Ollama is installed: $version" -ForegroundColor Green
    } else {
        throw "Ollama not found"
    }
} catch {
    Write-Host "   ❌ Ollama is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Ollama:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://ollama.ai/download" -ForegroundColor White
    Write-Host "  2. Download Windows installer" -ForegroundColor White
    Write-Host "  3. Run installer" -ForegroundColor White
    Write-Host "  4. Restart PowerShell" -ForegroundColor White
    Write-Host "  5. Run this script again" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "2. Downloading Llama models..." -ForegroundColor Yellow
Write-Host "   This may take 10-15 minutes (downloading ~12GB)" -ForegroundColor Gray

# Download Llama 3.2 for chat
Write-Host ""
Write-Host "   Downloading llama3.2 (4GB)..." -ForegroundColor Cyan
ollama pull llama3.2
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ llama3.2 downloaded successfully" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Failed to download llama3.2" -ForegroundColor Red
}

# Download Llama 3.2 Vision for image analysis
Write-Host ""
Write-Host "   Downloading llama3.2-vision (8GB)..." -ForegroundColor Cyan
ollama pull llama3.2-vision
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ llama3.2-vision downloaded successfully" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Failed to download llama3.2-vision" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Checking installed models..." -ForegroundColor Yellow
ollama list

Write-Host ""
Write-Host "4. Starting Ollama server..." -ForegroundColor Yellow
Write-Host "   The server will start in a new window" -ForegroundColor Gray
Write-Host "   Keep that window open while using ScanMed" -ForegroundColor Gray

# Start Ollama server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ollama serve"

Start-Sleep -Seconds 3

Write-Host "   ✅ Ollama server started" -ForegroundColor Green

Write-Host ""
Write-Host "5. Updating .env configuration..." -ForegroundColor Yellow

$envPath = Join-Path $PSScriptRoot "..\..\..\..\.env"
$envExamplePath = Join-Path $PSScriptRoot "..\..\..\..\.env.example"

if (Test-Path $envPath) {
    # Check if AI_PROVIDER already exists
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "AI_PROVIDER=") {
        # Update existing
        $envContent = $envContent -replace "AI_PROVIDER=.*", "AI_PROVIDER=ollama"
        Set-Content -Path $envPath -Value $envContent
        Write-Host "   ✅ Updated AI_PROVIDER=ollama in .env" -ForegroundColor Green
    } else {
        # Add new
        Add-Content -Path $envPath -Value "`nAI_PROVIDER=ollama"
        Write-Host "   ✅ Added AI_PROVIDER=ollama to .env" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  .env file not found at: $envPath" -ForegroundColor Yellow
    Write-Host "   Please manually add this line to your .env file:" -ForegroundColor Yellow
    Write-Host "   AI_PROVIDER=ollama" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Keep the Ollama server window open" -ForegroundColor White
Write-Host "  2. Start your backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "  3. Start your frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "  4. Test chat in ScanMed!" -ForegroundColor White
Write-Host ""
Write-Host "Troubleshooting:" -ForegroundColor Yellow
Write-Host "  - Server not running? Run: ollama serve" -ForegroundColor White
Write-Host "  - Need to re-download models? Run: ollama pull llama3.2" -ForegroundColor White
Write-Host "  - Full guide: backend/ml/js/chat/ollama/OLLAMA_SETUP.md" -ForegroundColor White
Write-Host ""
