import email, os
from bs4 import BeautifulSoup
from PIL import Image
import io

MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
IMGDIR = r"d:\soal-jft\public\basu3-quiz\images"
os.makedirs(IMGDIR, exist_ok=True)

with open(MHTML, 'rb') as f:
    msg = email.message_from_binary_file(f)

loc_map = {}
html_part = None
for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html_part = part.get_payload(decode=True)
    if part.get_content_maintype() == 'image':
        payload = part.get_payload(decode=True)
        for key in ['Content-Location','Content-ID']:
            val = part.get(key)
            if val and payload:
                loc_map[val.strip('<>')] = payload
                loc_map[val] = payload

soup = BeautifulSoup(html_part.decode('utf-8', errors='ignore'), 'html.parser')
items = soup.find_all(attrs={'role':'listitem'})

qno = 0
for it in items:
    txt = it.get_text(' ', strip=True)
    if not txt or txt.lower().startswith('sesi'):
        continue
    qno += 1
    img = it.find('img')
    src = img.get('src') if img else None
    if src and src in loc_map:
        payload = loc_map[src]
        try:
            im = Image.open(io.BytesIO(payload)).convert('RGB')
            out = os.path.join(IMGDIR, f"basu3_{qno:02d}.jpg")
            im.save(out, 'JPEG')
            print(f"Soal {qno}: saved basu3_{qno:02d}.jpg ({len(payload)} bytes)")
        except Exception as e:
            print(f"Soal {qno}: err {e}")
    else:
        print(f"Soal {qno}: no mapped image (src={src})")

print('done, total questions:', qno)
