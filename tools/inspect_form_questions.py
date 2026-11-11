import email, quopri, re, json, os
from bs4 import BeautifulSoup

def extract_form_sections():
    # 1.mhtml -> Sesi 1 (Mojigoi)
    # 2.mhtml -> Sesi 2 (Hyougen)
    # 3.mhtml -> Sesi 3 (Choukai)
    # 4.mhtml -> Sesi 4 (Dokkai)
    forms = [
        ('1.mhtml', 'SESI 1 : MOJIGOI', 'Mojigoi'),
        ('2.mhtml', 'SESI 2 : HYOUGEN', 'Hyougen'),
        ('3.mhtml', 'SESI 3 : CHOUKAI', 'Choukai'),
        ('4.mhtml', 'SESI 4 : DOKKAI', 'Dokkai')
    ]
    
    # Also extract kunci mapping
    kunci_path = r'D:\sinaujepang\_arsip\des-jan\saifu\kunci.mhtml'
    with open(kunci_path, 'rb') as fp:
        raw_kunci = fp.read()
    
    html_kunci = ''
    for p in raw_kunci.split(b'------MultipartBoundary'):
        if b'Content-Type: text/html' in p:
            _, body = p.split(b'\r\n\r\n', 1)
            html_kunci = quopri.decodestring(body).decode('utf-8', errors='replace')
            break
            
    soup_kunci = BeautifulSoup(html_kunci, 'html.parser')
    kunci_items = soup_kunci.find_all('div', role='listitem')
    
    # Store parsed questions
    all_questions = []
    
    for fname, section_title, mnn_type in forms:
        fpath = os.path.join(r'D:\sinaujepang\_arsip\des-jan\saifu', fname)
        with open(fpath, 'rb') as fp:
            raw = fp.read()
        html = ''
        for p in raw.split(b'------MultipartBoundary'):
            if b'Content-Type: text/html' in p:
                _, body = p.split(b'\r\n\r\n', 1)
                html = quopri.decodestring(body).decode('utf-8', errors='replace')
                break
        soup = BeautifulSoup(html, 'html.parser')
        items = soup.find_all('div', role='listitem')
        
        for item in items:
            heading = item.find('div', role='heading')
            if not heading:
                continue
            h_text = heading.get_text(" ", strip=True)
            if 'SESI' in h_text or 'pasword' in h_text.lower():
                continue
                
            # get clean title
            clean_t = re.sub(r'^\d+[\.\、\s]*', '', h_text)
            clean_t = re.sub(r'\*.*$', '', clean_t).strip()
            
            # get options
            opt_labels = []
            # In google form radio options:
            for opt_div in item.find_all('div', role='radio'):
                opt_labels.append(opt_div.get_text(" ", strip=True))
            if not opt_labels:
                # fallback: check span or label
                for span in item.find_all('span', dir='auto'):
                    t = span.get_text(" ", strip=True)
                    if t and t != h_text and len(t) < 100 and t not in opt_labels and t != 'Yang lain:':
                        opt_labels.append(t)
                        
            # get image
            imgs = item.find_all('img')
            img_src = ""
            if imgs:
                img_src = imgs[0].get('src', '')
                
            all_questions.append({
                "source_file": fname,
                "section": section_title,
                "mnn": mnn_type,
                "heading_raw": h_text,
                "title": clean_t,
                "options": opt_labels,
                "has_img": bool(img_src),
                "img_src": img_src
            })
            
    print(f"Total questions extracted from forms 1-4: {len(all_questions)}")
    for idx, q in enumerate(all_questions):
        print(f"{idx+1}. [{q['section']}] {q['title'][:40]} | Opts ({len(q['options'])}): {q['options'][:3]} | Img: {q['has_img']}")

extract_form_sections()
