import json
import re
import os
from bs4 import BeautifulSoup

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

# Extract HTML part
html_bytes = b''
for p in parts:
    if b'<!DOCTYPE' in p or b'<html' in p:
        he = p.find(b'\n\n')
        if he > 0:
            body = p[he+2:]
        else:
            body = p
        html_bytes += body

# Try to decode
try:
    html = html_bytes.decode('utf-8')
    print('Decoded as UTF-8')
except:
    try:
        html = html_bytes.decode('shift_jis')
        print('Decoded as Shift-JIS')
    except:
        html = html_bytes.decode('cp932', errors='ignore')
        print('Decoded as cp932')

print('HTML length:', len(html))

# Replace any null bytes
html = html.replace('\x00', '')

# Parse HTML
soup = BeautifulSoup(html, 'html.parser')

# Find question containers (role=listitem)
items = soup.find_all(attrs={'role': 'listitem'})

# Filter questions with images
q_items = []
for it in items:
    imgs = [img.get('src') for img in it.find_all('img') if img.get('src')]
    if any('forms-images' in u or 'googleusercontent' in u for u in imgs):
        q_items.append(it)

print('Total questions with images:', len(q_items))

# Extract question data
questions = []
for i, it in enumerate(q_items, 1):
    # Extract heading text
    heading = it.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], role='heading')
    title = ''
    if heading:
        title = heading.get_text(strip=True)
    
    # Extract image
    imgs = [img.get('src') for img in it.find_all('img') if img.get('src')]
    img_url = None
    for u in imgs:
        if 'forms-images' in u or 'googleusercontent' in u:
            img_url = u
            break
    if not img_url and imgs:
        img_url = imgs[0]
    
    # Extract options (radio buttons with data-value)
    options = []
    radio_labels = it.find_all('label')
    for label in radio_labels:
        input_tag = label.find('input', {'type': 'radio'})
        if input_tag:
            data_value = input_tag.get('data-value', '')
            if data_value:
                options.append({'text': data_value, 'img': ''})
    
    # If no radio buttons, try data-value attributes
    if len(options) < 2:
        data_values = re.findall(r'data-value="([^"]*)"', str(it))
        for dv in data_values:
            if dv:
                options.append({'text': dv, 'img': ''})
    
    # Deduplicate options
    seen = set()
    unique_options = []
    for opt in options:
        if opt['text'] not in seen:
            seen.add(opt['text'])
            unique_options.append(opt)
    
    # Get question number from title
    no = i
    if title:
        m = re.match(r'(\d+)\.\s', title)
        if m:
            no = int(m.group(1))
    
    questions.append({
        'no': no,
        'title': title,
        'img': img_url,
        'options': unique_options[:3]
    })

print('Extracted questions:', len(questions))
for q in questions[:3]:
    print(q)

