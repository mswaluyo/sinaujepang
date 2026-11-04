import re
from bs4 import BeautifulSoup

with open('tools/magarimasu2_kunci_clean.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

cards = soup.find_all('div', class_='review-soal-card')
print('Total cards in kunci clean:', len(cards))

for i, c in enumerate(cards):
    pert = c.find('div', class_='review-pertanyaan')
    pert_text = pert.get_text(separator=' ', strip=True) if pert else ''
    kunci = c.find('div', class_='review-jawaban')
    kunci_text = kunci.get_text(separator=' ', strip=True) if kunci else ''
    imgs = [img['src'] for img in c.find_all('img') if img.get('src')]
    if i < 15 or i > 40:
        print(f"Card #{i+1}: pert='{pert_text[:50]}' | kunci='{kunci_text[:30]}' | imgs={imgs}")

