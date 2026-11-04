from bs4 import BeautifulSoup

with open('tools/konpyuuta2_kunci_clean.html', 'r', encoding='utf-8', errors='replace') as f:
    soup = BeautifulSoup(f, 'html.parser')

cards = soup.find_all(class_='review-soal-card')
print(f"Total cards: {len(cards)}")

# Check cards 27 to 40 (Choukai)
for i in range(25, 40):
    c = cards[i]
    audios = c.find_all('audio')
    btns = c.find_all(class_='play-audio-btn')
    print(f"Card #{i+1}: audios = {len(audios)}, btns = {len(btns)}")
    if audios:
        print("  Audio tag:", audios[0])
    if btns:
        print("  Btn data:", btns[0].attrs)

