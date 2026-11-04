import re, quopri

with open(r'D:\soal-jft\_arsip\Magarimasu2\c1.mhtml', 'rb') as f:
    raw = f.read()

decoded = quopri.decodestring(raw).decode('utf-8', errors='ignore')

for m in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', decoded):
    src = m.group(1).split('/')[-1]
    pos = m.start()
    snippet_before = decoded[max(0, pos-400):pos]
    snippet_after = decoded[pos:min(len(decoded), pos+400)]
    print(f"=== Image: {src} ===")
    clean_before = snippet_before[-200:].encode('ascii', errors='replace').decode('ascii')
    clean_after = snippet_after[:200].encode('ascii', errors='replace').decode('ascii')
    print("BEFORE:", clean_before)
    print("AFTER:", clean_after)
