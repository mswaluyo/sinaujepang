#!/usr/bin/env pwsh
# ---------------------------------------------------------------
# Organize image & audio assets per quiz package
# ---------------------------------------------------------------

$root       = 'D:\\soal-jft'
$quizRoot   = Join-Path $root 'public\\quizzes'
$assetRoot  = Join-Path $root 'public\\assets\\quizzes'
$sharedRoot = Join-Path $root 'public\\assets\\shared'

# ensure target folders exist
New-Item -ItemType Directory -Path $assetRoot  -Force | Out-Null
New-Item -ItemType Directory -Path $sharedRoot -Force | Out-Null

# ----------------------------------------------------------------
# 1. Scan each quiz folder for referenced assets
# ----------------------------------------------------------------
Get-ChildItem -Path $quizRoot -Directory | ForEach-Object {
    $quizId   = $_.Name
    $jsonPath = Join-Path $_.FullName 'quiz-data.json'
    if (-not (Test-Path $jsonPath)) { return }

    $json = Get-Content -Path $jsonPath -Raw -Encoding utf8 | ConvertFrom-Json
    $images = $json | ForEach-Object { $_.img } | Where-Object { $_ } | Sort-Object -Unique
    $audios = $json | ForEach-Object { $_.audio } | Where-Object { $_ } | Sort-Object -Unique

    $targetImgDir  = Join-Path $assetRoot ($quizId + '\\images')
    $targetAudDir = Join-Path $assetRoot ($quizId + '\\audio')
    New-Item -ItemType Directory -Path $targetImgDir  -Force | Out-Null
    New-Item -ItemType Directory -Path $targetAudDir -Force | Out-Null

    # ----------------------------------------------------------------
    #   Move each referenced file
    # ----------------------------------------------------------------
    foreach ($rel in $images) {
        $src = Join-Path $root ('public\\' + $rel -replace '^assets\\/', '')
        if (Test-Path $src) {
            $dst = Join-Path $targetImgDir (Split-Path $src -Leaf)
            Move-Item -LiteralPath $src -Destination $dst -Force
        }
    }
    foreach ($rel in $audios) {
        $src = Join-Path $root ('public\\' + $rel -replace '^assets\\/', '')
        if (Test-Path $src) {
            $dst = Join-Path $targetAudDir (Split-Path $src -Leaf)
            Move-Item -LiteralPath $src -Destination $dst -Force
        }
    }
}

# ----------------------------------------------------------------
# 2. Anything left in public\assets that wasn't moved -> shared
# ----------------------------------------------------------------
Get-ChildItem -Path (Join-Path $root 'public\\assets') -File |
    Where-Object { $_.FullName -notmatch '\\quizzes\\' } |
    ForEach-Object {
        $type = if ($_.Extension -match '\\.(png|jpg|jpeg|gif|mp3|wav)$') { 'images' } else { 'audio' }
        $dest = Join-Path $sharedRoot $type
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
        Move-Item -LiteralPath $_.FullName -Destination $dest -Force
    }

Write-Host "✅ Aset terorganisir di $assetRoot dan $sharedRoot"
