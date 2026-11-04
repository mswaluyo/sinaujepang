import json, quopri
from bs4 import BeautifulSoup

# 1. Parse c1 for clean questions and options
with open('tools/c1_decoded_utf8.html', 'r', encoding='utf-8') as f:
    soup_c1 = BeautifulSoup(f, 'html.parser')
c1_cards = soup_c1.find_all(class_='soal-card')

# 2. Parse kunci for explanations and answers
with open('tools/konpyuuta2_kunci_proper_utf8.html', 'r', encoding='utf-8') as f:
    soup_kunci = BeautifulSoup(f, 'html.parser')
kunci_cards = soup_kunci.find_all(class_='review-soal-card')

print(f"c1_cards: {len(c1_cards)}, kunci_cards: {len(kunci_cards)}")

all_cards = []
for i in range(len(c1_cards)):
    cc = c1_cards[i]
    kc = kunci_cards[i] if i < len(kunci_cards) else None
    
    # Question text & translation
    q_elem = cc.find(class_='soal-pertanyaan')
    q_txt = q_elem.get_text(strip=True) if q_elem else ''
    q_trans = cc.find(class_='soal-terjemahan')
    q_trans_txt = q_trans.get_text(strip=True) if q_trans else ''
    
    # Context
    konteks_elem = cc.find(class_='soal-konteks')
    konteks_ja = konteks_elem.find(class_='ja').get_text(strip=True) if konteks_elem and konteks_elem.find(class_='ja') else ''
    konteks_id = konteks_elem.find(class_='soal-konteks-terjemahan').get_text(strip=True) if konteks_elem and konteks_elem.find(class_='soal-konteks-terjemahan') else ''
    
    # Image
    img_elem = cc.find('img', class_='soal-img')
    img_src = img_elem['src'] if img_elem else ''
    
    # Audio
    audio_btn = cc.find(class_='play-audio-btn')
    audio_src = audio_btn['data-audio-src'] if audio_btn and audio_btn.get('data-audio-src') else ''
    
    # Options
    options = []
    p_items = cc.find_all(class_='pilihan-item')
    for pi in p_items:
        key = pi.find(class_='pilihan-key').get_text(strip=True)
        txt = pi.find(class_='pilihan-text').get_text(strip=True)
        trans = pi.find(class_='pilihan-terjemahan')
        trans_txt = trans.get_text(strip=True) if trans else ''
        p_img = pi.find('img')
        options.append({
            'key': key,
            'text': txt,
            'trans': trans_txt,
            'img': p_img['src'] if p_img else ''
        })
        
    # Kunci & Penjelasan from review
    kunci_letter = kc.find(class_='review-key-benar').get_text(strip=True) if kc and kc.find(class_='review-key-benar') else ''
    penjelasan_txt = kc.find(class_='review-penjelasan').get_text(strip=True) if kc and kc.find(class_='review-penjelasan') else ''
    
    all_cards.append({
        'index': i + 1,
        'q_txt': q_txt,
        'q_trans': q_trans_txt,
        'konteks_ja': konteks_ja,
        'konteks_id': konteks_id,
        'img_src': img_src,
        'audio_src': audio_src,
        'options': options,
        'kunci': kunci_letter,
        'penjelasan': penjelasan_txt
    })

with open('tools/konpyuuta2_raw_extracted.json', 'w', encoding='utf-8') as out:
    json.dump(all_cards, out, ensure_ascii=False, indent=2)

print(f"Extracted all {len(all_cards)} cards into tools/konpyuuta2_raw_extracted.json!")

