import re, quopri

with open(r'D:\soal-jft\_arsip\Magarimasu2\c1.mhtml', 'rb') as f:
    raw = f.read()

decoded = quopri.decodestring(raw).decode('utf-8', errors='ignore')

# cari audio-btn
pattern = r'id="audio-btn-(\d+)"[^>]*data-audio-src="([^"]+)"'
matches = re.findall(pattern, decoded)
print(f"Found {len(matches)} audio-btn in c1.mhtml:")
for soal_id, src in matches:
    print(soal_id, "->", src)

# Also check surrounding card or question number
for soal_id, src in matches:
    pos = decoded.find(f'id="audio-btn-{soal_id}"')
    card_start = decoded.rfind('class="soal-card"', 0, pos)
    snippet = decoded[card_start:pos+150]
    num_match = re.search(r'data-nomor="(\d+)"', snippet) or re.search(r'Nomor\s*(\d+)', snippet)
    print(f"Audio {src} -> Soal ID {soal_id}, Nomor: {num_match.group(1) if num_match else 'unknown'}")
