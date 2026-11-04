#!/usr/bin/env pwsh
# ---------------------------------------------------------------
# Update asset paths in quiz-data.json after reorganizing assets
# ---------------------------------------------------------------

$root      = 'D:\\soal-jft'
$quizRoot  = Join-Path $root 'public\\quizzes'

Get-ChildItem -Path $quizRoot -Directory | ForEach-Object {
    $jsonPath = Join-Path $_.FullName 'quiz-data.json'
    if (-not (Test-Path $jsonPath)) { return }

    $content = Get-Content -Path $jsonPath -Raw -Encoding utf8
    # Replace the generic "assets/" prefix with the per‑quiz folder path
    $updated = $content -replace 'assets/', "assets/quizzes/$($_.Name)/"
    Set-Content -Path $jsonPath -Value $updated -Encoding utf8
    Write-Host "✅ Updated $jsonPath"
}

