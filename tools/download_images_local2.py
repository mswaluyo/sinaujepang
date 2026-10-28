import json, os, urllib.request, re, base64

QD = r"d:\soal-jft\public\basu3-quiz\quiz-data.json"
IMGDIR = r"d:\soal-jft\public\basu3-quiz\images"
MHTML = r"d:\soal-jft\_arsip\basu2\basu_sesi\1_BASU (OKTOBER-NOVEMBER).mhtml"
os.makedirs(IMGDIR, exist_ok=True)

data = json.load(open(QD, encoding='utf-8'))

mhtml_images = []
try:
    raw = open(MHTML, 'rb').read().decode('utf-8', errors='ignore')
    m = re.search(r'boundary="([^"]+)"', raw)
    parts = raw.split('--'+m.group(1))
    for p in parts:
        ct = re.search(r'Content-Type:\s*([^\r\n]+)', p)
        if ct and 'image/' in ct.group(1):
            he = p.find('\n\n')
            body = p[he+2:].strip() if he>0 else p.strip()
            b64 = ''.join(body.split())
            try:
                bin_ = base64.b64decode(b64)
                mhtml_images.append(bin_)
            except Exception:
                pass
except Exception as e:
    print('mhtml parse err', e)

HDR = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36', 'Referer':'https://docs.google.com/forms/'}

mi = 0
count = 0
for q in data:
    no = q.get('no')
    url = q.get('img')
    if isinstance(url, str) and url.startswith('http'):
        fpath = os.path.join(IMGDIR, f"soal_{no}.jpg")
        ok = False
        try:
            req = urllib.request.Request(url, headers=HDR)
            with urllib.request.urlopen(req, timeout=30) as r:
                open(fpath,'wb').write(r.read())
            ok = True
        except Exception as e:
            if mi < len(mhtml_images):
                open(fpath,'wb').write(mhtml_images[mi])
                mi += 1
                ok = True
            else:
                print('fail', no, e)
        if ok:
            q['img'] = f"/basu3-quiz/images/soal_{no}.jpg"
            count += 1
            print('saved', no)

json.dump(data, open(QD,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('total saved:', count, 'mhtml imgs:', len(mhtml_images))
