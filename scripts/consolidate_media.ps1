#!/usr/bin/env pwsh
# Consolidate quiz media (images and audio) into central assets folders
$root = 'D:\\soal-jft'
$imgTarget = Join-Path $root 'public\\assets\\images'
$audioTarget = Join-Path $root 'public\\assets\\audio'
# Ensure target folders exist
foreach ($t in @($imgTarget,$audioTarget)) { if (-not (Test-Path $t)) { New-Item -ItemType Directory -Path $t -Force } }
# -------------------------------------------------------------------
# Move image files (if any remain) from quizzes/**/images
Get-ChildItem -Path (Join-Path $root 'public\\quizzes') -Recurse -Include *.png,*.jpg,*.jpeg,*.gif,*.webp,*.svg -File | ForEach-Object {
    $src = $_.FullName
    $dest = Join-Path $imgTarget $_.Name
    if (Test-Path $dest) { $base = $_.BaseName; $ext = $_.Extension; $dest = Join-Path $imgTarget "${base}_$(Get-Date -Format 'yyyyMMddHHmmss')${ext}" }
    Move-Item -Path $src -Destination $dest -Force
    Write-Host "Moved image $src -> $dest"
}
# Move audio files from quizzes/** (any folder) to central audio folder
Get-ChildItem -Path (Join-Path $root 'public\\quizzes') -Recurse -Include *.mp3,*.wav,*.ogg,*.m4a,*.aac -File | ForEach-Object {
    $src = $_.FullName
    $dest = Join-Path $audioTarget $_.Name
    if (Test-Path $dest) { $base = $_.BaseName; $ext = $_.Extension; $dest = Join-Path $audioTarget "${base}_$(Get-Date -Format 'yyyyMMddHHmmss')${ext}" }
    Move-Item -Path $src -Destination $dest -Force
    Write-Host "Moved audio $src -> $dest"
}
# Clean up empty asset subfolders under quizzes (images, audio)
Get-ChildItem -Path (Join-Path $root 'public\\quizzes') -Recurse -Directory | Where-Object { $_.Name -in @('images','audio') } | ForEach-Object {
    if (-not (Get-ChildItem -Path $_.FullName -Force)) {
        Remove-Item -Path $_.FullName -Force -Recurse
        Write-Host "Removed empty folder $($_.FullName)"
    }
}
# Update HTML and JSON references to new asset paths
Get-ChildItem -Path (Join-Path $root 'public') -Recurse -Filter *.html -File | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content -Path $path -Raw -Encoding utf8
    $updated = $content -replace 'quizzes/[^/]+/images/', 'assets/images/'
    $updated = $updated -replace 'quizzes/[^/]+/audio/', 'assets/audio/'
    if ($content -ne $updated) { Set-Content -Path $path -Value $updated -Encoding utf8; Write-Host "Updated HTML refs in $path" }
}
# Also update JSON quiz-data files if they contain asset paths
Get-ChildItem -Path (Join-Path $root 'public\\quizzes') -Recurse -Filter *.json -File | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content -Path $path -Raw -Encoding utf8
    $updated = $content -replace 'quizzes/[^/]+/images/', 'assets/images/'
    $updated = $updated -replace 'quizzes/[^/]+/audio/', 'assets/audio/'
    if ($content -ne $updated) { Set-Content -Path $path -Value $updated -Encoding utf8; Write-Host "Updated JSON refs in $path" }
}

