import email

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    if p.get_content_type() == 'text/html':
        payload = p.get_payload(decode=True)
        idx = payload.find(b'pil-1460-A')
        print("Raw hex bytes for pilihan-text:")
        sub = payload[idx+80:idx+150]
        print(sub)
        print("Hex:", sub.hex())
        break

