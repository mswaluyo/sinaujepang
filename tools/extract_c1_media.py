import email, os

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

os.makedirs('tools/konpyuuta2_extracted_media', exist_ok=True)

audios = []
images = []
for p in msg.walk():
    ct = p.get_content_type()
    fn = p.get_filename() or p.get('Content-Location', '')
    if 'audio' in ct or any(fn.lower().endswith(ext) for ext in ['.mp3', '.wav', '.m4a', '.ogg']):
        audios.append((fn, ct, len(p.get_payload(decode=True) or b'')))
        payload = p.get_payload(decode=True)
        if payload:
            clean_fn = fn.split('/')[-1] or f"audio_{len(audios)}.mp3"
            with open(f'tools/konpyuuta2_extracted_media/{clean_fn}', 'wb') as out:
                out.write(payload)
    elif 'image' in ct or any(fn.lower().endswith(ext) for ext in ['.jpg', '.png', '.jpeg']):
        images.append((fn, ct, len(p.get_payload(decode=True) or b'')))
        payload = p.get_payload(decode=True)
        if payload and len(payload) > 1000:
            clean_fn = fn.split('/')[-1] or f"img_{len(images)}.png"
            with open(f'tools/konpyuuta2_extracted_media/{clean_fn}', 'wb') as out:
                out.write(payload)

print(f"Extracted {len(audios)} audio parts, {len(images)} image parts from c1.mhtml")
for a in audios:
    print(" Audio:", a)
for img in images[:10]:
    print(" Image:", img)

