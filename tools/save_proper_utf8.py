import email

with open('_arsip/konpyuuta2/kunci.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    if p.get_content_type() == 'text/html':
        payload = p.get_payload(decode=True)
        html_str = payload.decode('utf-8', errors='replace')
        with open('tools/konpyuuta2_kunci_proper_utf8.html', 'w', encoding='utf-8') as out:
            out.write(html_str)
        print("Successfully saved tools/konpyuuta2_kunci_proper_utf8.html with proper UTF-8!")
        break

