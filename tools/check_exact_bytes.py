with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    raw = f.read()

idx = raw.find(b'(Papan)')
print("200 BYTES BEFORE:")
print(raw[idx-200:idx])
