import email, re, os, requests

audio_files = {
    'audio_c1.wav': 'https://jft.minnanihongo.id/uploads/audio/6a18437dccae2_GeneratedAudioMay282026-8_28PM.wav',
    'audio_c2.wav': 'https://jft.minnanihongo.id/uploads/audio/6a1847239dd09_GeneratedAudioMay282026-8_43PM.wav',
    'audio_c4.wav': 'https://jft.minnanihongo.id/uploads/audio/6a184c97e1597_toire6.wav',
    'audio_c5.wav': 'https://jft.minnanihongo.id/uploads/audio/6a184edbd7bcd_toire7.wav',
    'audio_c6.wav': 'https://jft.minnanihongo.id/uploads/audio/6a192b3913c04_toire8.wav',
    'audio_c7.wav': 'https://jft.minnanihongo.id/uploads/audio/6a192c8dae427_torie9.wav',
    'audio_c8.wav': 'https://jft.minnanihongo.id/uploads/audio/6a192e0bd0492_toire10.wav',
}

out_dir = r'D:\soal-jft\public\gakusei2-quiz\assets'
os.makedirs(out_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

for name, url in audio_files.items():
    dst = os.path.join(out_dir, name)
    print(f"Downloading {name} from {url}...")
    try:
        r = requests.get(url, headers=headers, timeout=20)
        if r.status_code == 200:
            with open(dst, 'wb') as f:
                f.write(r.content)
            print(f"  OK: {len(r.content)} bytes saved to {dst}")
        else:
            print(f"  Failed: HTTP {r.status_code}")
    except Exception as e:
        print(f"  Error: {e}")

