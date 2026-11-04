import json, os, re

# Load raw extracted cards
with open('tools/konpyuuta2_raw_extracted.json', 'r', encoding='utf-8') as f:
    raw_cards = json.load(f)

# Load whisper transcripts
with open('tools/konpyuuta2_whisper.json', 'r', encoding='utf-8') as f:
    whisper = json.load(f)

quiz_items = []

for c in raw_cards:
    idx = c['index']
    
    # 1. Determine Section
    if idx <= 14:
        section = "SESI 1 : MOJIGOI"
    elif idx <= 25:
        section = "SESI 2 : HYOUGEN"
    elif idx <= 37:
        section = "SESI 3 : CHOUKAI"
    else:
        section = "SESI 4 : DOKKAI"

    # 2. Options and answer index
    kunci_letter = c['kunci'].strip().upper()
    key_map = {'A': 0, 'B': 1, 'C': 2}
    ans_idx = key_map.get(kunci_letter, 0)
    
    opts = []
    opt_detail = []
    opt_note = []
    
    for pi in c['options']:
        t = pi['text'].strip()
        trans = pi['trans'].strip().replace('(', '').replace(')', '')
        # Build opt
        opts.append({"text": t, "img": ""})
        
        # Detail
        is_correct = (pi['key'] == kunci_letter)
        opt_detail.append({
            "kana": t,
            "rom": "",
            "arti": trans,
            "alasan": f"Jawaban yang benar sesuai konteks/penjelasan." if is_correct else f"Pilihan {pi['key']} ({t}) bukan jawaban yang tepat untuk pertanyaan ini."
        })
        opt_note.append(f"{t} ({trans})")

    # 3. Handle Question / Title
    q_txt = c['q_txt'].strip()
    q_trans = c['q_trans'].strip()
    
    title = ""
    trans_ind = ""
    trans_rom = ""
    image_path = ""
    audio_path = ""
    
    # Check images for Mojigoi 1..4 and Dokkai
    if idx == 1:
        image_path = "assets/konpyuuta.jpg"
    elif idx == 2:
        image_path = "assets/kagi1.png"
    elif idx == 3:
        image_path = "assets/kagi2.png"
    elif idx == 4:
        image_path = "assets/kagi3.png"
        
    # Section 3 Choukai
    if section == "SESI 3 : CHOUKAI":
        # Map audio
        # Card 26 -> c1.wav
        # Card 27 -> c2.wav
        # Card 28, 29 -> c3.wav
        # Card 30 -> c4.wav
        # Card 31, 32 -> c5.wav
        # Card 33 -> c6.wav
        # Card 34, 35 -> c7.wav
        # Card 36, 37 -> c8.wav
        audio_map = {
            26: "c1.wav", 27: "c2.wav", 28: "c3.wav", 29: "c3.wav",
            30: "c4.wav", 31: "c5.wav", 32: "c5.wav", 33: "c6.wav",
            34: "c7.wav", 35: "c7.wav", 36: "c8.wav", 37: "c8.wav"
        }
        afn = audio_map.get(idx, "")
        if afn:
            audio_path = f"assets/{afn}"
            title = whisper.get(afn, "") + f"\n\n● {q_txt}"
            trans_ind = c['konteks_id'] or c['q_trans']
    else:
        if q_txt and q_txt != "Perhatikan gambar berikut":
            title = q_txt
        elif c['konteks_ja']:
            title = c['konteks_ja']
            
    # Clean penjelasan for analisis
    penjelasan = c['penjelasan'].replace('💡', '').strip()
    analisis = f"[MNN Standar CBT] {penjelasan}"

    item = {
        "no": idx,
        "section": section,
        "title": title,
        "options": opts,
        "answer": ans_idx,
        "salah": "Pilihan lain tidak cocok dengan gambar/bacaan dan kunci file jawaban.",
        "analisis": analisis,
        "opt_detail": opt_detail,
        "opt_note": opt_note
    }
    
    if image_path:
        item["image"] = image_path
    if audio_path:
        item["audio"] = audio_path
    if trans_ind:
        item["trans"] = trans_ind
        
    quiz_items.append(item)

# Save preliminary
with open('public/quizzes/konpyuutaa2-quiz/quiz-data.json', 'w', encoding='utf-8') as out:
    json.dump(quiz_items, out, ensure_ascii=False, indent=2)

print(f"Generated public/quizzes/konpyuutaa2-quiz/quiz-data.json with {len(quiz_items)} questions!")
