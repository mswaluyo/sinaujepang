import email
from email import policy
import sys

with open(r'_arsip\SHIMEMASU2\kunci.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp, policy=policy.default)

for part in msg.walk():
    ctype = part.get_content_type()
    if 'text/html' in ctype:
        content = part.get_content()
        with open('tools/shimemasu2_kunci.html', 'w', encoding='utf-8') as out:
            out.write(content)
        print('Saved shimemasu2_kunci.html, length:', len(content))
        break

