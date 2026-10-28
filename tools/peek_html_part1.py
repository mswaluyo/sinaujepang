import re
from bs4 import BeautifulSoup

MHTML_PATH = r'd:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml'

with open(MHTML_PATH, 'rb') as f:
    raw = f.read()

# Find boundary
m = re.search(rb'boundary="([^"]+)"', raw)
boundary = m.group(1)

# Split parts
parts = raw.split(b'--' + boundary)

# Extract HTML parts
html_parts = []
for p in parts:
    if b'<!DOCTYPE' in p or b'<html' in p[:300]:
        html_parts.append(p)

# Decode
html = ''
for p in html_parts:
    html += p.decode('utf-8', errors='ignore')
html = html.replace('\x00', '')

# Print first 3000 chars
print('=== First 3000 chars of HTML ===')
print(html[:3000])

print('\n\n=== Checking for key patterns ===')
patterns = ['Sesi 1', 'role="radio"', 'data-value', 'aria-label', 'Soal', '御膳']
for pat in patterns:
    count = html.count(pat)
    print(f'{pat}: {count}')
