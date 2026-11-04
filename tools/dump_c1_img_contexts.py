import email
import re

with open(r'_arsip\SHIMEMASU2\c1.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html = part.get_payload(decode=True).decode('utf-8', errors='replace')
        out_lines = []
        for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', html):
            src = m.group(1).split('/')[-1]
            start = max(0, m.start() - 350)
            end = min(len(html), m.end() + 350)
            chunk = html[start:end].replace('\n', ' ')
            out_lines.append(f"=== {src} ===\n{chunk}\n")
        with open('tools/c1_img_contexts.txt', 'w', encoding='utf-8') as f_out:
            f_out.write('\n'.join(out_lines))
        print('Written tools/c1_img_contexts.txt')
        break

