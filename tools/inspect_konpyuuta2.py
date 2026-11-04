import os, re, email

kpath = '_arsip/konpyuuta2/kunci.mhtml'
with open(kpath, 'rb') as f:
    msg = email.message_from_binary_file(f)

print('Subject/Type:', msg.get_content_type())
parts = list(msg.walk())
print('Total parts:', len(parts))

html_content = ""
for p in parts:
    ct = p.get_content_type()
    if ct == 'text/html':
        payload = p.get_payload(decode=True)
        html_content = payload.decode('utf-8', errors='replace')
        break

print('HTML length:', len(html_content))
with open('tools/konpyuuta2_kunci.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Inspect how many cards / questions
cards = re.findall(r'id=["\']card-(\d+)["\']', html_content)
print('Found card IDs:', len(cards), cards[:10], cards[-5:] if cards else [])

