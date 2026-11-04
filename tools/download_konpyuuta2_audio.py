import os, urllib.request

audio_urls = [
    ("c1.wav", "https://jft.minnanihongo.id/uploads/audio/6a140f229e76a_GeneratedAudioMay252026-3_55PM.wav"),
    ("c2.wav", "https://jft.minnanihongo.id/uploads/audio/6a142c2160f72_kagi2.wav"),
    ("c3.wav", "https://jft.minnanihongo.id/uploads/audio/6a143065ba44a_kagi3-4.wav"),
    ("c4.wav", "https://jft.minnanihongo.id/uploads/audio/6a147229b0c44_kagi5.wav"),
    ("c5.wav", "https://jft.minnanihongo.id/uploads/audio/6a14757ce7348_kagi6-7.wav"),
    ("c6.wav", "https://jft.minnanihongo.id/uploads/audio/6a147bb43abef_kagi8.wav"),
    ("c7.wav", "https://jft.minnanihongo.id/uploads/audio/6a147e03755f6_kagi9-10.wav"),
    ("c8.wav", "https://jft.minnanihongo.id/uploads/audio/6a1482d8031c2_kagi11-12.wav"),
]

os.makedirs('tools/konpyuuta2_audio', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for fname, url in audio_urls:
    outpath = os.path.join('tools/konpyuuta2_audio', fname)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(outpath, 'wb') as f:
            data = resp.read()
            f.write(data)
            print(f"Downloaded {fname} ({len(data)} bytes) from {url}")
    except Exception as e:
        print(f"Failed to download {fname}: {e}")

