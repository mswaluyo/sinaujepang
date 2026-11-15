import email, re, json, os, sys
from email import policy
from bs4 import BeautifulSoup

def parse_with_raw_decode(s):
    if s.startswith('%.@.'): s = s[4:]
    dec = json.JSONDecoder()
    obj, idx = dec.raw_decode(s)
    return obj

def build_package_pipeline(pkg_name):
    base_dir = rf'D:\sinaujepang\_arsip\des-jan\{pkg_name}'
    target_quiz_dir = rf'public\quizzes\{pkg_name}-quiz'
    target_assets_dir = os.path.join(target_quiz_dir, 'assets')
    os.makedirs(target_assets_dir, exist_ok=True)
    
    print(f"=== PROCESSING {pkg_name.upper()} ===")
    
    # 1. Parse kunci.mhtml to get 100% verified keys
    kc_path = os.path.join(base_dir, 'kunci.mhtml')
    with open(kc_path, 'rb') as fp:
        kc_msg = email.message_from_binary_file(fp, policy=policy.default)
    
    kc_html = ''
    for p in kc_msg.walk():
        if 'text/html' in p.get_content_type():
            kc_html = p.get_payload(decode=True).decode('utf-8', errors='replace')
            break
            
    kc_soup = BeautifulSoup(kc_html, 'html.parser')
    kc_items = kc_soup.find_all('div', role='listitem')
    
    kunci_list = []
    for it in kc_items:
        h = it.find('div', role='heading')
        if not h: continue
        txt = h.get_text(' ', strip=True)
        if '📌' in txt or 'pasword' in txt.lower(): continue
        if ('sesi i' in txt.lower() or 'sesi 1' in txt.lower() or 'sesi 2' in txt.lower() or 'sesi 3' in txt.lower() or 'sesi 4' in txt.lower()) and 'poin' in txt.lower() and len(txt) < 35: continue
        
        jb = ''
        labels = [l.get_text(' ', strip=True) for l in it.find_all('label')]
        radios = it.find_all('div', role='radio')
        checked_idx = -1
        for idx, r in enumerate(radios):
            if r.get('aria-checked') == 'true':
                checked_idx = idx
                break
        
        is_user_correct = bool(it.find('div', attrs={'aria-label': 'Benar'}))
        if is_user_correct and checked_idx != -1 and checked_idx < len(labels):
            jb = labels[checked_idx]
        else:
            m = re.search(r'Jawaban yang benar\s*\n*([^\n\r]+)', it.get_text('\n', strip=True))
            if m:
                jb = m.group(1).strip()
            elif checked_idx != -1 and checked_idx < len(labels):
                jb = labels[checked_idx]
                
        # Check score text
        score_val = "0/4"
        score_el = it.find('div', attrs={'role': 'note'})
        if score_el and '/' in score_el.get_text():
            score_val = score_el.get_text(strip=True)
        
        kunci_list.append({
            'title': txt,
            'key': jb,
            'labels': labels,
            'score': score_val
        })
    print(f"Kunci items extracted: {len(kunci_list)}")
    
    # 2. Extract media and parse questions from 1.mhtml to 4.mhtml
    sections_config = [
        ('1.mhtml', 'SESI 1 : MOJIGOI', 'Mojigoi'),
        ('2.mhtml', 'SESI 2 : HYOUGEN', 'Hyougen'),
        ('3.mhtml', 'SESI 3 : CHOUKAI', 'Choukai'),
        ('4.mhtml', 'SESI 4 : DOKKAI', 'Dokkai')
    ]
    
    questions_list = []
    global_img_count = 0
    
    for fname, sname, mnn in sections_config:
        fpath = os.path.join(base_dir, fname)
        with open(fpath, 'rb') as fp:
            msg = email.message_from_binary_file(fp, policy=policy.default)
            
        img_map = {}
        prefix = fname.replace('.mhtml', '')
        for part in msg.walk():
            ctype = part.get_content_type()
            if ctype.startswith('image/'):
                global_img_count += 1
                loc = part.get('Content-Location', '')
                cid = part.get('Content-ID', '')
                ext = ctype.split('/')[-1]
                if ext == 'jpeg': ext = 'jpg'
                img_name = f"{prefix}_img_{global_img_count}.{ext}"
                out_path = os.path.join(target_assets_dir, img_name)
                with open(out_path, 'wb') as img_out:
                    img_out.write(part.get_content())
                if loc: img_map[loc] = img_name
                if cid: img_map[cid.strip('<>')] = img_name
                
        html = ''
        for p in msg.walk():
            if 'text/html' in p.get_content_type():
                html = p.get_payload(decode=True).decode('utf-8', errors='replace')
                break
                
        soup = BeautifulSoup(html, 'html.parser')
        divs = soup.find_all('div', attrs={'data-params': True})
        
        for div in divs:
            try:
                obj = parse_with_raw_decode(div['data-params'])
                q_title = obj[1] if obj[1] else ''
                opts_data = []
                if len(obj) > 4 and obj[4] and len(obj[4]) > 0 and obj[4][0] and len(obj[4][0]) > 1 and obj[4][0][1]:
                    for row in obj[4][0][1]:
                        if row:
                            txt = row[0] if row[0] else ''
                            opts_data.append(txt)
                            
                # Radio images
                radio_imgs = []
                for r_div in div.find_all('label'):
                    imgs = [img_map.get(im.get('src'), '') for im in r_div.find_all('img')]
                    imgs = [im for im in imgs if im]
                    if imgs:
                        radio_imgs.append(imgs[0])
                        
                # Question body images
                q_body_imgs = []
                for im in div.find_all('img'):
                    mapped = img_map.get(im.get('src'), '')
                    if mapped and mapped not in radio_imgs and mapped not in q_body_imgs and 'googlelogo' not in mapped:
                        q_body_imgs.append(mapped)
                        
                questions_list.append({
                    'section': sname,
                    'mnn': mnn,
                    'title_raw': q_title,
                    'options_text': opts_data,
                    'radio_imgs': radio_imgs,
                    'q_imgs': q_body_imgs
                })
            except Exception as e:
                print(f"Error parsing item in {fname}: {e}")
                
    print(f"Questions parsed from 1-4.mhtml: {len(questions_list)}")
    
    # 3. Align and construct final JSON
    total_q = min(len(questions_list), len(kunci_list))
    final_quiz_data = []
    
    for i in range(total_q):
        q = questions_list[i]
        k = kunci_list[i]
        no = i + 1
        
        clean_title = q['title_raw']
        clean_title = re.sub(r'^\d+[\.\、\s]*', '', clean_title)
        clean_title = re.sub(r'\*.*$', '', clean_title).strip()
        
        # Options
        raw_opts = [o.strip() for o in q['options_text'] if o.strip()]
        
        # Determine correct answer index
        key_text = k['key'].strip()
        # Clean key_text punctuation
        clean_key = re.sub(r'^[^\w\s]+', '', key_text).strip()
        
        # Match option
        ans_idx = -1
        for o_idx, opt in enumerate(raw_opts):
            if opt == key_text or opt in key_text or key_text in opt:
                ans_idx = o_idx
                break
        if ans_idx == -1 and raw_opts:
            # try fuzzy match
            for o_idx, opt in enumerate(raw_opts):
                o_clean = re.sub(r'[\s\.\、\/\(\)]+', '', opt)
                k_clean = re.sub(r'[\s\.\、\/\(\)]+', '', key_text)
                if o_clean and k_clean and (o_clean in k_clean or k_clean in o_clean):
                    ans_idx = o_idx
                    break
        if ans_idx == -1:
            ans_idx = 0 # fallback
            
        # Build options object
        options_obj = []
        for o_idx, opt_str in enumerate(raw_opts):
            opt_img = ""
            if o_idx < len(q['radio_imgs']):
                opt_img = f"assets/{q['radio_imgs'][o_idx]}"
            options_obj.append({
                'text': opt_str,
                'img': opt_img
            })
            
        # If options_obj is empty (e.g. Dokkai single stimulus), generate multiple choices
        if len(options_obj) == 0 and len(k['labels']) > 0:
            for l_str in k['labels']:
                options_obj.append({'text': l_str, 'img': ''})
            for o_idx, opt in enumerate(options_obj):
                if opt['text'] == key_text:
                    ans_idx = o_idx
                    break
                    
        # Question image
        main_img = ""
        if q['q_imgs']:
            main_img = f"assets/{q['q_imgs'][0]}"
            
        # Detail analysis generator
        opt_detail = []
        for o_idx, opt in enumerate(options_obj):
            is_ok = (o_idx == ans_idx)
            opt_text = opt['text'] or '(Gambar Pilihan)'
            opt_detail.append({
                'kana': opt_text,
                'rom': '',
                'arti': opt_text,
                'alasan': 'Jawaban tepat sesuai kunci dan konteks soal.' if is_ok else 'Bukan pilihan yang tepat sesuai konteks kalimat/gambar.'
            })
            
        item_obj = {
            "no": no,
            "section": q['section'],
            "title": clean_title,
            "img": main_img,
            "audio": "",
            "options": options_obj,
            "answer": ans_idx,
            "score": k['score'],
            "trans": clean_title if clean_title else "Perhatikan konteks kalimat/gambar pada soal.",
            "trans_rom": "-",
            "mnn": q['mnn'],
            "analisis": f"[{q['mnn']}] Pembahasan untuk pertanyaan nomor {no}. Pilihan yang tepat adalah {key_text}.",
            "opt_detail": opt_detail,
            "opt_note": [o['text'] for o in options_obj],
            "kunci_id": key_text,
            "salah": "Pilihan lain tidak cocok dengan konteks soal atau kunci jawaban resmi."
        }
        final_quiz_data.append(item_obj)
        
    out_json_path = os.path.join(target_quiz_dir, 'quiz-data.json')
    with open(out_json_path, 'w', encoding='utf-8') as f_out:
        json.dump(final_quiz_data, f_out, indent=2, ensure_ascii=False)
        
    print(f"SUCCESS: Generated {len(final_quiz_data)} questions in {out_json_path}")
    return len(final_quiz_data)

if __name__ == '__main__':
    pkg = sys.argv[1] if len(sys.argv) > 1 else 'jitensha'
    build_package_pipeline(pkg)
