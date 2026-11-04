import email, quopri
from bs4 import BeautifulSoup

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    if p.get_content_type() == 'text/html':
        payload = p.get_payload(decode=True)
        soup = BeautifulSoup(payload.decode('utf-8', errors='replace'), 'html.parser')
        cards = soup.find_all(class_='soal-card')
        print(f"Cards found in c1: {len(cards)}")
        with open('tools/c1_sample_5.txt', 'w', encoding='utf-8') as out:
            for i, c in enumerate(cards[:5]):
                no = c.get('data-nomor') or i+1
                q = c.find(class_='soal-pertanyaan')
                opts = [o.get_text(' ', strip=True) for o in c.find_all(class_='pilihan-item')]
                img = c.find('img')
                out.write(f"#{i+1} No: {no}\n")
                out.write(f"Img: {img['src'] if img else 'none'}\n")
                out.write(f"Pertanyaan: {q.get_text(strip=True) if q else ''}\n")
                out.write(f"Options: {opts}\n\n")
        print("Wrote c1_sample_5.txt")
        break

