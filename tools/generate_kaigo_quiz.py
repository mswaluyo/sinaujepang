import os, sys, json, re

sys.stdout.reconfigure(encoding='utf-8')

# Import answer mappings
from map_pdf_answers import ans_bab1, ans_bab2, ans_bab3, ans_bab4

# Target directory
target_dir = r"d:\soal-jft\public\quizzes\ssw-kaigo-quiz"
os.makedirs(target_dir, exist_ok=True)
os.makedirs(os.path.join(target_dir, "assets"), exist_ok=True)

# 1. Load MHTML parsed items
with open('tools/parsed_mhtml_full.json', encoding='utf-8') as f:
    mhtml_items = json.load(f)

# 2. Load PDF parsed questions
all_pdf = []
for bab, ans_map in [(1, ans_bab1), (2, ans_bab2), (3, ans_bab3), (4, ans_bab4)]:
    with open(f'tools/bab_{bab}_parsed.json', encoding='utf-8') as f:
        d = json.load(f)
    for k in sorted(d.keys(), key=lambda x: int(x)):
        q = d[k]
        q['bab'] = bab
        q['correct_opt'] = ans_map.get(int(k), 'a')
        all_pdf.append(q)

print(f"Total PDF questions: {len(all_pdf)}")
print(f"Total MHTML items: {len(mhtml_items)}")

# Build final questions list
final_quiz = []
q_no = 1

# Section 1: Soal Teori & Pengetahuan Kaigo (Gakka & Etika) dari 4 Bab PDF (66 soal)
bab_titles = {
    1: "Bab 1: Martabat & Kemandirian Manusia",
    2: "Bab 2: Peran Staf & Etika Profesi Perawat",
    3: "Bab 3: Menjamin Keselamatan & Manajemen Risiko",
    4: "Bab 4: Pemahaman Mekanisme Mental & Tubuh"
}

for item in all_pdf:
    bab_num = item['bab']
    raw_opts = item['options'] # dict of 'a', 'b', 'c', 'd'
    # Ensure options are in a, b, c, d order
    opt_keys = sorted(raw_opts.keys())
    if not opt_keys:
        continue
    
    correct_letter = item['correct_opt']
    # Build options list
    options = []
    correct_idx = 0
    kunci_text = ""
    for idx, ok in enumerate(opt_keys):
        txt = raw_opts[ok]
        options.append({
            "text": f"{ok.upper()}. {txt}",
            "img": ""
        })
        if ok == correct_letter:
            correct_idx = idx
            kunci_text = f"{ok.upper()}. {txt}"

    # Category determination for SSW Kaigo:
    # bab 1 & 4 -> Technical terms & basic concepts of care
    # bab 2 -> Communications & ethics of care
    # bab 3 -> Safety & procedures of care
    if bab_num in [1, 4]:
        cat_key = "gakka"
        cat_label = "1. Technical terms & basics of care (Konsep & Dasar Keperawatan)"
    elif bab_num == 2:
        cat_key = "anzen"
        cat_label = "2. Communications & ethics of care (Etika & Komunikasi Perawatan)"
    else:
        cat_key = "jitsugi"
        cat_label = "3. Safety & procedures of care (Keselamatan & Prosedur Keperawatan)"

    q_obj = {
        "no": q_no,
        "section": "SSW KAIGO",
        "mnn": "SSW Kaigo (介護)",
        "title": item['text'],
        "options": options,
        "answer": correct_idx,
        "kunci_id": kunci_text,
        "salah": "Pilihan jawaban ini tidak sesuai dengan buku pedoman dan standar resmi keperawatan lansia Jepang.",
        "analisis": f"Berdasarkan materi keahlian Kaigo ({bab_titles[bab_num]}), jawaban yang tepat adalah **{kunci_text}**.",
        "opt_note": [f"({o['text'][:20]}...)" for o in options],
        "opt_detail": [{"kana": o['text'], "rom": "", "arti": o['text'], "alasan": "Opsi jawaban evaluasi"} for o in options],
        "trans": f"Materi evaluasi keahlian perawat lansia ({bab_titles[bab_num]}).",
        "category": cat_key,
        "category_label": cat_label
    }
    final_quiz.append(q_obj)
    q_no += 1

# Section 2: Soal Bahasa Jepang Khusus Kaigo & Percakapan Lapangan dari 6 File MHTML (85 soal)
for item in mhtml_items:
    q_title = item['question']
    choices = item['choices']
    corr_val = item['correct']
    img_path = item.get('image', '')
    
    # If correct answer is not directly in choices, add it or adjust
    # Find matching index for correct value
    correct_idx = 0
    matched = False
    for idx, ch in enumerate(choices):
        if ch.strip() == corr_val.strip() or corr_val.strip() in ch:
            correct_idx = idx
            matched = True
            break
            
    if not matched:
        choices.append(corr_val)
        correct_idx = len(choices) - 1

    options = []
    for idx, ch in enumerate(choices):
        options.append({
            "text": ch,
            "img": ""
        })

    # Japanese Kaigo categories:
    # Technical terms vs Communication
    cat_key = "gakka"
    cat_label = "1. Technical terms of care (介護の日本語・専門用語)"
    if "会話" in q_title or "どうしますか" in q_title or "返事" in q_title or "利用者" in q_title:
        cat_key = "anzen"
        cat_label = "2. Communications of care (介護の会話・コミュニケーション)"
    if "記録" in q_title or "報告" in q_title or "勤務表" in q_title:
        cat_key = "jitsugi"
        cat_label = "3. Documents of care (介護の記録・文書の読み取り)"

    # If question title is empty or placeholder like "Pertanyaan Tanpa Judul"
    if not q_title or q_title == "Pertanyaan Tanpa Judul":
        q_title = "次（つぎ）のイラスト／言葉（ことば）の意味（いみ）として正（ただ）しいものを選（えら）びなさい。"

    q_obj = {
        "no": q_no,
        "section": "SSW KAIGO",
        "mnn": "SSW Kaigo (介護)",
        "title": q_title,
        "image": f"/quizzes/ssw-kaigo-quiz/{img_path}" if img_path else "",
        "options": options,
        "answer": correct_idx,
        "kunci_id": corr_val,
        "salah": "Pilihan ini tidak sesuai dengan tata bahasa atau istilah resmi komunikasi perawat lansia di Jepang.",
        "analisis": f"Jawaban yang benar untuk konteks keperawatan lansia ini adalah: **{corr_val}**.",
        "opt_note": [f"({o['text']})" for o in options],
        "opt_detail": [{"kana": o['text'], "rom": "", "arti": o['text'], "alasan": "Opsi pilihan Kaigo Nihongo"} for o in options],
        "trans": "Evaluasi pemahaman bahasa Jepang dan komunikasi khusus perawat lansia (Kaigo Nihongo).",
        "category": cat_key,
        "category_label": cat_label
    }
    final_quiz.append(q_obj)
    q_no += 1

print(f"\nFinal combined SSW Kaigo quiz size: {len(final_quiz)} questions!")
out_json_path = os.path.join(target_dir, "quiz-data.json")
with open(out_json_path, 'w', encoding='utf-8') as out_f:
    json.dump(final_quiz, out_f, ensure_ascii=False, indent=2)

print(f"Successfully generated {out_json_path}!")
