import email
from PIL import Image
import io

with open(r'_arsip\GENKAN\c1.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for i, part in enumerate(msg.walk()):
    if 'image' in part.get_content_type():
        loc = part.get('Content-Location', '').split('/')[-1]
        payload = part.get_payload(decode=True)
        img = Image.open(io.BytesIO(payload))
        print(f"Part {i}: loc={loc}, size={img.size}, bytes={len(payload)}")

