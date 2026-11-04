$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
Function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

$lang = [Windows.Globalization.Language]::new("ja")
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)

$p = "D:\soal-jft\public\genkan-quiz\assets\D11.png"
$fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($p)
$sfile = Await $fileTask ([Windows.Storage.StorageFile])
$streamTask = $sfile.OpenAsync([Windows.Storage.FileAccessMode]::Read)
$stream = Await $streamTask ([Windows.Storage.Streams.IRandomAccessStream])
$decoderTask = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
$decoder = Await $decoderTask ([Windows.Graphics.Imaging.BitmapDecoder])
$bitmapTask = $decoder.GetSoftwareBitmapAsync()
$bitmap = Await $bitmapTask ([Windows.Graphics.Imaging.SoftwareBitmap])

$ocrTask = $engine.RecognizeAsync($bitmap)
$result = Await $ocrTask ([Windows.Media.Ocr.OcrResult])

$out = @()
foreach ($line in $result.Lines) {
    $words = ($line.Words | ForEach-Object { "$($_.Text)(x:$($_.BoundingRect.X),y:$($_.BoundingRect.Y))" }) -join " "
    $out += "$($line.Text) ===> $words"
}
$out | Out-File -FilePath "tools/ocr_d11_words.txt" -Encoding utf8
Write-Output "D11 word inspection complete"

