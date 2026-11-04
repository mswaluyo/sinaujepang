from bs4 import BeautifulSoup

with open('tools/c1_decoded_utf8.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

cards = soup.find_all(class_='soal-card')
c26 = cards[25] # Card 26

with open('tools/c1_card26.html', 'w', encoding='utf-8') as out:
    out.write(str(c26))

scripts = soup.find_all('script')
with open('tools/c1_scripts.txt', 'w', encoding='utf-8') as out:
    for idx, s in enumerate(scripts):
        txt = s.get_text()
        if any(k in txt for k in ['audio', 'mp3', 'wav', 'm4a', 'play', 'soal']):
            out.write(f"=== Script #{idx+1} ===\n")
            out.write(txt[:1000] + "\n\n")

print("Saved card 26 and scripts!")
