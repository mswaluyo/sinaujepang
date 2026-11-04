import quopri

with open('_arsip/konpyuuta2/kunci.mhtml', 'rb') as f:
    raw = f.read()

# Separate boundary parts
boundary = b"----MultipartBoundary--N9SCleM3al5znyLmtL01AMf0yN4Xt0xGbhSpS8Kfw5----"
parts = raw.split(boundary)

print("Found parts count:", len(parts))

for idx, p in enumerate(parts):
    if b"Content-Type: text/html" in p:
        header_end = p.find(b"\r\n\r\n")
        headers = p[:header_end]
        body = p[header_end+4:]
        
        # Decode quoted printable
        decoded = quopri.decodestring(body)
        
        # Save as UTF-8
        with open('tools/konpyuuta2_kunci_clean.html', 'wb') as out:
            out.write(decoded)
            
        print("Clean HTML decoded and saved! Bytes length:", len(decoded))
        
        # Check Japanese text preview
        txt = decoded.decode('utf-8', errors='replace')
        print("Preview text around Japanese:")
        for line in txt.splitlines()[:50]:
            if any(k in line for k in ['コンピュータ', 'かぎ', '結婚', 'konpyuutaa']):
                print("Line:", line.strip()[:100])
        break

