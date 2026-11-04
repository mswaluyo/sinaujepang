import email

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    if p.get_content_type() == 'text/html':
        payload = p.get_payload(decode=True)
        # Search for "(Papan)"
        idx = payload.find(b'(Papan)')
        if idx != -1:
            snippet = payload[idx-100:idx+200]
            print("Raw bytes around (Papan):")
            print(snippet)
            # What are the raw bytes before (Papan)?
            p_idx = snippet.find(b'pilihan-text')
            print("Bytes of pilihan-text:", snippet[p_idx:p_idx+80])
        break

