import email
from PIL import Image
import io

with open(r'_arsip\SHIMEMASU2\c1.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for i, part in enumerate(msg.walk()):
    if 'image' in part.get_content_type():
        payload = part.get_payload(decode=True)
        img = Image.open(io.BytesIO(payload))
        loc = part.get('Content-Location', '').split('/')[-1]
        print(f"Part {i}: loc={loc}, size={img.size}, len={len(payload)}")

