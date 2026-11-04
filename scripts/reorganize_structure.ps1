# Reorganize project structure for easier security management
# ------------------------------------------------------------
# 1. Create target directories if they don't exist
$publicPath = "D:\\soal-jft\\public"
$quizzesTarget = Join-Path $publicPath "quizzes"
$assetsTarget = Join-Path $publicPath "assets"

# Ensure the target folders exist
if (-not (Test-Path $quizzesTarget)) { New-Item -ItemType Directory -Path $quizzesTarget }
if (-not (Test-Path $assetsTarget)) { New-Item -ItemType Directory -Path $assetsTarget }

# 2. Move all quiz sub‑folders into public\quizzes
Get-ChildItem -Path $publicPath -Directory |
    Where-Object { Test-Path (Join-Path $_.FullName "quiz-data.json") } |
    ForEach-Object {
        $dest = Join-Path $quizzesTarget $_.Name
        Write-Host "Moving quiz folder $($_.FullName) -> $dest"
        Move-Item -Path $_.FullName -Destination $dest -Force
    }

# 3. Consolidate duplicated asset folders into public\assets
# Many quiz folders contain an "assets" sub‑folder. We'll merge their contents.
Get-ChildItem -Path $quizzesTarget -Recurse -Directory -Filter "assets" |
    ForEach-Object {
        $source = $_.FullName
        Write-Host "Merging assets from $source into $assetsTarget"
        Get-ChildItem -Path $source -File | ForEach-Object {
            $destFile = Join-Path $assetsTarget $_.Name
            if (-not (Test-Path $destFile)) {
                Move-Item -Path $_.FullName -Destination $destFile -Force
            } else {
                # If a file with the same name exists, rename to avoid overwrite
                $uniqueName = "{0}_{1}{2}" -f ($_.BaseName), (Get-Date -Format "yyyyMMddHHmmss"), $_.Extension
                Move-Item -Path $_.FullName -Destination (Join-Path $assetsTarget $uniqueName) -Force
            }
        }
        # After moving files, delete the now‑empty assets folder
        Remove-Item -Recurse -Force $source
    }

# 4. Clean up any leftover empty directories in public (optional)
Get-ChildItem -Path $publicPath -Recurse -Directory |
    Where-Object { -not (Get-ChildItem -Path $_.FullName) } |
    Remove-Item -Force

Write-Host "Reorganization complete."

