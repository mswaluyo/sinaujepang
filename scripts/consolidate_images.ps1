#!/usr/bin/env pwsh
# Move residual quiz image assets to the central assets folder
$root = 'D:\\soal-jft'
$target = Join-Path $root 'public\\assets\\images'
if (-not (Test-Path $target)) { New-Item -ItemType Directory -Path $target -Force }

# Find all image files under public/quizzes/**/images
Get-ChildItem -Path (Join-Path $root 'public\\quizzes') -Recurse -Include *.png,*.jpg,*.jpeg,*.gif,*.webp,*.svg -File | ForEach-Object {
    $src = $_.FullName
    $dest = Join-Path $target $_.Name
    # If a file with same name exists, rename to avoid clash
    if (Test-Path $dest) {
        $base = $_.BaseName
        $ext = $_.Extension
        $unique = "${base}_$(Get-Date -Format 'yyyyMMddHHmmss')${ext}"
        $dest = Join-Path $target $unique
    }
    Move-Item -Path $src -Destination $dest -Force
    Write-Host "Moved $src -> $dest"
}

# Clean up empty image folders under quizzes
Get-ChildItem -Path (Join-Path $root 'public\\quizzes') -Recurse -Directory | Where-Object { $_.Name -eq 'images' } | ForEach-Object {
    if (-not (Get-ChildItem -Path $_.FullName -Force)) {
        Remove-Item -Path $_.FullName -Force -Recurse
        Write-Host "Removed empty folder $($_.FullName)"
    }
}

# Update HTML references from old quiz image paths to new central assets path
Get-ChildItem -Path (Join-Path $root 'public') -Recurse -Filter *.html | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content -Path $path -Raw -Encoding utf8
    $updated = $content -replace "quizzes/[^/]+/images/", "assets/images/"
    if ($content -ne $updated) {
        Set-Content -Path $path -Value $updated -Encoding utf8
        Write-Host "Updated image refs in $path"
    }
}

