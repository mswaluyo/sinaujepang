import json
p='d:\\soal-jft\\public\\basu3-quiz\\quiz-data.json'
d=json.load(open(p,encoding='utf-8'))
for q in d:
    if len(q.get('options',[]))<3:
        q['options'] += [{'text':'', 'img':''}]*(3-len(q['options']))
json.dump(d,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print('done')
