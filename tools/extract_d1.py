import email
from email import policy
import os

os.makedirs('tools/hare_new_extracted', exist_ok=True)

with open(r'_arsip\hare-new\d1.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp, policy=policy.default)

img_idx = 0
for part in msg.walk():
    ctype = part.get_content_type()
    if 'text/html' in ctype:
        payload = part.get_payload(decode=True)
        with open('tools/hare_new_extracted/d1.html', 'wb') as out:
            out.write(payload)
        print('Saved d1.html')
    elif 'image/' in ctype:
        img_idx += 1
        cid = part.get('Content-ID', '')
        cloc = part.get('Content-Location', '')
        ext = ctype.split('/')[1]
        payload = part.get_payload(decode=True)
        fname = f'img_{img_idx}_{os.path.basename(cloc) or "img"}.{ext}'
        with open(os.path.join('tools/hare_new_extracted', fname), 'wb') as out:
            out.write(payload)
        print(f'Saved image {fname}: size {len(payload)}, cid={cid}, cloc={cloc}')

