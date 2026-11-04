import quopri

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    raw = f.read()

# Let's decode the raw file with quopri directly!
decoded = quopri.decodestring(raw)
idx = decoded.find(b'(Papan)')
print("50 bytes before (Papan) in quopri-decoded:")
p_text = decoded[idx-70:idx]
print(p_text)
print("Decoded as utf-8:", p_text.decode('utf-8', errors='replace'))

