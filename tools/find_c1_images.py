import re, quopri

with open(r'D:\soal-jft\_arsip\Magarimasu2\c1.mhtml', 'rb') as f:
    raw = f.read()

decoded = quopri.decodestring(raw).decode('utf-8', errors='ignore')

# find all img tags with src
img_tags = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', decoded)
print(f"Total img tags in c1.mhtml: {len(img_tags)}")
for img in set(img_tags):
    print("Img src:", img)
