import email
import re

with open(r'_arsip\SHIMEMASU2\kunci.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        raw = part.get_payload(decode=True)
        text = raw.decode('utf-8', errors='replace')
        cards = text.split('<div class="review-soal-card">')
        # Sesi hyougen adalah kartu ke-14 sampai 28 (indeks 14..28)
        for idx in range(14, 29):
            c = cards[idx]
            num_m = re.search(r'<div class="review-nomor"[^>]*>#(.*?)</div>', c)
            num = num_m.group(1) if num_m else str(idx)
            imgs = re.findall(r'<img[^>]+src="([^">]+)"', c)
            q_m = re.search(r'<div class="review-pertanyaan"[^>]*>([\s\S]*?)</div>', c)
            q_text = q_m.group(1).replace('\n', ' ').strip() if q_m else ''
            print(f"Card {idx} (Nomor #{num}): imgs={imgs}, Q={q_text[:80]}")
        break

