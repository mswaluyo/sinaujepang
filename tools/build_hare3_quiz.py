import re
import json
import os
from bs4 import BeautifulSoup

with open('tools/hare_new_kunci_utf8.html', 'r', encoding='utf-8') as f:
    soup_kunci = BeautifulSoup(f.read(), 'html.parser')

with open('tools/hare_new_extracted/d1.html', 'r', encoding='utf-8', errors='replace') as f:
    soup_d1 = BeautifulSoup(f.read(), 'html.parser')

cards_kunci = soup_kunci.find_all(class_='review-soal-card')
cards_d1 = soup_d1.find_all(class_='soal-card')

print(f'cards_kunci: {len(cards_kunci)}, cards_d1: {len(cards_d1)}')

all_questions = []

# Map audio per choukai
audio_map = {
    37: 'assets/c1.wav',
    38: 'assets/c2.wav',
    39: 'assets/c3.wav',
    40: 'assets/c4.wav',
    41: 'assets/c4.wav', # part 2 of soal 40
    42: 'assets/c5.wav',
    43: 'assets/c5.wav', # part 2 of soal 42
}

# Map images for mojigoi
image_map = {
    1: 'assets/m1.jpg',
    2: 'assets/m2.png',
    3: 'assets/m3.png',
    4: 'assets/m4.png',
    5: 'assets/m5.png',
    12: 'assets/m12.jpg',
    13: 'assets/m13.jpg'
}

for i in range(55):
    no = i + 1
    ck = cards_kunci[i]
    cd = cards_d1[i]
    
    # 1. Section & MNN category
    if 1 <= no <= 13:
        section = 'SESI 1 : MOJIGOI'
        mnn = 'Mojigoi'
    elif 14 <= no <= 36:
        section = 'SESI 2 : HYOUGEN'
        mnn = 'Hyougen'
    elif 37 <= no <= 43:
        section = 'SESI 3 : CHOUKAI'
        mnn = 'Choukai'
    else:
        section = 'SESI 4 : DOKKAI'
        mnn = 'Dokkai'
        
    # 2. Extract options from review card
    opts_review = ck.find_all(class_='review-jawaban-item')
    options = []
    opt_detail = []
    opt_note = []
    
    # Kunci letter (A, B, or C)
    kunci_letter = 'A'
    kj_div = ck.find(class_='review-jawaban')
    if kj_div:
        m = re.search(r'Kunci:\s*<strong[^>]*>([A-C])</strong>', str(kj_div))
        if m: kunci_letter = m.group(1).upper()
        
    letter_to_idx = {'A': 0, 'B': 1, 'C': 2}
    answer_idx = letter_to_idx.get(kunci_letter, 0)
    
    # Penjelasan / Analisis
    penjelasan_div = ck.find(class_='review-penjelasan')
    raw_penjelasan = penjelasan_div.get_text(separator=' ', strip=True) if penjelasan_div else ''
    clean_penjelasan = re.sub(r'^[💡\s]+', '', raw_penjelasan)
    
    # Extract options text & subtexts
    for oi, item in enumerate(opts_review):
        span = item.find('span')
        opt_text = span.get_text(strip=True) if span else ''
        # subtext is next sibling div with italic arti
        parent_box = item.parent
        sub_div = parent_box.find(style=re.compile(r'color:var\(--text3\);font-style:italic'))
        sub_text = sub_div.get_text(strip=True) if sub_div else ''
        # remove surrounding parentheses
        sub_text_clean = re.sub(r'^\(|\)$', '', sub_text).strip()
        
        options.append({
            'text': opt_text,
            'img': ''
        })
        
        # build opt_detail & opt_note
        is_correct = (oi == answer_idx)
        alasan = f'Pilihan tepat. {clean_penjelasan}' if is_correct else 'Pilihan kurang tepat sesuai konteks soal.'
        
        # extract kana & rom if available in sub_text_clean
        # e.g. "Cerah (はれ / Hare)" or "Perawat lansia (かいご)"
        opt_detail.append({
            'kana': opt_text,
            'rom': '-',
            'arti': sub_text_clean or opt_text,
            'alasan': alasan
        })
        
        opt_note.append(sub_text_clean or opt_text)

    # 3. Title, konteks, and translation
    # From d1 soal-card
    pertanyaan_div = cd.find(class_='soal-pertanyaan')
    raw_title = pertanyaan_div.get_text(separator='\n', strip=True) if pertanyaan_div else ''
    
    # Terjemahan
    terjemahan_div = cd.find(class_='soal-terjemahan') or cd.find(class_=re.compile(r'terjemahan'))
    trans = terjemahan_div.get_text(separator=' ', strip=True) if terjemahan_div else ''
    trans = re.sub(r'^\(|\)$', '', trans).strip()
    
    # For dokkai, include soal-konteks (reading text)
    konteks_div = cd.find(class_='soal-konteks')
    if konteks_div:
        k_ja = konteks_div.find(class_='ja')
        k_ja_txt = k_ja.get_text(separator='\n', strip=True) if k_ja else ''
        k_trans = konteks_div.find(class_=re.compile(r'terjemahan'))
        k_trans_txt = k_trans.get_text(separator='\n', strip=True) if k_trans else ''
        
        title = f'{k_ja_txt}\n\n{raw_title}'.strip()
        if k_trans_txt:
            trans = f'{k_trans_txt}\n\n{trans}'.strip()
    else:
        title = raw_title
        
    # If image-based question with dummy title, clean it
    img_path = image_map.get(no, '')
    audio_path = audio_map.get(no, '')
    
    if img_path and 'Perhatikan gambar' in title:
        title = '' # Standards: pure image questions have empty title
        if not trans or 'Perhatikan gambar' in trans:
            # use clean_penjelasan description
            trans = clean_penjelasan
            
    analisis = f'[{mnn}] {clean_penjelasan}' if clean_penjelasan else f'[{mnn}] Jawaban yang benar adalah {options[answer_idx]["text"]}.'
    
    q_obj = {
        'no': no,
        'section': section,
        'title': title,
        'img': img_path,
        'audio': audio_path,
        'options': options,
        'answer': answer_idx,
        'score': '0/4',
        'trans': trans or clean_penjelasan,
        'trans_rom': '-',
        'mnn': mnn,
        'analisis': analisis,
        'opt_detail': opt_detail,
        'opt_note': opt_note,
        'kunci_id': options[answer_idx]['text']
    }
    
    all_questions.append(q_obj)

os.makedirs('public/quizzes/hare3-quiz', exist_ok=True)
with open('public/quizzes/hare3-quiz/quiz-data.json', 'w', encoding='utf-8') as out:
    json.dump(all_questions, out, ensure_ascii=False, indent=2)

print('SUCCESS: Created public/quizzes/hare3-quiz/quiz-data.json with 55 questions!')

