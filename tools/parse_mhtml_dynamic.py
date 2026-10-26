import re, json
from bs4 import BeautifulSoup

MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
OUT = r"d:\soal-jft\tools\form_questions_dynamic.json"

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

def is_question_container(it):
    text = it.get_text(' ', strip=True)
    if not text:
        return False
    if text.lower().startswith('sesi'):
        return False
    has_radio = bool(it.find_all(attrs={'role':'radio'})) or bool(it.find_all('input', type='radio'))
    has_options_text = len(it.find_all('div', class_=lambda c: c and 'docssharedWizToggle' in c))>0
    return has_radio or has_options_text

def extract_no(text):
    m = re.match(r'^\s*(\d{1,2})\s*[\.、．]\s*', text)
    if m:
        return int(m.group(1))
    m = re.match(r'^\s*(\d{1,2})\s+', text)
    if m:
        return int(m.group(1))
    return None

questions = []
for it in items:
    if not is_question_container(it):
        continue
    imgs = [img.get('src') for img in it.find_all('img') if img.get('src')]
    # strict: only direct children-ish images inside this container; exclude banners/UI icons
    imgs = [u for u in imgs if 'forms-images' in u or 'googleusercontent' in u]
    imgs = [u for u in imgs if 'w1983' not in u and 'logo_forms' not in u]
    img_url = imgs[0] if imgs else None
    auds = [a.get('href') for a in it.find_all('a') if a.get('href') and ('drive.google' in a.get('href') or 'docs.google' in a.get('href'))]
    audio_url = auds[0] if auds else None
    text = it.get_text(' ', strip=True)
    no = extract_no(text)
    questions.append({'no': no, 'text': text[:120], 'img': img_url, 'audio_url': audio_url})

questions.sort(key=lambda q: (q['no'] is None, q['no'] if q['no'] is not None else 999))

counter = 1
for q in questions:
    if q['no'] is None:
        while any(x['no']==counter for x in questions):
            counter += 1
        q['no'] = counter
        counter += 1

json.dump(questions, open(OUT,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('total question containers:', len(questions))
with_img = sum(1 for q in questions if q['img'])
with_audio = sum(1 for q in questions if q['audio_url'])
print('with img:', with_img, 'with audio:', with_audio)
for q in questions:
    print(q['no'], '|', q['text'][:60], '| img:', q['img'] is not None, '| audio:', q['audio_url'] is not None)