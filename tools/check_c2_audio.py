import email

with open('_arsip/konpyuuta2/c2.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    fn = p.get_filename() or p.get('Content-Location', '')
    ct = p.get_content_type()
    if 'audio' in ct or any(fn.lower().endswith(ext) for ext in ['.mp3', '.wav', '.m4a']):
        print("Found audio in c2:", fn, ct, len(p.get_payload(decode=True) or b''))

