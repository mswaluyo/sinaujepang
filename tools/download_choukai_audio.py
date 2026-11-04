import urllib.request
import os

urls = [
    ('c1.wav', 'https://jft.minnanihongo.id/uploads/audio/6a15362554dff_GeneratedAudioMay262026-12_51PM.wav'),
    ('c2.wav', 'https://jft.minnanihongo.id/uploads/audio/6a1538fc76f51_GeneratedAudioMay262026-1_07PM.wav'),
    ('c3.wav', 'https://jft.minnanihongo.id/uploads/audio/6a153e84d854f_chichi1.wav'),
    ('c4.wav', 'https://jft.minnanihongo.id/uploads/audio/6a1540552d0c4_GeneratedAudioMay262026-1_39PM.wav'),
    ('c5.wav', 'https://jft.minnanihongo.id/uploads/audio/6a1541be6caf9_GeneratedAudioMay262026-1_43PM.wav')
]

os.makedirs('tools/hare_new_audio', exist_ok=True)
for name, url in urls:
    dest = os.path.join('tools/hare_new_audio', name)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f:
            f.write(resp.read())
        print(f'Downloaded {name}: size {os.path.getsize(dest)}')
    except Exception as e:
        print(f'Failed {name}: {e}')

