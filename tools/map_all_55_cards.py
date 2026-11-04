from bs4 import BeautifulSoup
import os

with open('tools/hare_new_extracted/d1.html', 'r', encoding='utf-8', errors='replace') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

soal_cards = soup.find_all(class_='soal-card')
with open('tools/hare_new_55_mapped.txt', 'w', encoding='utf-8') as out:
    out.write(f'Total soal-card found: {len(soal_cards)}\n\n')
    for i, card in enumerate(soal_cards):
        s_id = card.get('data-soal-id')
        k_id = card.get('data-kat-id')
        imgs = [img.get('src') for img in card.find_all('img')]
        audio = card.find(class_='play-audio-btn')
        audio_src = audio.get('data-audio-src') if audio else ''
        konteks = card.find(class_='soal-konteks')
        konteks_ja = konteks.find(class_='ja').get_text(strip=True) if konteks and konteks.find(class_='ja') else ''
        pertanyaan = card.find(class_='soal-pertanyaan')
        p_text = pertanyaan.get_text(strip=True) if pertanyaan else ''
        
        info = []
        if imgs: info.append(f'img:{imgs[0]}')
        if audio_src: info.append(f'audio:{os.path.basename(audio_src)}')
        if konteks_ja: info.append(f'dokkai:{konteks_ja[:25]}...')
        
        out.write(f'#{i+1} (id={s_id}, kat={k_id}) {p_text} [{" | ".join(info)}]\n')

print('Saved tools/hare_new_55_mapped.txt')
