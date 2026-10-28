import re, json
from bs4 import BeautifulSoup

MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
OUT = r"d:\soal-jft\tools\form_questions_aria.json"

raw = open(MHTML, 'rb').read().decode('utf-8', errors='ignore')
m = re.search(r'boundary="([^"]+)"', raw)
parts = raw.split('--'+m.group(1))
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

def is_q(it):
    t = it.get_text(' ', strip=True)
    if not t or t.lower().startswith('sesi'): return False
    return True

questions = []
for it in items:
    if not is_q(it): continue
    imgs = [img.get('src') for img in it.find_all('img') if img.get('src')]
    img_url = next((u for u in imgs if 'forms-images' in u or 'googleusercontent' in u), None)
    # options
    opts = []
    for el in it.find_all(attrs={'role':'radio'}):
        txt = el.get('aria-label') or el.get('data-value') or el.get_text(' ', strip=True)
        if txt: opts.append(txt)
    for el in it.find_all(attrs={'data-value': True}):
        v = el.get('data-value')
        if v and v not in opts: opts.append(v)
    # score
    score = None
    msc = re.search(r'\d+/\d+', it.get_text(' ', strip=True))
    if msc: score = msc.group(0)
    # kunci: element with check icon? fallback None
    kunci = None
    questions.append({'no': len(questions)+1, 'text': it.get_text(' ', strip=True)[:120], 'img': img_url, 'audio_url': None, 'options': opts, 'answer': 0, 'score': score, 'kunci_id': kunci})

json.dump(questions, open(OUT,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('questions:', len(questions))
for q in questions[:3]:
    print(q['no'], 'opts=', len(q['options']), 'score=', q['score'], q['options'][:2])
