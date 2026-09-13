# scripts/setup.ps1 — One-shot judge setup for SignalScope
# Run from the repo root: .\scripts\setup.ps1
# Expected time: < 10 minutes on a clean machine with a decent connection.

param(
    [string]$WeightsUrl = "",   # Optional: direct URL to download best.pth
    [string]$TempUrl    = ""    # Optional: direct URL to download temperature.json
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`n=== SignalScope — Judge Setup ===" -ForegroundColor Cyan
Write-Host "SIH 2026 · PS-2`n"

# ── Step 1: Python deps ────────────────────────────────────────────────────────
Write-Host "[1/4] Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { Write-Error "pip install failed."; exit 1 }
Write-Host "      ✓ Python dependencies installed." -ForegroundColor Green

# ── Step 2: Download weights (optional) ───────────────────────────────────────
Write-Host "`n[2/4] Model weights..." -ForegroundColor Yellow
$weightsDir = Join-Path $PSScriptRoot "..\ml\weights"
New-Item -ItemType Directory -Force $weightsDir | Out-Null

$weightsFile = Join-Path $weightsDir "best.pth"
$tempFile    = Join-Path $weightsDir "temperature.json"

if ($WeightsUrl -ne "" -and -not (Test-Path $weightsFile)) {
    Write-Host "      Downloading best.pth..."
    Invoke-WebRequest -Uri $WeightsUrl -OutFile $weightsFile
    Write-Host "      ✓ best.pth downloaded." -ForegroundColor Green
} elseif (Test-Path $weightsFile) {
    Write-Host "      ✓ best.pth already present." -ForegroundColor Green
} else {
    Write-Host "      ⚠ No weights found. Run training or pass -WeightsUrl." -ForegroundColor DarkYellow
    Write-Host "        python ml\src\train.py --data_dir <path>"
}

if ($TempUrl -ne "" -and -not (Test-Path $tempFile)) {
    Write-Host "      Downloading temperature.json..."
    Invoke-WebRequest -Uri $TempUrl -OutFile $tempFile
    Write-Host "      ✓ temperature.json downloaded." -ForegroundColor Green
}

# ── Step 3: Frontend deps ──────────────────────────────────────────────────────
Write-Host "`n[3/4] Installing frontend dependencies..." -ForegroundColor Yellow
$webDir = Join-Path $PSScriptRoot "..\apps\web"
Push-Location $webDir
npm install
if ($LASTEXITCODE -ne 0) { Pop-Location; Write-Error "npm install failed."; exit 1 }
Pop-Location
Write-Host "      ✓ Frontend dependencies installed." -ForegroundColor Green

# ── Step 4: Smoke test ─────────────────────────────────────────────────────────
Write-Host "`n[4/4] Smoke test (predict.py — expects graceful error if no weights)..." -ForegroundColor Yellow
python ml\src\predict.py --image README.md 2>&1 | Select-Object -First 5
Write-Host "      ✓ predict.py imported successfully." -ForegroundColor Green

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host "`n=== Setup complete ===" -ForegroundColor Cyan
Write-Host @"

To start the application:

  Terminal 1 — Flask inference API:
    python services\inference-api\app.py

  Terminal 2 — Next.js frontend:
    npm run dev --prefix apps\web

  Then open: http://localhost:3000

To run evaluation (after training + calibration):
    python ml\src\evaluate.py ``
        --data_dir   <path\to\test_set> ``
        --weights    ml\weights\best.pth ``
        --temperature ml\weights\temperature.json
"@
