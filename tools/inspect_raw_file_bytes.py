with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    raw = f.read()

idx = raw.find(b'(Papan)')
print("100 bytes before (Papan):")
print(raw[idx-100:idx])

