import re

MHTML_PATH = r'd:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml'

with open(MHTML_PATH, 'rb') as f:
    raw = f.read()

# Find boundary
m = re.search(rb'boundary="([^"]+)"', raw)
boundary = m.group(1)

# Split parts
parts = raw.split(b'--' + boundary)

# Get HTML parts
html_parts = []
for i, p in enumerate(parts):
    if b'<!DOCTYPE' in p or b'<html' in p[:300]:
        html_parts.append((i, p))

# Check part 1 for structure
i, p = html_parts[0]
print('Part', i, 'length:', len(p))

# Decode
try:
    html = p.decode('utf-8', errors='ignore')
except:
    html = p.decode('cp932', errors='ignore')

html = html.replace('\x00', '')

# Find role="listitem"
count = html.count('role="listitem"')
print('role="listitem" count:', count)

# Find first occurrence
idx = html.find('role="listitem"')
if idx > 0:
    print('First occurrence at position:', idx)
    print('Context:', html[idx-200:idx+200])

# Check for other question markers
print()
print('=== Checking for other question patterns ===')
markers = ['data-value', 'answer', 'option', 'question', 'jawab']
for m in markers:
    count = html.count(m)
    print(f'{m}: {count}')

# Find first data-value
idx = html.find('data-value')
if idx > 0:
    print('\nFirst data-value context:')
    print(html[idx:idx+300])


