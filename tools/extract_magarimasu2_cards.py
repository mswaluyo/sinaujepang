import json
from bs4 import BeautifulSoup

with open('tools/magarimasu2_kunci_clean.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

cards = soup.find_all('div', class_='review-soal-card')
print(f"Total cards found: {len(cards)}")

results = []

for idx, card in enumerate(cards):
    q_no = idx + 1
    
    # 1. Pertanyaan
    pert_elem = card.find('div', class_='review-pertanyaan')
    raw_pert = pert_elem.get_text(separator='\n', strip=True) if pert_elem else ''
    
    # Pisahkan Japanese / Latin jika ada
    lines = [l.strip() for l in raw_pert.split('\n') if l.strip()]
    title = lines[0] if lines else ''
    sub_title = lines[1] if len(lines) > 1 else ''
    
    # 2. Konteks
    konteks_elem = card.find('div', class_='review-konteks')
    konteks = konteks_elem.get_text(separator='\n', strip=True) if konteks_elem else ''
    
    # 3. Kunci jawaban (A, B, C, D)
    jawaban_elem = card.find('div', class_='review-jawaban')
    jawaban_text = jawaban_elem.get_text(strip=True) if jawaban_elem else ''
    kunci_huruf = 'A'
    if 'Kunci:' in jawaban_text:
        kunci_huruf = jawaban_text.split('Kunci:')[-1].strip()[:1].upper()
    elif 'Jawaban Benar:' in jawaban_text:
        kunci_huruf = jawaban_text.split('Jawaban Benar:')[-1].strip()[:1].upper()
        
    ans_idx = ord(kunci_huruf) - ord('A') if 'A' <= kunci_huruf <= 'D' else 0
    
    # 4. Opsi jawaban
    opsi_items = card.find_all('div', class_='review-jawaban-item')
    options = []
    opt_notes = []
    opt_details = []
    
    for opt_item in opsi_items:
        key_elem = opt_item.find('div', class_='review-jawaban-key')
        huruf = key_elem.get_text(strip=True) if key_elem else ''
        text_elem = opt_item.find('span')
        teks_jp = text_elem.get_text(strip=True) if text_elem else ''
        
        # Parent container has subtext note
        parent = opt_item.parent
        sub_elem = parent.find('div', style=lambda s: s and 'font-size:10px' in s) if parent else None
        teks_sub = sub_elem.get_text(strip=True) if sub_elem else ''
        
        options.append({'text': teks_jp, 'img': ''})
        note_str = f"({teks_jp}) {teks_sub}".strip()
        opt_notes.append(note_str)
        opt_details.append({
            'kana': teks_jp,
            'rom': '',
            'arti': teks_sub.strip('()'),
            'alasan': ''
        })
        
    # 5. Penjelasan
    penj_elem = card.find('div', class_='review-penjelasan')
    penjelasan = penj_elem.get_text(separator=' ', strip=True) if penj_elem else ''
    if penjelasan.startswith('💡'):
        penjelasan = penjelasan[1:].strip()
        
    # Tentukan section
    if q_no <= 14:
        section = "SESI 1 : MOJIGOI"
        mnn = "Mojigoi"
    elif q_no <= 28:
        section = "SESI 2 : HYOUGEN"
        mnn = "Hyougen"
    elif q_no <= 40:
        section = "SESI 3 : CHOUKAI"
        mnn = "Choukai"
    else:
        section = "SESI 4 : DOKKAI"
        mnn = "Dokkai"

    results.append({
        'no': q_no,
        'section': section,
        'mnn': mnn,
        'title': raw_pert,
        'konteks': konteks,
        'options': options,
        'answer': ans_idx,
        'kunci_huruf': kunci_huruf,
        'analisis': penjelasan,
        'opt_note': opt_notes,
        'opt_detail': opt_details
    })

out_file = 'tools/magarimasu2_raw_extracted.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Successfully extracted {len(results)} questions into {out_file}!")

