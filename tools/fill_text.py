import json
FQ = r"d:\soal-jft\tools\form_questions_dynamic.json"
QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"
fq = json.load(open(FQ, encoding='utf-8'))
qd = json.load(open(QD, encoding='utf-8'))
for q in qd:
    no = q.get('no')
    if isinstance(no,int) and 1 <= no <= len(fq):
        src = fq[no-1]
        txt = src.get('text','')
        q['title'] = txt[:80]
        # keep img
        if src.get('img'):
            q['img'] = src['img']
json.dump(qd, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('updated titles for', len(qd), 'soal; img preserved')
# count img
print('with img:', sum(1 for q in qd if q.get('img')))
