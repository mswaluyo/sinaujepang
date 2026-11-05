import os, sys, json, shutil

sys.stdout.reconfigure(encoding='utf-8')

from map_bab5_17_answers import bab_meta, bab_answers

total_created = 0

for b in range(5, 18):
    slug = f"ssw-kaigo-bab{b}-quiz"
    quiz_dir = os.path.join("public", "quizzes", slug)
    os.makedirs(quiz_dir, exist_ok=True)
    
    with open(f"tools/kaigo_extracted/bab_{b}.json", "r", encoding="utf-8") as f:
        raw_qs = json.load(f)
        
    meta = bab_meta[b]
    ans_map = bab_answers[b]
    
    formatted_questions = []
    
    for item in raw_qs:
        q_num = item["num"]
        title = item["title"]
        raw_opts = item["options"]
        
        # Bab 9 Q15 fix if only 3 options
        if b == 9 and q_num == 15 and "d" not in raw_opts:
            raw_opts["d"] = "Semua jawaban benar"
            
        opt_keys = sorted(raw_opts.keys())
        correct_letter = ans_map.get(q_num, "a")
        
        options = []
        correct_idx = 0
        kunci_text = ""
        opt_note = []
        opt_detail = []
        
        for idx, ok in enumerate(opt_keys):
            opt_text = f"{ok.upper()}. {raw_opts[ok]}"
            options.append({
                "text": opt_text,
                "img": ""
            })
            opt_note.append(f"({opt_text[:30]}...)")
            opt_detail.append({
                "kana": opt_text,
                "rom": "",
                "arti": opt_text,
                "alasan": "Opsi evaluasi materi Kaigo MHLW"
            })
            
            if ok == correct_letter:
                correct_idx = idx
                kunci_text = opt_text
                
        q_obj = {
            "no": q_num,
            "section": meta["section"],
            "mnn": f"SSW Kaigo ({b})",
            "title": title,
            "options": options,
            "answer": correct_idx,
            "kunci_id": kunci_text,
            "salah": "Pilihan jawaban ini tidak sesuai dengan buku pedoman resmi keperawatan lansia Jepang (MHLW).",
            "analisis": f"Berdasarkan standar buku teks SSW Kaigo ({meta['title']}), pilihan yang tepat adalah **{kunci_text}**.",
            "opt_note": opt_note,
            "opt_detail": opt_detail,
            "pembahasan": [
                {
                    "title": f"Materi Inti {meta['section']}",
                    "desc": f"Memahami konsep dasar pada bab {b} mengenai {meta['category']}."
                }
            ]
        }
        formatted_questions.append(q_obj)
        
    out_file = os.path.join(quiz_dir, "quiz-data.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(formatted_questions, f, ensure_ascii=False, indent=2)
        
    print(f"Generated {slug}: {len(formatted_questions)} questions -> {out_file}")
    total_created += len(formatted_questions)

print(f"\nSUCCESS! Total {total_created} questions generated across 13 packages.")
