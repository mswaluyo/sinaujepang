$audios = @{
    'audio_c1.wav' = 'https://jft.minnanihongo.id/uploads/audio/6a18437dccae2_GeneratedAudioMay282026-8_28PM.wav'
    'audio_c2.wav' = 'https://jft.minnanihongo.id/uploads/audio/6a1847239dd09_GeneratedAudioMay282026-8_43PM.wav'
    'audio_c4.wav' = 'https://jft.minnanihongo.id/uploads/audio/6a184c97e1597_toire6.wav'
    'audio_c5.wav' = 'https://jft.minnanihongo.id/uploads/audio/6a184edbd7bcd_toire7.wav'
    'audio_c6.wav' = 'https://jft.minnanihongo.id/uploads/audio/6a192b3913c04_toire8.wav'
    'audio_c7.wav' = 'https://jft.minnanihongo.id/uploads/audio/6a192c8dae427_torie9.wav'
    'audio_c8.wav' = 'https://jft.minnanihongo.id/uploads/audio/6a192e0bd0492_toire10.wav'
}

foreach ($pair in $audios.GetEnumerator()) {
    $out = "public\gakusei2-quiz\assets\" + $pair.Key
    Write-Host "Downloading $($pair.Key)..."
    Invoke-WebRequest -Uri $pair.Value -OutFile $out -UserAgent 'Mozilla/5.0'
    $len = (Get-Item $out).Length
    Write-Host "Saved: $($pair.Key) ($len bytes)"
}

