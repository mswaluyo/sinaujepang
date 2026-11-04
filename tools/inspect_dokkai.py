from bs4 import BeautifulSoup

with open('tools/c1_decoded_utf8.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

cards = soup.find_all(class_='soal-card')
print(f"Total cards in c1: {len(cards)}")

# Check cards 38 to 51 (Dokkai)
with open('tools/konpyuuta2_dokkai_overview.txt', 'w', encoding='utf-8') as out:
    for i in range(37, len(cards)):
        c = cards[i]
        no = c.get('data-nomor') or i+1
        q = c.find(class_='soal-pertanyaan')
        q_txt = q.get_text(strip=True) if q else ''
        imgs = [img['src'] for img in c.find_all('img') if img.get('src')]
        konteks = c.find(class_='soal-konteks')
        konteks_txt = konteks.get_text(' ', strip=True) if konteks else ''
        opts = [o.get_text(' ', strip=True) for o in c.find_all(class_='pilihan-item')]
        out.write(f"#{i+1} (No {no}) | Imgs: {imgs}\n")
        out.write(f"Konteks: {konteks_txt[:200]}\n")
        out.write(f"Pertanyaan: {q_txt}\n")
        out.write(f"Options: {opts}\n")
        out.write("-" * 40 + "\n")

print("Saved dokkai overview to tools/konpyuuta2_dokkai_overview.txt")

