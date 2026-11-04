from bs4 import BeautifulSoup

with open('tools/konpyuuta2_kunci_clean.html', 'r', encoding='utf-8', errors='replace') as f:
    soup = BeautifulSoup(f, 'html.parser')

cards = soup.find_all(class_='review-soal-card')
c26 = cards[25] # Card 26 (first Choukai)

box = c26.find(class_='audio-box')
print("audio-box parent HTML:")
print(box.prettify() if box else "No audio-box")

# Also check scripts in the page
scripts = soup.find_all('script')
print(f"Total scripts in kunci: {len(scripts)}")
for s in scripts:
    txt = s.get_text()
    if 'audio' in txt or '.mp3' in txt or 'play' in txt:
        print("Script snippet:", txt[:200])

