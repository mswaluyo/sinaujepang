import re, json, os
from bs4 import BeautifulSoup

MHTML = r"d:\soal-jft\_arsip\basu_tes\BASU (OKTOBER-NOVEMBER).mhtml"
JSONF = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"

# Read MHTML, extract HTML part
raw = open(MHTML, 'rb').read().decode('utf-8', errors='ignore')
# find boundary
m = re.search(r'boundary="([^"]+)"', raw)
boundary = m.group(1)
parts = raw.split('--'+boundary)
html = ''
for p in parts:
    if '<!DOCTYPE' in p or '<html' in p:
        he = p.find('\n\n')
        body = p[he+2:] if he>0 else p
        # quoted-printable decode
        body = re.sub(r'=\r?\n', '', body)
        body = re.sub(r'=([0-9A-F]{2})', lambda x: chr(int(x.group(1),16)), body)
        html += body

soup = BeautifulSoup(html, 'html.parser')
# find question containers
items = soup.find_all(attrs={'role':'listitem'})
print('items', len(items))

# parse
questions = []
for i, it in enumerate(items, 1):
    imgs = [img.get('src') for img in it.find_all('img') if img.get('src')]
    auds = []
    for a in it.find_all('a'):
        href = a.get('href')
        if href and ('drive.google' in href or 'docs.google' in href):
            auds.append(href)
    # google forms images
    img_url = next((u for u in imgs if 'forms-images' in u or 'googleusercontent' in u), (imgs[0] if imgs else None))
    audio_url = auds[0] if auds else None
    questions.append({'no': i, 'img': img_url, 'audio_url': audio_url})

# update json if exists
if os.path.exists(JSONF):
    data = json.load(open(JSONF, encoding='utf-8'))
    # map by index
    for idx, q in enumerate(data):
        if idx < len(questions):
            q['img'] = questions[idx]['img'] or q.get('img')
            q['audio_url'] = questions[idx]['audio_url']
    json.dump(data, open(JSONF,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
    print('updated json')

print('summary:')
for q in questions[:10]:
    print(q['no'], q['img'], q['audio_url'])
print('total', len(questions))
