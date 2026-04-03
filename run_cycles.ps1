$url = "https://ppp-tv-worker.euginemicah.workers.dev/refresh"
$hdr = @{Authorization="Bearer ppptv-secret-2026"}
$total = 0
for ($i = 1; $i -le 9; $i++) {
    try {
        $r = Invoke-RestMethod $url -Method POST -Headers $hdr -TimeoutSec 55
        $total += $r.rewritten
        Write-Host "[$i] fetched=$($r.fetched) rewritten=$($r.rewritten) total=$total ms=$($r.durationMs)"
    } catch {
        Write-Host "[$i] ERROR: $_"
    }
}
Write-Host "Done. Total new articles: $total"
