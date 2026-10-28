import json, os

FQ = r"d:\soal-jft\tools\form_questions.json"
QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"

fq = json.load(open(FQ, encoding='utf-8'))
qd = json.load(open(QD, encoding='utf-8')) if os.path.exists(QD) else []

# ensure qd is list
if not isinstance(qd, list):
    qd = []

# index form questions by no
fq_by_no = {q.get('no'): q for q in fq}

filled = []
for q in qd:
    no = q.get('no')
    src = fq_by_no.get(no)
    if src:
        if src.get('img'):
            q['img'] = src['img']
            filled.append(no)
        if src.get('audio_url'):
            q['audio_url'] = src['audio_url']
        if 'audio_url' not in q:
            q['audio_url'] = None
# ensure properties
for q in qd:
    for prop in ['no','section','title','img','audio_url','options','answer','score','kunci_id']:
        if prop not in q:
            q[prop] = None if prop not in ('options',) else []

json.dump(qd, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('merged. filled img for soal:', filled)
print('total soal in quiz-data:', len(qd))
