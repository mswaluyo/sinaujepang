import json, os, shutil

# 1. Pastikan folder tujuan ada
target_quiz_dir = r"public/quizzes/magarimasu2-quiz"
target_assets_img = r"public/assets/quizzes/magarimasu2-quiz/images"
target_assets_audio = r"public/assets/quizzes/magarimasu2-quiz/audio"

os.makedirs(target_quiz_dir, exist_ok=True)
os.makedirs(target_assets_img, exist_ok=True)
os.makedirs(target_assets_audio, exist_ok=True)

# 2. Salin gambar dari _arsip/Magarimasu2
arsip_dir = r"D:\soal-jft\_arsip\Magarimasu2"
for f in os.listdir(arsip_dir):
    if f.endswith(('.png', '.jpg', '.jpeg')):
        shutil.copy2(os.path.join(arsip_dir, f), os.path.join(target_assets_img, f))
        # Salin juga ke public/assets/ sebagai fallback
        shutil.copy2(os.path.join(arsip_dir, f), os.path.join(r"public/assets", f))

print("Copied all images to quiz assets and public/assets.")

# 3. Salin audio dari tools/magarimasu2_audio
audio_src_dir = r"d:\soal-jft\tools\magarimasu2_audio"
for f in os.listdir(audio_src_dir):
    if f.endswith('.wav'):
        shutil.copy2(os.path.join(audio_src_dir, f), os.path.join(target_assets_audio, f))
        shutil.copy2(os.path.join(audio_src_dir, f), os.path.join(r"public/assets", f))

print("Copied all audios to quiz assets and public/assets.")

# 4. Baca raw extracted dan whisper
with open('tools/magarimasu2_raw_extracted.json', 'r', encoding='utf-8') as f:
    raw_qs = json.load(f)

with open('tools/magarimasu2_whisper.json', 'r', encoding='utf-8') as f:
    whisper_data = json.load(f)

# Peta Audio ke Choukai
audio_map = {
    29: ("assets/c1.wav", whisper_data.get("c1.wav", "")),
    30: ("assets/c2.wav", whisper_data.get("c2.wav", "")),
    31: ("assets/c3.wav", whisper_data.get("c3.wav", "")),
    32: ("assets/c4.wav", whisper_data.get("c4.wav", "")),
    33: ("assets/c5.wav", whisper_data.get("c5.wav", "")),
    34: ("assets/c5.wav", whisper_data.get("c5.wav", "")),
    35: ("assets/c6.wav", whisper_data.get("c6.wav", "")),
    36: ("assets/c6.wav", whisper_data.get("c6.wav", "")),
    37: ("assets/c7.wav", whisper_data.get("c7.wav", "")),
    38: ("assets/c8.wav", whisper_data.get("c8.wav", "")),
    39: ("assets/c8.wav", whisper_data.get("c8.wav", "")),
    40: ("assets/c9.wav", whisper_data.get("c9.wav", "")),
}

# Peta Gambar
image_map = {
    1: "assets/m1.jpg",
    2: "assets/m2.jpg",
    3: "assets/m3.png",
    4: "assets/m4.jpg",
    15: "assets/h1.png",
    16: "assets/h2.jpg",
    17: "assets/h3.png",
    41: "assets/d1.png",
    42: "assets/d2.png",
    43: "assets/d3.png",
    44: "assets/d4.png",
    45: "assets/d5.png",
    46: "assets/d6.png",
    47: "assets/d7.png",
    48: "assets/d8.png",
    49: "assets/d9.png",
    50: "assets/d10.png",
}

final_qs = []
for q in raw_qs:
    no = q['no']
    sec = q['section']
    item = {
        "no": no,
        "section": sec,
        "title": q['title'],
        "options": q['options'],
        "answer": q['answer'],
        "salah": "Pilihan lain tidak cocok dengan kaidah tata bahasa / isi wacana dan kunci jawaban resmi.",
        "analisis": q['analisis'],
        "opt_detail": q['opt_detail'],
        "opt_note": q['opt_note'],
        "mnn": q['mnn'],
        "trans": q['konteks'] if q['konteks'] else q['title'].replace('\n', ' ')[:80]
    }
    
    # Isi kunci_id
    opt = q['options'][q['answer']] if 0 <= q['answer'] < len(q['options']) else {}
    item['kunci_id'] = opt.get('text', '')
    
    # Tambahkan gambar jika ada
    if no in image_map:
        item['image'] = image_map[no]
        item['img'] = image_map[no]
        
    # Tambahkan audio & transkrip percakapan jika Choukai
    if no in audio_map:
        audio_file, script = audio_map[no]
        item['audio'] = audio_file
        # Format title dengan transkrip percakapan jepang + pertanyaan
        orig_q = q['title'].replace('\n', ' ').strip()
        item['title'] = f"{script}\n\n● {orig_q}"
        item['trans'] = f"Percakapan audio Choukai: {orig_q}"

    final_qs.append(item)

out_json = os.path.join(target_quiz_dir, "quiz-data.json")
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(final_qs, f, ensure_ascii=False, indent=2)

print(f"Built {len(final_qs)} questions for Magarimasu 2 at {out_json}!")
