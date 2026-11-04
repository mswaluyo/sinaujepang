import email

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    if p.get_content_type() == 'text/html':
        payload = p.get_payload(decode=True)
        idx = payload.find(b'pil-1460-A')
        with open('tools/pil_test.txt', 'w', encoding='utf-8') as out:
            out.write(payload[idx:idx+350].decode('utf-8'))
        print("Wrote pil_test.txt")
        break
