#!/usr/bin/env pwsh
# ---------------------------------------------------------------
# Generate a report of sessions per quiz package
# ---------------------------------------------------------------
$root = 'D:\\soal-jft'
$quizRoot = Join-Path $root 'public\\quizzes'
$reportPath = Join-Path $root 'quiz_sessions_report.md'

$reportLines = @()
$reportLines += "# Quiz Package Session Overview"
$reportLines += "Generated on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')\n"

Get-ChildItem -Path $quizRoot -Directory | ForEach-Object {
    $quizId = $_.Name
    $jsonPath = Join-Path $_.FullName 'quiz-data.json'
    if (-not (Test-Path $jsonPath)) { continue }
    # Load JSON (might be large, so use Get-Content -Raw)
    try {
        $json = Get-Content -Path $jsonPath -Raw -Encoding utf8 | ConvertFrom-Json
    } catch {
        Write-Host ("Failed to parse ${jsonPath}: " + $_)
        return
    }
    # Extract distinct sections
    $sections = $json | Select-Object -ExpandProperty section | Sort-Object -Unique
    $count = $sections.Count
    $reportLines += "## $quizId"
    $reportLines += "- Total distinct sessions: $count"
    $reportLines += "- Sessions:" 
    foreach ($sec in $sections) {
        $reportLines += "  - $sec"
    }
    $reportLines += ""
}

# Write report
$reportContent = $reportLines -join "`r`n"
Set-Content -Path $reportPath -Value $reportContent -Encoding utf8
Write-Host "Report written to $reportPath"
