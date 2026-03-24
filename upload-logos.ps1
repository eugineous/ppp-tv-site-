# upload-logos.ps1 — uploads LOGOS folder to ppptv-videos R2 bucket via wrangler

$SOURCE_DIR = "C:\Users\User\Pictures\PPP TV WEBSITE\LOGOS"
$BUCKET = "ppptv-videos"
$WRANGLER = "C:\Users\User\Documents\PPP TV SITE\ppp-tv-site-final\node_modules\.bin\wrangler.cmd"

$images = Get-ChildItem -Path $SOURCE_DIR -File

Write-Host "Uploading $($images.Count) files to R2 bucket: $BUCKET" -ForegroundColor Cyan

foreach ($file in $images) {
    $key = "LOGOS/$($file.Name)"
    Write-Host "  Uploading: $key" -ForegroundColor Yellow
    & $WRANGLER r2 object put "$BUCKET/$key" --file="$($file.FullName)" --remote 2>&1
}

Write-Host "`nDone!" -ForegroundColor Green
