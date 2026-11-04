import os, urllib.request

audio_files = [
    ("c1.wav", "https://jft.minnanihongo.id/uploads/audio/6a2129fc8940f_okaasan1.wav"),
    ("c2.wav", "https://jft.minnanihongo.id/uploads/audio/6a212b7dcb7a4_okaasan2.wav"),
    ("c3.wav", "https://jft.minnanihongo.id/uploads/audio/6a212f4fd96fd_okaasan3.wav"),
    ("c4.wav", "https://jft.minnanihongo.id/uploads/audio/6a21409fc6cde_okaasan4.wav"),
    ("c5.wav", "https://jft.minnanihongo.id/uploads/audio/6a2142b4518e4_okaasan5.wav"),
    ("c6.wav", "https://jft.minnanihongo.id/uploads/audio/6a2143b7e1d25_okaasan6.wav"),
    ("c7.wav", "https://jft.minnanihongo.id/uploads/audio/6a21449cea925_okaasan7.wav"),
    ("c8.wav", "https://jft.minnanihongo.id/uploads/audio/6a2146661dbe1_okaasan8.wav"),
    ("c9.wav", "https://jft.minnanihongo.id/uploads/audio/6a214796199e8_okaasan9.wav"),
]

out_dir = r"d:\soal-jft\tools\magarimasu2_audio"
os.makedirs(out_dir, exist_ok=True)

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

for filename, url in audio_files:
    out_path = os.path.join(out_dir, filename)
    print(f"Downloading {filename} from {url}...")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp, open(out_path, "wb") as out:
            out.write(resp.read())
        print(f"Saved {filename} ({os.path.getsize(out_path)} bytes)")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")

print("Audio download complete!")
