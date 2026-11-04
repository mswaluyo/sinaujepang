import email
from email import policy
import os
import glob
from bs4 import BeautifulSoup

for d_file in sorted(glob.glob(r'_arsip\hare-new\d*.mhtml')):
    base = os.path.basename(d_file)
    with open(d_file, 'rb') as fp:
        msg = email.message_from_binary_file(fp, policy=policy.default)
    for part in msg.walk():
        if 'text/html' in part.get_content_type():
            html = part.get_payload(decode=True).decode('utf-8', errors='replace')
            soup = BeautifulSoup(html, 'html.parser')
            active = soup.find(class_='active-soal')
            if active:
                s_id = active.get('data-soal-id')
                p = active.find(class_='soal-pertanyaan')
                p_txt = p.get_text(strip=True) if p else ''
                print(f'{base}: active soal-id={s_id}, title={p_txt[:40]}')
            else:
                print(f'{base}: no active-soal found')
            break

