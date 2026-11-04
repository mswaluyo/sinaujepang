import re, quopri, json

with open(r'D:\soal-jft\_arsip\Magarimasu2\c1.mhtml', 'rb') as f:
    raw = f.read()

decoded = quopri.decodestring(raw).decode('utf-8', errors='ignore')
audio_srcs = set(re.findall(r'uploads/audio/[a-zA-Z0-9_\-\.]+\.wav', decoded))
print("All audio srcs found in c1.mhtml:")
for a in sorted(audio_srcs):
    print(a)
