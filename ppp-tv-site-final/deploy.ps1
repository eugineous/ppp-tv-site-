# PPP TV — Full Deploy Script
# Run from: ppp-tv-site-final/
# Usage: .\deploy.ps1

Write-Host "=== PPP TV Deploy ===" -ForegroundColor Cyan

# 1. Deploy Cloudflare Worker
Write-Host "`n[1/2] Deploying Cloudflare Worker..." -ForegroundColor Yellow
Set-Location worker
npx wrangler deploy
Set-Location ..

# 2. Deploy Vercel
Write-Host "`n[2/2] Deploying to Vercel..." -ForegroundColor Yellow
npx vercel --prod --yes

Write-Host "`n=== Deploy Complete ===" -ForegroundColor Green
Write-Host "Worker: https://ppp-tv-worker.ppp-tv-site.workers.dev"
Write-Host "Site:   https://ppp-tv-site-final.vercel.app"
