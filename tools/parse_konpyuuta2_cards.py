from bs4 import BeautifulSoup

with open('tools/konpyuuta2_kunci_utf-8.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

cards = soup.find_all(class_='card')
print(f"Total cards found: {len(cards)}")

with open('tools/konpyuuta2_cards_summary.txt', 'w', encoding='utf-8') as out:
    for i, c in enumerate(cards):
        txt = c.get_text('\n', strip=True)
        imgs = [img['src'] for img in c.find_all('img') if img.get('src')]
        audios = [a['src'] for a in c.find_all('audio') if a.get('src')]
        out.write(f"=== Card #{i+1} ===\n")
        out.write(f"Images: {imgs}\n")
        out.write(f"Audios: {audios}\n")
        out.write(f"Text:\n{txt[:300]}\n\n")

print("Saved summary to tools/konpyuuta2_cards_summary.txt")

