import json, os

FQ = r"d:\soal-jft\tools\form_questions_aria.json"
QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"

fq = json.load(open(FQ, encoding='utf-8'))
qd = json.load(open(QD, encoding='utf-8')) if os.path.exists(QD) else []

filled_opts = 0
for q in qd:
    no = q.get('no')
    if isinstance(no,int) and 1 <= no <= len(fq):
        src = fq[no-1]
        if src.get('options'):
            q['options'] = [{'text': t, 'img': ''} for t in src['options']]
            filled_opts += 1
        if src.get('score'):
            q['score'] = src['score']
        if src.get('kunci_id'):
            q['kunci_id'] = src['kunci_id']
        # preserve img
        # (already in q)
        for prop in ['no','section','title','img','audio_url','options','answer','score','kunci_id']:
            if prop not in q:
                q[prop] = None if prop != 'options' else []

json.dump(qd, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('updated options for', filled_opts, 'soal')
print('total soal:', len(qd))
print('with img:', sum(1 for q in qd if q.get('img')))
