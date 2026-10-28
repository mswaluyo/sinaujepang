import json
p='d:\\soal-jft\\public\\basu3-quiz\\quiz-data.json'
d=json.load(open(p,encoding='utf-8'))
for no in [19,20,21]:
    if no-1 < len(d):
        d[no-1]['img']=f'/basu3-quiz/images/soal_{no}.jpg'
# ensure props
req=['no','section','title','img','audio_url','options','answer','score','kunci_id']
ok=True
for q in d:
    for r in req:
        if r not in q: ok=False; print('missing',q.get('no'),r)
    if not isinstance(q.get('options'),list) or len(q['options'])!=3:
        ok=False; print('bad options',q.get('no'),len(q.get('options',[])))
json.dump(d,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print('total soal:',len(d))
print('all valid:',ok)
print('with img:',sum(1 for q in d if q.get('img')))
