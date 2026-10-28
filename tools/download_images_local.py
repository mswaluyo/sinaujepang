import json, os, urllib.request

QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"
IMGDIR = r"d:\soal-jft\public\basu3-quiz\images"
os.makedirs(IMGDIR, exist_ok=True)

data = json.load(open(QD, encoding='utf-8'))
count = 0
for q in data:
    no = q.get('no')
    url = q.get('img')
    if isinstance(url, str) and url.startswith('http'):
        fname = f"soal_{no}.jpg"
        fpath = os.path.join(IMGDIR, fname)
        try:
            urllib.request.urlretrieve(url, fpath)
            q['img'] = f"/basu3-quiz/images/{fname}"
            count += 1
            print('downloaded', no, fname)
        except Exception as e:
            print('fail', no, e)
json.dump(data, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('total downloaded:', count)
