import email
import re

with open(r'_arsip\SHIMEMASU2\c1.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html = part.get_payload(decode=True).decode('utf-8', errors='replace')
        for keyword in ['basu2.png', 'okaasan11.png']:
            pos = html.find(keyword)
            if pos != -1:
                chunk = html[max(0, pos-400):min(len(html), pos+400)].replace('\n', ' ')
                with open(f'tools/{keyword}_ctx.txt', 'w', encoding='utf-8') as out:
                    out.write(chunk)
                print(f"Written tools/{keyword}_ctx.txt")
        break

