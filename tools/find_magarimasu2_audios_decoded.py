import os, re, quopri

with open(r'D:\soal-jft\_arsip\Magarimasu2\c1.mhtml', 'rb') as f:
    raw = f.read()

decoded = quopri.decodestring(raw).decode('utf-8', errors='ignore')
matches = set(re.findall(r'asan[0-9]\.wav', decoded))
print("Matched asan wavs:", matches)

# Find context around asan
for m in re.finditer(r'asan[0-9]\.wav', decoded):
    start = max(0, m.start() - 100)
    end = min(len(decoded), m.end() + 100)
    print("--- snippet ---")
    print(decoded[start:end])
    break

