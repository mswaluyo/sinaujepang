import re, base64, os
from PIL import Image
import io

MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
IMGDIR = r"d:\soal-jft\public\basu3-quiz\images"
os.makedirs(IMGDIR, exist_ok=True)

raw = open(MHTML, 'rb').read().decode('utf-8', errors='ignore')
m = re.search(r'boundary="([^"]+)"', raw)
parts = raw.split('--'+m.group(1))

idx = 0
for p in parts:
    ct = re.search(r'Content-Type:\s*([^\r\n]+)', p)
    if ct and 'image/' in ct.group(1):
        he = p.find('\n\n')
        body = p[he+2:].strip() if he>0 else p.strip()
        b64 = ''.join(body.split())
        try:
            bin_ = base64.b64decode(b64)
            img = Image.open(io.BytesIO(bin_))
            fmt = img.format
            rgb = img.convert('RGB')
            outname = f"basu3_{idx+1:02d}.jpg"
            outpath = os.path.join(IMGDIR, outname)
            rgb.save(outpath, 'JPEG')
            print(f"{fmt} -> JPEG: {outname}")
            idx += 1
        except Exception as e:
            print('err', e)

print('converted', idx, 'images')
