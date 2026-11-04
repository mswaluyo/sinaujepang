from bs4 import BeautifulSoup

with open('tools/konpyuuta2_kunci_clean.html', 'r', encoding='utf-8', errors='replace') as f:
    soup = BeautifulSoup(f, 'html.parser')

cards = soup.find_all(class_='review-soal-card')
print(f"Cards found in clean HTML: {len(cards)}")

with open('tools/konpyuuta2_preview_clean.txt', 'w', encoding='utf-8') as out:
    for i, c in enumerate(cards[:5]):
        no = c.find(class_='review-nomor')
        q = c.find(class_='review-pertanyaan')
        k = c.find(class_='review-key-benar')
        p = c.find(class_='review-penjelasan')
        opts = [item.get_text(' ', strip=True) for item in c.find_all(class_='review-jawaban-item')]
        out.write(f"#{i+1} No: {no.get_text(strip=True) if no else '?'}\n")
        out.write(f"Pertanyaan: {q.get_text(strip=True) if q else ''}\n")
        out.write(f"Options: {opts}\n")
        out.write(f"Kunci: {k.get_text(strip=True) if k else ''}\n")
        out.write(f"Penjelasan: {p.get_text(strip=True) if p else ''}\n\n")

print("Preview saved to tools/konpyuuta2_preview_clean.txt")

