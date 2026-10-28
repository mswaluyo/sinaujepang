import re
from urllib.parse import unquote

# Test unquote
test_str = 'data-value=3D"Opsi 1"'
decoded = unquote(test_str)
print('Test 1:', repr(decoded))

test_str2 = '%E5%BE%A1%E8%86%B3%E3%81%8C%E6%B1%9A%E3%81%8C%E6%B1%9A'
decoded2 = unquote(test_str2)
print('Test 2:', repr(decoded2))

# Read MHTML file
MHTML_PATH = r'd:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml'
with open(MHTML_PATH, 'rb') as f:
    raw = f.read()

# Find boundary
import re
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
    # First decode the URL-encoded parts
    part_html = unquote(part_html)
    html += part_html

# Check for data-value
print('\n=== Checking data-value after unquote ===')
idx = html.find('data-value')
if idx > 0:
    print('Found at position:', idx)
    print('Context:', html[idx-50:idx+100])
else:
    print('Not found')
    
# Check for role="listitem"
print('\n=== Checking role="listitem" ===')
idx = html.find('role="listitem"')
if idx > 0:
    print('Found at position:', idx)
    print('Count:', html.count('role="listitem"'))
else:
    print('Not found - checking role=3D"listitem":')
    idx = html.find('role=3D"listitem"')
    if idx > 0:
        print('Found at position:', idx)
        print('Count:', html.count('role=3D"listitem"'))
