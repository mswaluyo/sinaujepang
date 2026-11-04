from bs4 import BeautifulSoup
import re

with open('tools/hare_new_extracted/d1.html', 'r', encoding='utf-8', errors='replace') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

# Check dokkai cards or questions 44-55
cards = soup.find_all(class_=lambda c: c and any(k in str(c).lower() for k in ['card', 'soal-item', 'soal_item', 'question', 'pertanyaan']))
print(f'Total question cards in d1.html: {len(cards)}')

# Look specifically for Part 1 / Part 2 questions (Dokkai 44-55)
dokkai_items = []
for c in cards:
    txt = c.get_text()
    if any(k in txt for k in ['Part 1', 'Part 2', 'laut', 'pemeriksaan gas', 'Tokyo', 'Kyoto', 'kesehatan']):
        dokkai_items.append(c)

print(f'Found {len(dokkai_items)} matching dokkai cards in d1.html')
if dokkai_items:
    with open('tools/sample_dokkai_in_d1.html', 'w', encoding='utf-8') as out:
        out.write(str(dokkai_items[0]))
    print('Saved first dokkai item to tools/sample_dokkai_in_d1.html')

