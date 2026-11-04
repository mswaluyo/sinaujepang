import email
import re

with open(r'_arsip\SHIMEMASU2\c1.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html = part.get_payload(decode=True).decode('utf-8', errors='replace')
        for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', html):
            src = m.group(1).split('/')[-1]
            start = max(0, m.start() - 250)
            end = min(len(html), m.end() + 250)
            chunk = html[start:end].replace('\n', ' ')
            print(f"=== {src} ===")
            print(chunk[:300])
        break

