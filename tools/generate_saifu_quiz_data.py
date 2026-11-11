import json, re

# Load raw forms and clean kunci
with open('tools/saifu_all_forms_raw.json', 'r', encoding='utf-8') as f:
    forms = json.load(f)

with open('tools/saifu_parsed_kunci_clean.json', 'r', encoding='utf-8') as f:
    kunci = json.load(f)

print(f"Total forms: {len(forms)}, Total kunci: {len(kunci)}")

quiz_items = []

for i in range(len(forms)):
    frm = forms[i]
    kc = kunci[i]
    no = i + 1
    sec = frm['section']
    mnn = frm['mnn']
    
    # Clean title
    raw_title = frm['title_raw']
    # Clean up leading numbers, asterisks
    clean_title = re.sub(r'^\d+[\.\、\s]*', '', raw_title)
    clean_title = re.sub(r'\*.*$', '', clean_title).strip()
    
    # Options
    raw_opts = frm['options_text']
    # Filter out empty string (like Google Form 'Yang lain:')
    filtered_opts = [o.strip() for o in raw_opts if o.strip()]
    
    # If 1-option question in Dokkai (e.g. Q38, Q44, Q45, Q48), we provide plausible distractor options
    # so CBT engine has multiple choices, but keep correct answer as answer 0 or matched index
    if len(filtered_opts) == 1:
        single_val = filtered_opts[0]
        if no == 38: # やまださんはなにをしますか?
            filtered_opts = ["Membaca buku", "Menulis surat", "Mendengarkan radio"]
        elif no == 44: # SEMUA ORANG BISA MENARI
            filtered_opts = ["誰もダンスに参加できます", "子どもだけ参加できます", "大人だけ参加できます"]
        elif no == 45: # KENAPA TARIAN ITU DIADAKAN
            filtered_opts = ["病気にならずに健康でいられるように", "新しい年を祝うために", "友達を作るために"]
        elif no == 48: # TOKO LIBUR KAPAN?
            filtered_opts = ["LIAT BLOK 🔴 PADA TABEL YA.", "Senin dan Kamis", "Setiap akhir pekan"]
    
    # Radio images
    r_imgs = frm['radio_imgs']
    
    # Build options objects
    opts_objs = []
    for opt_idx, opt_text in enumerate(filtered_opts):
        img_val = ""
        if opt_idx < len(r_imgs):
            # If radio option has image
            img_val = f"assets/{r_imgs[opt_idx]}"
        opts_objs.append({
            "text": opt_text,
            "img": img_val
        })
        
    # Question image
    q_img = ""
    if frm['q_imgs']:
        q_img = f"assets/{frm['q_imgs'][0]}"
        
    # Correct answer index
    correct_str = kc['correct'].strip()
    # Match with options
    matched_ans = 0
    best_ratio = 0
    for idx_o, o in enumerate(opts_objs):
        # exact match
        if correct_str == o['text']:
            matched_ans = idx_o
            break
        elif correct_str in o['text'] or o['text'] in correct_str:
            matched_ans = idx_o
            break
            
    # Default translation and analysis
    trans = f"Soal No. {no} Sesi {sec}."
    analisis = f"[{mnn} No. {no}] Kunci jawaban yang benar adalah '{opts_objs[matched_ans]['text']}'."
    
    # Specific details for Mojigoi
    if sec == "SESI 1 : MOJIGOI":
        if no == 1:
            clean_title = "Pilihlah kosakata yang tepat sesuai gambar!"
            trans = "Dompet (さいふ / 💳)."
            analisis = "[MNN Bab 2 - Kosakata Benda] Gambar menunjukkan sebuah dompet (財布 / さいふ / saifu). たいふ dan らいふ adalah pengecoh pelafalan."
        elif no == 2:
            clean_title = "Pilihlah kosakata yang tepat sesuai gambar!"
            trans = "Sendok (スプーン)."
            analisis = "[MNN Bab 7 - Alat Makan] Gambar menunjukkan sendok makan (スプーン / supuun). はし = sumpit, フォーク/フォッグ = garpu."
        elif no == 3:
            clean_title = "Pilihlah kosakata/kanji yang tepat sesuai gambar!"
            trans = "Menakutkan / takut (怖い / こわい)."
            analisis = "[MNN Bab 12/A2 - Kata Sifat] Gambar menunjukkan ekspresi ketakutan / seram (怖い / こわい). 強い = kuat, 弱い = lemah."
        elif no == 4:
            trans = "Saya tidak merokok (わたしはたばこをすいません)."
            analisis = "[MNN Bab 6 - Partikel を + Kata Kerja すいます] Pasangan kata untuk すいます (merokok/menghisap) adalah たばこ (rokok) -> たばこを すいます."
        elif no == 5:
            trans = "Sebelum pulang, tolong matikan lampu (かえるまえに、でんきを けして ください)."
            analisis = "[MNN Bab 14 - Bentuk ~てください] Mematikan lampu/listrik menggunakan kata kerja 消します (けします) bentuk ~te: けして (けしてください)."
        elif no == 6:
            trans = "Dari atas gunung melihat pemandangan yang indah (やまのうえから うつくしい けしきを みました)."
            analisis = "[MNN Bab 8/A2 - Kata Sifat -i] Pemandangan yang indah diungkapkan dengan kata sifat うつくしい (indah/cantik). たかい = tinggi, さびしい = sepi."
        elif no == 7:
            trans = "Tolong pergi ke pintu timur (ひがしぐち へ いってください)."
            analisis = "[MNN Bab 10 - Arah Mata Angin] 東 (timur) + 口 (pintu/gerbang) dibaca ひがしぐち (Higashiguchi / Pintu Timur)."
        elif no == 8:
            trans = "Tahun lalu (去年 / きょねん)."
            analisis = "[MNN Bab 5 - Keterangan Waktu] Kanji 去年 dibaca きょねん (tahun lalu). Bukan kyou-nen atau kyoe-nen."
        elif no == 9:
            trans = "Ramah / baik hati (親切 / しんせつ)."
            analisis = "[MNN Bab 8 - Kata Sifat -na] Kanji 親切 dibaca しんせつ (ramah / baik hati)."
        elif no == 10:
            trans = "Kyoto adalah kota yang tua/kuno (きょうとは ふるいまちです)."
            analisis = "[MNN Bab 8 - Modifikasi Kata Benda] Pasangan deskripsi kota bersejarah Kyoto adalah 古い (ふるい / kuno / bersejarah)."
        elif no == 11:
            trans = "Di perpustakaan sering meminjam buku Jepang (としょかんで よく にほんのほんを かります)."
            analisis = "[MNN Bab 7 - Kata Kerja Meminjam] Di perpustakaan (図書館) aktivitas yang tepat untuk buku adalah 借ります (かります / meminjam)."
        elif no == 12:
            trans = "Ini adalah masakan istimewa yang dimakan saat perayaan (これはいわいのときにたべる とくべつな りょうりです)."
            analisis = "[MNN Bab 8/A2 - Kata Sifat -na] Masakan saat momen perayaan/spesial adalah 特別な (とくべつな / istimewa / spesial)."
            
    # opt_detail
    opt_detail = []
    for o_idx, o in enumerate(opts_objs):
        is_correct = (o_idx == matched_ans)
        opt_detail.append({
            "kana": o['text'],
            "rom": "",
            "arti": o['text'],
            "alasan": "Pilihan tepat sesuai kunci jawaban dan tata bahasa." if is_correct else "Pilihan pengecoh / tidak sesuai dengan konteks wacana/gambar."
        })
        
    item = {
        "no": no,
        "title": clean_title,
        "subTitle": "",
        "img": q_img,
        "audio": "",
        "options": opts_objs,
        "answer": matched_ans,
        "score": "0/4",
        "section": sec,
        "trans": trans,
        "trans_rom": "-",
        "mnn": mnn,
        "analisis": analisis,
        "opt_detail": opt_detail,
        "kunci_id": opts_objs[matched_ans]['text'],
        "salah": "Pilihan lain tidak cocok dengan gambar/bacaan dan kunci file jawaban."
    }
    quiz_items.append(item)

print(f"Generated {len(quiz_items)} quiz items.")
target_path = "public/quizzes/saifu-quiz/quiz-data.json"
with open(target_path, 'w', encoding='utf-8') as f:
    json.dump(quiz_items, f, indent=2, ensure_ascii=False)

print(f"Successfully saved to {target_path}")
