import email, re, json
from bs4 import BeautifulSoup

MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
OUT = r"d:\soal-jft\tools\form_questions_dynamic.json"

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

def clean(t):
    t = fix_enc(t)
    t = re.sub(r'\d+\s*poin', '', t)
    t = re.sub(r'Opsi\s*\d+', '', t)
    t = re.sub(r'Batalkan pilihan|Hapus jawaban', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

questions = []
for it in items:
    txt = it.get_text(' ', strip=True)
    if not txt or txt.lower().startswith('sesi'):
        continue
    questions.append({'no': len(questions)+1, 'text': clean(txt)[:200]})

json.dump(questions, open(OUT,'w',encoding='utf-8'), ensure_ascii=False, indent=2)

# update quiz-data titles
QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"
qd = json.load(open(QD, encoding='utf-8'))
for q in qd:
    no = q.get('no')
    if 1 <= no <= len(questions):
        q['title'] = questions[no-1]['text']
json.dump(qd, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)

for q in qd[:5]:
    print(q['no'], q['title'])
