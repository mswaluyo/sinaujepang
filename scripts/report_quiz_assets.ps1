#!/usr/bin/env pwsh
# ---------------------------------------------------------------
# Report assets (images & audio) per quiz package
# ---------------------------------------------------------------
$root = 'D:\\soal-jft'
$quizAssetRoot = Join-Path $root 'public\\assets\\quizzes'
$reportPath = Join-Path $root 'quiz_assets_report.md'

$lines = @()
$lines += "# Quiz Assets Report"
$lines += "Generated on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$lines += ""

Get-ChildItem -Path $quizAssetRoot -Directory | ForEach-Object {
    $quizId = $_.Name
    $lines += "## $quizId"
    $imgFolder = Join-Path $_.FullName 'images'
    $audioFolder = Join-Path $_.FullName 'audio'
    # Images
    if (Test-Path $imgFolder) {
        $imgs = Get-ChildItem -Path $imgFolder -File | Select-Object -ExpandProperty Name
        $lines += "- **Images** (`$($imgs.Count)`):"
        foreach ($i in $imgs) { $lines += "  - $i" }
    } else {
        $lines += "- **Images**: none"
    }
    # Audio
    if (Test-Path $audioFolder) {
        $audios = Get-ChildItem -Path $audioFolder -File | Select-Object -ExpandProperty Name
        $lines += "- **Audio** (`$($audios.Count)`):"
        foreach ($a in $audios) { $lines += "  - $a" }
    } else {
        $lines += "- **Audio**: none"
    }
    $lines += ""
}

$reportContent = $lines -join "`r`n"
Set-Content -Path $reportPath -Value $reportContent -Encoding utf8
Write-Host "Report written to $reportPath"

