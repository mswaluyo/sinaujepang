import os, re

raw = open(r'D:\soal-jft\_arsip\Magarimasu2\c1.mhtml', 'rb').read().decode('latin1', errors='ignore')
matches = set(re.findall(r'https?://[^\s"\'<>]+\.wav', raw))
print("Found audio URLs:")
for m in sorted(matches):
    print(m)
