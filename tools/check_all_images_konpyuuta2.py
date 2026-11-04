import email, os

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    ct = p.get_content_type()
    loc = p.get('Content-Location', '')
    if 'image' in ct and loc:
        payload = p.get_payload(decode=True)
        fn = loc.split('/')[-1]
        print(f"Image: {fn} ({len(payload)} bytes)")

print("Checking files in _arsip/konpyuuta2:")
for f in os.listdir('_arsip/konpyuuta2'):
    if any(f.lower().endswith(ext) for ext in ['.jpg', '.png', '.jpeg']):
        size = os.path.getsize(os.path.join('_arsip/konpyuuta2', f))
        print(f" File: {f} ({size} bytes)")

