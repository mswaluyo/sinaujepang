from bs4 import BeautifulSoup

with open('tools/c1_decoded_utf8.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

cards = soup.find_all(class_='soal-card')
print(f"Total cards: {len(cards)}")

audio_cards = []
for i, c in enumerate(cards):
    btn = c.find(class_='play-audio-btn')
    if btn and btn.get('data-audio-src'):
        src = btn['data-audio-src']
        sid = c.get('data-soal-id')
        q = c.find(class_='soal-pertanyaan').get_text(strip=True) if c.find(class_='soal-pertanyaan') else ''
        audio_cards.append({
            'card_index': i + 1,
            'soal_id': sid,
            'audio_src': src,
            'q': q
        })

print(f"Found {len(audio_cards)} Choukai cards with audio src:")
for ac in audio_cards:
    print(f" Card #{ac['card_index']} (ID {ac['soal_id']}): {ac['audio_src']} -> Q: {ac['q']}")

