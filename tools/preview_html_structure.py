import json
import re
from bs4 import BeautifulSoup
from urllib.parse import unquote

# Configuration
MHTML_PATH = r'd:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml'
JSON_PATH = r'd:\soal-jft\public\basu3-quiz\quiz-data.json'

# Read MHTML file as bytes
with open(MHTML_PATH, 'rb') as f:
    raw = f.read()

# Find boundary
m = re.search(rb'boundary="([^"]+)"', raw)
boundary = m.group(1).decode('utf-8')

# Split parts and extract HTML
parts = raw.split(b'--' + boundary.encode('utf-8'))

# Extract HTML parts
html_parts = []
for p in parts:
    if b'<!DOCTYPE' in p or b'<html' in p[:300]:
        html_parts.append(p)

# Decode and URL-decode each part
html = ''
for p in html_parts:
    try:
        part_html = p.decode('utf-8', errors='ignore')
    except:
        part_html = p.decode('cp932', errors='ignore')
    # URL-decode
    part_html = unquote(part_html)
    html += part_html

# Replace URL-encoded special characters
html = html.replace('=3D', '=')
html = html.replace('&amp;', '&')
html = html.replace('%20', ' ')
html = html.replace('%22', '"')
html = html.replace('%3C', '<')
html = html.replace('%3E', '>')
html = html.replace('%26', '&')
html = html.replace('\\"', '"')

# Remove null bytes
html = html.replace('\x00', '')

# Parse HTML
soup = BeautifulSoup(html, 'html.parser')

# Get heading texts
headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], role='heading')
print('Headings found:', len(headings))

# Get all radio buttons
radio_buttons = soup.find_all('input', {'type': 'radio'})
print('Radio buttons:', len(radio_buttons))
if radio_buttons:
    print('First radio button attrs:', radio_buttons[0].attrs)

# Extract question data
questions = []
for i, heading in enumerate(headings):
    # Get heading text
    title = heading.get_text(strip=True)
    
    # Find options after this heading (in the next listitem)
    # Look for the parent listitem
    parent_listitem = heading.find_parent('div', role='listitem')
    if parent_listitem:
        # Find radio buttons in this listitem
        rb = parent_listitem.find('input', {'type': 'radio'})
        if rb:
            data_value = rb.get('data-value', '')
            if data_value:
                # URL decode the option text
                data_value = unquote(data_value)
                # Decode special characters
                data_value = data_value.replace('=3D', '=')
                data_value = data_value.replace('&amp;', '&')
                data_value = data_value.replace('\\"', '"')
                print(f'Q{i+1} no={title[:50]}: {data_value[:50]}')

print('\n=== Conclusion ===')
print('Need to parse the QCM (Google Forms) structure more carefully')
print('The quiz uses a JavaScript data structure (data-params) to store questions')

