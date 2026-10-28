import email, re, json
from bs4 import BeautifulSoup

MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"

with open(MHTML, 'rb') as f:
    msg = email.message_from_binary_file(f)

html = None
for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html = part.get_payload(decode=True).decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, 'html.parser')
items = soup.find_all(attrs={'role':'listitem'})

def fix_enc(t):
    try:
        return t.encode('latin1').decode('utf-8')
    except Exception:
        return t

def clean_opt(t):
    t = fix_enc(t)
    t = re.sub(r'^[A-D]\.\s*', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

qd = json.load(open(QD, encoding='utf-8'))
qno = 0
for it in items:
    txt = it.get_text('', strip=True)
    if not txt or txt.lower().startswith('sesi'):
        continue
    qno += 1
    opts = []
    for el in it.find_all(attrs={'role':'radio'}):
        t = el.get('aria-label') or el.get('data-value') or el.get_text('', strip=True)
        if t:
            opts.append(clean_opt(t))
    # dedup
    seen=set(); uniq=[]
    for o in opts:
        if o not in seen:
            seen.add(o); uniq.append(o)
    if 1 <= qno <= len(qd):
        qd[qno-1]['options'] = [{'text': o, 'img': ''} for o in uniq]

json.dump(qd, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)

for q in qd[:5]:
    print(q['no'], [o['text'] for o in q['options']])
