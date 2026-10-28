import json
fq = json.load(open(r'd:\soal-jft\tools\form_questions_dynamic.json',encoding='utf-8'))
out=[]
for q in fq:
    out.append({
        "no": q['no'],
        "section": "SESI 1 : MOJIGOI",
        "title": "",
        "img": q.get('img'),
        "audio_url": q.get('audio_url'),
        "options": [],
        "answer": 0,
        "score": "0/4",
        "trans": "",
        "trans_rom": "-",
        "mnn": "Mojigoi",
        "analisis": "",
        "opt_detail": [],
        "opt_note": [],
        "kunci_id": ""
    })
json.dump(out, open(r'd:\soal-jft\public\basu3-quiz\quiz-data.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('created', len(out))
