# Update asset paths after moving assets to public/assets
# This script scans all .html files under d:\soal-jft\public and rewrites any
# reference that contains "quizzes/<any>/assets/" to just "assets/".
# It keeps the file UTF‑8 encoded.
$root = 'D:\\soal-jft\\public'
Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content -Path $path -Raw -Encoding utf8
    $newContent = $content -replace 'quizzes/[^/]+/assets/', 'assets/'
    if ($content -ne $newContent) {
        Set-Content -Path $path -Value $newContent -Encoding utf8
        Write-Host "Updated $path"
    }
}

