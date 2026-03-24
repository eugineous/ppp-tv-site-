# upload-images-to-r2.ps1
# Uploads all images from C:\Users\User\Pictures\PPP TV WEBSITE to R2 bucket ppptv-assets

$CF_ACCOUNT_ID = "c6f4f875a289e51e48a85baa1f77411e"
$CF_API_TOKEN = "cfut_gMVltTyyAQYHcBvBj7ZAB4c6tcrmoTwrYru7cb8o530d1761"
$BUCKET = "ppptv-assets"
$SOURCE_DIR = "C:\Users\User\Pictures\PPP TV WEBSITE"
$PUBLIC_BASE = "https://ppptv-assets.ppp-tv-site.workers.dev"

$MIME_MAP = @{
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".gif"  = "image/gif"
    ".webp" = "image/webp"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

$authHeader = @{ "Authorization" = "Bearer $CF_API_TOKEN" }

$images = Get-ChildItem -Path $SOURCE_DIR -Recurse -File | Where-Object { $MIME_MAP.ContainsKey($_.Extension.ToLower()) }

Write-Host "Found $($images.Count) images to upload" -ForegroundColor Cyan

$results = @()

foreach ($file in $images) {
    $relativePath = $file.FullName.Substring($SOURCE_DIR.Length).TrimStart('\', '/')
    $key = $relativePath -replace '\\', '/'
    $ext = $file.Extension.ToLower()
    $mimeType = $MIME_MAP[$ext]
    $encodedKey = [Uri]::EscapeDataString($key) -replace '%2F', '/'
    $apiUrl = "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/r2/buckets/$BUCKET/objects/$encodedKey"

    try {
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $null = Invoke-RestMethod -Uri $apiUrl -Method Put -Headers $authHeader -Body $bytes -ContentType $mimeType -ErrorAction Stop
        $publicUrl = "$PUBLIC_BASE/$key"
        Write-Host "  OK  $key" -ForegroundColor Green
        $results += [PSCustomObject]@{ Key = $key; URL = $publicUrl; Status = "OK" }
    }
    catch {
        Write-Host "  FAIL $key - $($_.Exception.Message)" -ForegroundColor Red
        $results += [PSCustomObject]@{ Key = $key; URL = ""; Status = "FAIL" }
    }
}

$manifestPath = Join-Path $PSScriptRoot "r2-image-manifest.json"
$results | ConvertTo-Json -Depth 3 | Set-Content $manifestPath

$okCount = ($results | Where-Object { $_.Status -eq "OK" }).Count
Write-Host "Done! $okCount / $($results.Count) uploaded. Manifest: $manifestPath" -ForegroundColor Cyan
