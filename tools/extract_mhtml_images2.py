import email
from PIL import Image
import io, os

MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
IMGDIR = r"d:\soal-jft\public\basu3-quiz\images"
os.makedirs(IMGDIR, exist_ok=True)

with open(MHTML, 'rb') as f:
    msg = email.message_from_binary_file(f)

image_counter = 1
for part in msg.walk():
    if part.get_content_maintype() == 'image':
        payload = part.get_payload(decode=True)
        if payload and len(payload) > 5000:
            try:
                img = Image.open(io.BytesIO(payload)).convert('RGB')
                out = os.path.join(IMGDIR, f"basu3_{image_counter:02d}.jpg")
                img.save(out, 'JPEG')
                print(f"Berhasil mengekstrak basu3_{image_counter:02d}.jpg ({len(payload)} bytes)")
                image_counter += 1
            except Exception as e:
                print('skip invalid:', str(e)[:60])

print('total extracted:', image_counter-1)
