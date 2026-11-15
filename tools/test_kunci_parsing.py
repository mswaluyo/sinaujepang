import os, sys, json, quopri, re, base64
from bs4 import BeautifulSoup

def extract_mhtml(mhtml_path):
    with open(mhtml_path, 'rb') as fp:
        raw = fp.read()
    parts = raw.split(b'------MultipartBoundary')
    html = ''
    media = {}
    for p in parts:
        if b'Content-Type: text/html' in p:
            hdrs, body = p.split(b'\r\n\r\n', 1)
            html = quopri.decodestring(body).decode('utf-8', errors='replace')
        elif b'Content-Location:' in p:
            try:
                hdrs, body = p.split(b'\r\n\r\n', 1)
                m = re.search(rb'Content-Location:\s*([^\r\n]+)', hdrs)
                if m:
                    loc = m.group(1).decode('utf-8', errors='ignore').strip()
                    # check encoding
                    if b'Content-Transfer-Encoding: base64' in hdrs:
                        media[loc] = base64.b64decode(body)
                    elif b'Content-Transfer-Encoding: quoted-printable' in hdrs:
                        media[loc] = quopri.decodestring(body)
                    else:
                        media[loc] = body
            except Exception as e:
                pass
    return html, media

def parse_package(pkg_name):
    base_dir = os.path.join(r'D:\sinaujepang\_arsip\des-jan', pkg_name)
    quiz_dir = os.path.join(r'public\quizzes', f'{pkg_name}-quiz')
    assets_dir = os.path.join(quiz_dir, 'assets')
    os.makedirs(assets_dir, exist_ok=True)
    
    # 1. Parse kunci.mhtml to get correct answers and score
    kc_html, kc_media = extract_mhtml(os.path.join(base_dir, 'kunci.mhtml'))
    kc_soup = BeautifulSoup(kc_html, 'html.parser')
    kc_items = kc_soup.find_all('div', role='listitem')
    
    kunci_data = []
    for it in kc_items:
        h = it.find('div', role='heading')
        if not h: continue
        title_raw = h.get_text(' ', strip=True)
        if '📌' in title_raw or 'pasword' in title_raw.lower(): continue
        if ('sesi i' in title_raw.lower() or 'sesi 1' in title_raw.lower() or 'sesi 2' in title_raw.lower() or 'sesi 3' in title_raw.lower() or 'sesi 4' in title_raw.lower()) and 'poin' in title_raw.lower() and len(title_raw) < 35:
            continue
        
        full_text = it.get_text(' ', strip=True)
        
        # Check correct answer in text
        # Patterns in Google Form kunci:
        # "Jawaban yang benar [answer]" or "... Benar ..."
        correct_text = ""
        m_jb = re.search(r'Jawaban yang benar\s+(.*?)(?:\s*(?:Tanggapan|Feedback|$))', full_text)
        if m_jb:
            correct_text = m_jb.group(1).strip()
        else:
            # find option that has "Benar" next to it
            # e.g., "電車 自転車 自動車" or "たいふ さいふ Benar らいふ"
            m_b = re.search(r'([^\s]+)\s+Benar', full_text)
            if m_b:
                correct_text = m_b.group(1).strip()
        
        kunci_data.append({
            'heading': title_raw,
            'full_text': full_text,
            'correct_text': correct_text
        })
    
    print(f"[{pkg_name}] Parsed kunci: {len(kunci_data)} items")
    return kunci_data

if __name__ == '__main__':
    for pkg in ['jitensha', 'kudamono', 'kuroi', 'kutsushita', 'okimasu']:
        parse_package(pkg)
