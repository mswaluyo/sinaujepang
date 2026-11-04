import json
from bs4 import BeautifulSoup

with open('tools/magarimasu2_kunci_clean.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

cards = soup.find_all('div', class_='review-soal-card')
overview = []
for i, c in enumerate(cards):
    pert = c.find('div', class_='review-pertanyaan')
    pert_text = pert.get_text(separator=' ', strip=True) if pert else ''
    kunci = c.find('div', class_='review-jawaban')
    kunci_text = kunci.get_text(separator=' ', strip=True) if kunci else ''
    imgs = [img['src'] for img in c.find_all('img') if img.get('src')]
    overview.append({
        'no': i + 1,
        'pert': pert_text,
        'kunci': kunci_text,
        'imgs': imgs
    })

with open('tools/magarimasu2_cards_overview.json', 'w', encoding='utf-8') as f:
    json.dump(overview, f, ensure_ascii=False, indent=2)

print(f"Dumped {len(overview)} cards overview.")
