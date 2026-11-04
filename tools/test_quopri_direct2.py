import quopri

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    raw = f.read()

decoded = quopri.decodestring(raw)
idx = decoded.find(b'(Papan)')
p_text = decoded[idx-150:idx]
print(p_text)
print("Decoded as utf-8:")
print(p_text.decode('utf-8'))

