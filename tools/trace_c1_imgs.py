import email
import re

with open(r'_arsip\SHIMEMASU2\c1.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

cid_to_name = {}
for i, part in enumerate(msg.walk()):
    cid = part.get('Content-ID') or part.get('Content-Location')
    if cid:
        cid_to_name[cid.strip('<>')] = (i, len(part.get_payload(decode=True) or b''))

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html = part.get_payload(decode=True).decode('utf-8', errors='replace')
        for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', html):
            src = m.group(1).replace('cid:', '')
            pos = m.start()
            preceding = html[max(0, pos-400):pos]
            nums = re.findall(r'#(\d+)', preceding)
            txts = re.findall(r'<div[^>]*>([^<]+)</div>', preceding)
            print(f"IMG src={src} -> bytes={cid_to_name.get(src, '?')}")
            print(f"   Nums: {nums[-2:] if nums else 'none'} | Txt: {txts[-2:] if txts else 'none'}")
        break

