from bs4 import BeautifulSoup

with open('tools/hare_new_extracted/d1.html', 'r', encoding='utf-8', errors='replace') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

cards = soup.find_all(class_='soal-card')
print('Total soal-card in d1.html:', len(cards))

for i, card in enumerate(cards):
    txt = card.get_text()
    if '37' in txt or 'さいふ' in txt or 'Kenapa cewe' in txt:
        with open(f'tools/sample_choukai_{i+1}.html', 'w', encoding='utf-8') as out:
            out.write(str(card))
        print(f'Saved card {i+1} to tools/sample_choukai_{i+1}.html')
        break

