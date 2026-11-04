import re, quopri

with open(r'D:\soal-jft\_arsip\Magarimasu2\c1.mhtml', 'rb') as f:
    raw = f.read()

decoded = quopri.decodestring(raw).decode('utf-8', errors='ignore')

# Setiap card memiliki nomor soal atau urutan
cards = re.findall(r'<div class="soal-card"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>', decoded)
print(f"Cards found: {len(cards)}")

# Cari posisi masing-masing gambar
for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', decoded):
    src = m.group(1)
    pos = m.start()
    card_start = decoded.rfind('class="soal-card"', 0, pos)
    snippet = decoded[card_start:pos+200]
    nomor_m = re.search(r'data-nomor="(\d+)"', snippet) or re.search(r'Nomor\s*(\d+)', snippet) or re.search(r'id="soal-(\d+)"', snippet)
    soal_num = nomor_m.group(1) if nomor_m else 'unknown'
    print(f"Image {src.split('/')[-1]} -> Soal: {soal_num}")
