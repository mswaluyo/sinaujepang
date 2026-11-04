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
            # Find images or texts in this d page
            imgs = [img.get('src') for img in soup.find_all('img')]
            title = soup.title.string if soup.title else ''
            print(f'=== {base} (title: {title}) ===')
            print(f'  Found {len(imgs)} img tags: {imgs[:5]}')
            # Look for reading passages or dokkai containers
            dokkai = soup.find_all(class_=lambda c: c and any(k in str(c).lower() for k in ['dokkai', 'bacaan', 'passage', 'text', 'soal']))
            print(f'  Found {len(dokkai)} potential dokkai containers')
            break

