import re, json, os
from bs4 import BeautifulSoup

MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
OUT = r"d:\soal-jft\tools\form_questions.json"

raw = open(MHTML, 'rb').read().decode('utf-8', errors='ignore')
m = re.search(r'boundary="([^"]+)"', raw)
boundary = m.group(1)
parts = raw.split('--'+boundary)
html = ''
for p in parts:
    if '<!DOCTYPE' in p or '<html' in p:
        he = p.find('\n\n')
        body = p[he+2:] if he>0 else p
        body = re.sub(r'=\r?\n', '', body)
        body = re.sub(r'=([0-9A-F]{2})', lambda x: chr(int(x.group(1),16)), body)
        html += body

soup = BeautifulSoup(html, 'html.parser')
items = soup.find_all(attrs={'role':'listitem'})

q_items = []
for it in items:
    imgs = [img.get('src') for img in it.find_all('img') if img.get('src')]
    if any('forms-images' in u or 'googleusercontent' in u for u in imgs) or it.get_text(strip=True):
        q_items.append(it)

questions = []
for i, it in enumerate(q_items, 1):
    imgs = [img.get('src') for img in it.find_all('img') if img.get('src')]
    img_url = next((u for u in imgs if 'forms-images' in u or 'googleusercontent' in u), (imgs[0] if imgs else None))
    auds = []
    for a in it.find_all('a'):
        href = a.get('href')
        if href and ('drive.google' in href or 'docs.google' in href):
            auds.append(href)
    audio_url = auds[0] if auds else None
    text = it.get_text(' ', strip=True)
    questions.append({'no': i, 'text': text[:200], 'img': img_url, 'audio_url': audio_url})

json.dump(questions, open(OUT,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('total items:', len(items), 'questions:', len(questions))
for q in questions[:3]:
    print(q['no'], repr(q['text'][:60]), q['img'])
