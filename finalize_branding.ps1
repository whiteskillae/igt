$dir = 'd:\Downloads\rrb_je_pyq\COMPNEY WORK\Website\IGT'
$cssPath = Join-Path $dir 'css\styles.css'
$files = @('index.html','about.html','services.html','candidates.html','employers.html','contact.html','training.html','nursing-jobs.html','taxi-driver-jobs.html','faq.html')

# 1. Update CSS
$cssContent = Get-Content $cssPath -Raw -Encoding UTF8

# Update navbar height to 115px
$cssContent = $cssContent -replace 'height:\s*90px;', 'height: 115px;'
# Update nav logo img height to 90px and fix padding
$cssContent = $cssContent -replace 'height:\s*85px;', 'height: 90px;'
$cssContent = $cssContent -replace 'padding:\s*0px\s*0px;', 'padding: 10px 20px;'
$cssContent = $cssContent -replace 'padding:\s*8px\s*16px;', 'padding: 10px 20px;'

# Fix footer logo img height to 120px and fix padding/background
$cssContent = $cssContent -replace 'height:\s*55px;', 'height: 120px;'
$cssContent = $cssContent -replace 'height:\s*90px;', 'height: 120px;'
$cssContent = $cssContent -replace 'padding:\s*6px\s*12px;', 'padding: 15px 30px;'
$cssContent = $cssContent -replace 'padding:\s*0px\s*px;', 'padding: 15px 30px;'
$cssContent = $cssContent -replace 'background:\s*rgba\(255,\s*255,\s*255,\s*0\.726\);', 'background: white;'

Set-Content -Path $cssPath -Value $cssContent -Encoding UTF8 -NoNewline
Write-Host "Updated styles.css"

# 2. Update HTML (remove redundant text)
foreach ($f in $files) {
    if ($f -eq '') { continue }
    $path = Join-Path $dir $f
    if (Test-Path $path) {
        $content = Get-Content $path -Raw -Encoding UTF8
        $content = $content -replace '<div class="footer-logo">IBREU Global Talent</div>', ''
        Set-Content -Path $path -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Cleaned up footer in $f"
    }
}
