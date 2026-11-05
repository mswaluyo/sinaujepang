import os, sys, json, re

sys.stdout.reconfigure(encoding='utf-8')

with open('tools/kaigo_indo_2_parsed.json', encoding='utf-8') as f:
    raw_qs = json.load(f)

quiz_items = []

for item in raw_qs:
    q_no = item['no']
    title = item['title']
    raw_choices = item['choices']
    corr_str = item['correct'].strip()
    img = item.get('image', '')

    # Format choices
    options = []
    correct_idx = 0
    matched = False

    for idx, ch in enumerate(raw_choices):
        ch_clean = ch.strip()
        options.append({
            "text": ch_clean,
            "img": ""
        })
        if ch_clean == corr_str or corr_str in ch_clean or ch_clean in corr_str:
            correct_idx = idx
            matched = True

    if not matched:
        options.append({"text": corr_str, "img": ""})
        correct_idx = len(options) - 1

    # Tentukan sub-kategori MHLW Kaigo Skills
    t_lower = title.lower()
    if any(k in t_lower for k in ['komunikasi', 'mendengar', 'bicara', 'keluarga', 'hubungan', 'etika', 'martabat', 'icf', 'qol']):
        cat_key = "communication"
        cat_label = "3. Communication skills (コミュニケーション技術)"
    elif any(k in t_lower for k in ['jantung', 'otak', 'demensia', 'saraf', 'suhu', 'tekanan darah', 'vital', 'hemiplegia', 'lumpuh', 'tulang', 'otot', 'penyakit', 'infeksi', 'tubuh']):
        cat_key = "kokoro"
        cat_label = "2. Mechanisms of mind and body (こころとからだのしくみ)"
    elif any(k in t_lower for k in ['makan', 'mandi', 'baju', 'posisi', 'kursi roda', 'pindah', 'dekubitus', 'cuci tangan', 'popok', 'buang air', 'tidur', 'gerak']):
        cat_key = "seikatsu"
        cat_label = "4. Daily living support & safety (生活支援技術・安全)"
    else:
        cat_key = "kihon"
        cat_label = "1. Fundamentals of care (介護の基本)"

    q_obj = {
        "no": q_no,
        "section": "SSW KAIGO SKILLS (INDO 2)",
        "mnn": "SSW Kaigo (介護技能)",
        "title": title,
        "image": img,
        "options": options,
        "answer": correct_idx,
        "kunci_id": corr_str,
        "salah": "Pilihan ini tidak sesuai dengan pedoman standar keperawatan lansia Jepang.",
        "analisis": f"Berdasarkan standar resmi evaluasi keterampilan perawat lansia (Kaigo Skills), tindakan/jawaban yang tepat adalah: **{corr_str}**.",
        "opt_note": [f"({o['text']})" for o in options],
        "opt_detail": [{"kana": o['text'], "rom": "", "arti": o['text'], "alasan": "Pilihan evaluasi Kaigo"} for o in options],
        "trans": "Evaluasi keterampilan keperawatan lansia (Nursing Care Skills Evaluation Test - Bahasa Indonesia Tipe 2).",
        "category": cat_key,
        "category_label": cat_label
    }
    quiz_items.append(q_obj)

target_file = r"public/quizzes/ssw-kaigo-indo2-quiz/quiz-data.json"
with open(target_file, 'w', encoding='utf-8') as out_f:
    json.dump(quiz_items, out_f, ensure_ascii=False, indent=2)

print(f"Successfully generated {target_file} with {len(quiz_items)} questions!")
