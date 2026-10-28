import re
from bs4 import BeautifulSoup
from urllib.parse import unquote

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

# Decode and URL-decode
html = ''
for p in html_parts:
    part_html = p.decode('utf-8', errors='ignore')
    part_html = unquote(part_html)
    html += part_html

# Remove null bytes
html = html.replace('\x00', '')

# Show context around 'Sesi 1'
print('=== Context around Sesi 1 ===')
idx = html.find('Sesi 1')
if idx > 0:
    print(html[idx-200:idx+500])

# Count data-value attributes in first 20000 chars
print('\n=== data-value count in first 20000 chars ===')
print(html[:20000].count('data-value'))

# Show first data-value context
idx = html.find('data-value', 10000)
if idx > 0:
    print('\nFirst data-value context:')
    print(html[idx-100:idx+200])

# Show a few characters around 'data-value'
print('\n=== Looking for "data-value=" in first 5000 chars ===')
idx = html.find('data-value=', 100)
if idx > 0:
    print('Found at position:', idx)
    print(html[idx-50:idx+150])
