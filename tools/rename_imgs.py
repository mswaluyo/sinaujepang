import json, os
IMGDIR = r"d:\soal-jft\public\basu3-quiz\images"
QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"
data = json.load(open(QD, encoding='utf-8'))
for q in data:
    no = q.get('no')
    old = os.path.join(IMGDIR, f"soal_{no}.jpg")
    new = os.path.join(IMGDIR, f"basu3_{no:02d}.jpg")
    if os.path.exists(old):
        os.rename(old, new)
    q['img'] = f"/basu3-quiz/images/basu3_{no:02d}.jpg"
json.dump(data, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('done')
for q in data[:3]+data[-2:]:
    print(q['no'], q['img'])
