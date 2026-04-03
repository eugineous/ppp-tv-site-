$base = "https://ppp-tv-site-final.vercel.app/api/revalidate"
$hdr = @{Authorization="Bearer ppptv-secret-2026";"Content-Type"="application/json"}
$paths = @("/","/trending","/entertainment","/sports","/movies","/lifestyle","/technology","/news","/search")
foreach ($p in $paths) {
    try {
        $r = Invoke-RestMethod $base -Method POST -Headers $hdr -Body "{`"path`":`"$p`"}" -TimeoutSec 15
        Write-Host "Revalidated $p`: $($r | ConvertTo-Json -Compress)"
    } catch {
        Write-Host "Failed $p`: $_"
    }
}
Write-Host "All pages revalidated."
