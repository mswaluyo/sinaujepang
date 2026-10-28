import json, os

FQ = r"d:\soal-jft\tools\form_questions.json"
QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"

fq_raw = json.load(open(FQ, encoding='utf-8'))
fq = [q for q in fq_raw if not (isinstance(q.get('text'),str) and q['text'].strip().lower().startswith('sesi'))]

qd = json.load(open(QD, encoding='utf-8')) if os.path.exists(QD) else []
if not isinstance(qd, list):
    qd = []

filled = []
for q in qd:
    no = q.get('no')
    if isinstance(no,int) and 1 <= no <= len(fq):
        src = fq[no-1]
        if src.get('img'):
            q['img'] = src['img']
            filled.append(no)
        if src.get('audio_url'):
            q['audio_url'] = src['audio_url']
        if 'audio_url' not in q:
            q['audio_url'] = None
    for prop in ['no','section','title','img','audio_url','options','answer','score','kunci_id']:
        if prop not in q:
            q[prop] = None if prop != 'options' else []

json.dump(qd, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('filled img for soal:', filled)
print('total soal in quiz-data:', len(qd))
print('form questions (after skip):', len(fq))
