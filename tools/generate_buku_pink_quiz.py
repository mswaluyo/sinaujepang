import email, os, sys, re, json
from email import policy
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

path = r'D:\soal-jft\_arsip\SSW\soal buku pink.mhtml'

with open(path, 'rb') as fp:
    msg = email.message_from_binary_file(fp, policy=policy.default)

img_dir = r'public\assets\images\ssw-buku-pink'
os.makedirs(img_dir, exist_ok=True)

# Map part locations
parts_by_loc = {}
parts_by_cid = {}

for idx, part in enumerate(msg.walk()):
    ctype = part.get_content_type()
    if ctype.startswith('image/'):
        cloc = part.get('Content-Location', '')
        cid = part.get('Content-ID', '').strip('<>')
        ext = ctype.split('/')[-1]
        if ext == 'jpeg': ext = 'jpg'
        
        fname = f'pink_{idx}.{ext}'
        out_p = os.path.join(img_dir, fname)
        with open(out_p, 'wb') as f:
            f.write(part.get_payload(decode=True))
            
        web_p = f'/assets/images/ssw-buku-pink/{fname}'
        if cloc: parts_by_loc[cloc] = web_p
        if cid: parts_by_cid[cid] = web_p

html_part = None
for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html_part = part
        break

payload = html_part.get_payload(decode=True)
soup = BeautifulSoup(payload.decode('utf-8', errors='ignore'), 'html.parser')
items = soup.find_all(attrs={'role': 'listitem'})

quiz_data = []

for idx, item in enumerate(items):
    q_num = idx + 1
    
    # 1. Images
    imgs = item.find_all('img')
    img_urls = []
    for img in imgs:
        src = img.get('src', '')
        mapped = parts_by_loc.get(src) or parts_by_cid.get(src)
        if mapped:
            img_urls.append(mapped)
            
    # 2. Text parsing
    text = item.get_text(separator='\n')
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    
    # Clean score markers
    clean_lines = [l for l in lines if not re.match(r'^\d+/\d+$', l)]
    
    # Title
    q_title = clean_lines[0]
    if len(clean_lines) > 1 and '【問題】' in clean_lines[1]:
        q_title += ' ' + clean_lines[1]
    elif '【問題】' not in q_title and len(clean_lines) > 1 and not re.match(r'^[A-Da-d][\.\s]', clean_lines[1]):
        q_title += ' ' + clean_lines[1]
    q_title = re.sub(r'^\d+[\.\s\xa0]+\s*', '', q_title).strip()

    correct_str = ""
    for i, l in enumerate(lines):
        if "Jawaban yang benar" in l:
            if ":" in l:
                correct_str = l.split(":", 1)[1].strip()
            elif i + 1 < len(lines):
                correct_str = lines[i+1].strip()
        elif l == "Benar" and i > 0:
            correct_str = lines[i-1].strip()

    # If lines have letter prefixes
    letter_opts = [l for l in lines if re.match(r'^[A-D][\.\s\u3000]?', l)]
    
    if len(letter_opts) >= 3:
        seen = set()
        final_options = []
        for l in letter_opts:
            m = re.match(r'^([A-D])[\.\s\u3000]?\s*(.*)', l)
            if m:
                let = m.group(1).upper()
                if let not in seen:
                    seen.add(let)
                    final_options.append({"letter": let, "text": l})
        final_options.sort(key=lambda x: x["letter"])
    else:
        opt_cands = []
        skip_words = ['【問題】', 'Benar', 'Salah', 'Jawaban yang benar', 'soal buku pink', 'Poin total']
        for l in lines:
            if any(w in l for w in skip_words) or re.match(r'^\d+[\.\s]', l) or re.match(r'^\d+/\d+$', l):
                continue
            if l not in opt_cands:
                opt_cands.append(l)
                
        letters = ['A', 'B', 'C', 'D']
        final_options = []
        for i, cand in enumerate(opt_cands[:4]):
            let = letters[i]
            final_options.append({
                "letter": let,
                "text": f"{let}. {cand}"
            })

    if q_num == 3 and not correct_str:
        correct_str = "A.杖 (つえ)、右足 (みぎあし)、左足 (ひだりあし)ですよ"

    # Match correct index
    correct_idx = 0
    kunci_id_text = ""
    
    for i, opt in enumerate(final_options):
        opt_core = re.sub(r'^[A-D][\.\s\u3000]?\s*', '', opt["text"]).strip()
        correct_core = re.sub(r'^[A-D][\.\s\u3000]?\s*', '', correct_str).strip()
        if (opt_core and opt_core in correct_str) or (correct_core and correct_core in opt["text"]):
            correct_idx = i
            kunci_id_text = opt["text"]
            break
            
    if not kunci_id_text:
        m_let = re.match(r'^([A-D])', correct_str)
        if m_let:
            target_let = m_let.group(1).upper()
            for i, opt in enumerate(final_options):
                if opt["letter"] == target_let:
                    correct_idx = i
                    kunci_id_text = opt["text"]
                    break

    if not kunci_id_text and final_options:
        kunci_id_text = final_options[0]["text"]

    formatted_opts = []
    opt_note = []
    opt_detail = []
    for opt in final_options:
        formatted_opts.append({"text": opt["text"], "img": ""})
        opt_note.append(f"({opt['text'][:25]}...)")
        opt_detail.append({
            "kana": opt["text"],
            "rom": "",
            "arti": opt["text"],
            "alasan": "Opsi evaluasi Kaigo Nihongo (Buku Pink)"
        })

    primary_img = img_urls[0] if img_urls else ""

    q_obj = {
        "no": q_num,
        "section": "SSW KAIGO NIHONGO (BUKU PINK)",
        "mnn": f"SSW Buku Pink ({q_num})",
        "title": q_title,
        "image": primary_img,
        "options": formatted_opts,
        "answer": correct_idx,
        "kunci_id": kunci_id_text,
        "salah": "Pilihan ini tidak sesuai dengan dialog atau dokumen perawatan Buku Pink.",
        "analisis": f"Berdasarkan percakapan situasi lapangan perawatan lansia (介護の日本語), jawaban yang benar adalah **{kunci_id_text}**.",
        "opt_note": opt_note,
        "opt_detail": opt_detail,
        "pembahasan": [
            {
                "title": f"Materi Percakapan & Kosakata Lapangan (Soal {q_num})",
                "desc": "Menganalisis komunikasi efektif dan instruksi kerja keperawatan lansia."
            }
        ]
    }
    quiz_data.append(q_obj)

target_dir = r"public\quizzes\ssw-kaigo-nihongo-bukupink-quiz"
os.makedirs(target_dir, exist_ok=True)
out_file = os.path.join(target_dir, "quiz-data.json")

with open(out_file, "w", encoding="utf-8") as f:
    json.dump(quiz_data, f, ensure_ascii=False, indent=2)

print(f"Successfully processed all {len(quiz_data)} questions in {out_file}!")
