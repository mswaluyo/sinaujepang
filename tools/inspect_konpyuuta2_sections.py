from bs4 import BeautifulSoup

with open('tools/konpyuuta2_kunci_utf-8.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

cards = soup.find_all(class_='review-soal-card')
print(f"Total review-soal-card found: {len(cards)}")

# Check sections
secs = soup.find_all(class_='review-section')
print(f"Total review-section found: {len(secs)}")

with open('tools/konpyuuta2_sections_overview.txt', 'w', encoding='utf-8') as out:
    for s in secs:
        title = s.find(class_='review-section-title')
        stitle = title.get_text(strip=True) if title else "NO TITLE"
        s_cards = s.find_all(class_='review-soal-card')
        out.write(f"\n====================\nSECTION: {stitle} (Total cards: {len(s_cards)})\n====================\n")
        for sc in s_cards:
            no = sc.find(class_='review-nomor')
            sno = no.get_text(strip=True) if no else "?"
            q_txt = sc.find(class_='review-pertanyaan')
            sq_txt = q_txt.get_text(strip=True) if q_txt else ""
            kunci = sc.find(class_='review-key-benar')
            skunci = kunci.get_text(strip=True) if kunci else ""
            penjelasan = sc.find(class_='review-penjelasan')
            spenjelasan = penjelasan.get_text(strip=True) if penjelasan else ""
            imgs = [img['src'] for img in sc.find_all('img') if img.get('src')]
            audios = [a['src'] for a in sc.find_all('audio') if a.get('src')]
            
            # Options
            opts = []
            for item in sc.find_all(class_='review-jawaban-item'):
                opts.append(item.get_text(' ', strip=True))
                
            out.write(f"No: {sno} | Kunci: {skunci}\n")
            out.write(f"Pertanyaan: {sq_txt}\n")
            out.write(f"Options: {opts}\n")
            out.write(f"Images: {imgs} | Audios: {audios}\n")
            out.write(f"Penjelasan: {spenjelasan[:150]}\n")
            out.write("-" * 40 + "\n")

print("Saved sections overview to tools/konpyuuta2_sections_overview.txt")

