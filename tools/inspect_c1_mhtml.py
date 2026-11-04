with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    raw = f.read(5000)

print("First 2000 bytes of c1.mhtml:")
print(raw[:2000].decode('utf-8', errors='replace'))

