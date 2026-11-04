import email, re

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    if p.get_content_type() == 'text/html':
        payload = p.get_payload(decode=True)
        # Search for Japanese text near konpyuuta
        print("Search for konpyuuta in raw bytes:")
        idx = payload.find(b'konpyuuta.jpg')
        if idx != -1:
            snippet = payload[idx-200:idx+600]
            print("Snippet around konpyuuta.jpg:")
            print(snippet)
            # Try to see if it's UTF-8 encoded
            for enc in ['utf-8', 'latin1', 'cp1252', 'shift_jis', 'cp932']:
                try:
                    s_dec = snippet.decode(enc)
                    print(f"Decoded with {enc}:")
                    print(s_dec)
                    break
                except Exception as e:
                    pass
        break

