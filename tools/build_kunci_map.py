import quopri, re, json
from bs4 import BeautifulSoup

with open(r'D:\sinaujepang\_arsip\des-jan\saifu\kunci.mhtml', 'rb') as fp:
    raw = fp.read()
html = ''
for p in raw.split(b'------MultipartBoundary'):
    if b'Content-Type: text/html' in p:
        _, body = p.split(b'\r\n\r\n', 1)
        html = quopri.decodestring(body).decode('utf-8', errors='replace')
        break
        
soup = BeautifulSoup(html, 'html.parser')
items = soup.find_all('div', role='listitem')

parsed_kunci = []
current_sec = "SESI 1 : MOJIGOI"

for idx, div in enumerate(items):
    full_text = div.get_text(" ", strip=True)
    if "SESI 1 VB" in full_text:
        current_sec = "SESI 1 : MOJIGOI"
        continue
    elif "SESI II" in full_text and "SESI IIII" not in full_text and "SESI III" not in full_text:
        current_sec = "SESI 2 : HYOUGEN"
        continue
    elif "SESI III" in full_text and "SESI IIII" not in full_text:
        current_sec = "SESI 3 : CHOUKAI"
        continue
    elif "SESI IIII" in full_text:
        current_sec = "SESI 4 : DOKKAI"
        continue
        
    heading = div.find('div', role='heading')
    if not heading:
        continue
    h_text = heading.get_text(" ", strip=True)
    if 'pasword' in h_text.lower():
        continue
        
    clean_t = re.sub(r'\s*\*\d+/\d+.*$', '', h_text).strip()
    clean_t = re.sub(r'^\d+[\.\、\s]*', '', clean_t).strip()
    clean_t = re.sub(r'\*.*$', '', clean_t).strip()
    
    # options
    options = []
    for sp in div.find_all('span', class_='OIC90c'):
        t = sp.get_text(strip=True)
        if t and t not in options and t != 'Yang lain:':
            options.append(t)
            
    # determine correct answer
    # If "Jawaban yang benar" in full_text:
    correct = ""
    if "Jawaban yang benar" in full_text:
        m = re.search(r'Jawaban yang benar\s+(.*)', full_text)
        if m:
            correct = m.group(1).strip()
    elif "Benar" in full_text:
        # The option next to Benar or let's look at DOM
        # Let's inspect which option has "Benar"
        # In Google form: the radio row contains Benar
        # Let's search inside each option container
        for row in div.find_all('div', class_=re.compile(r'lLfZXe|nWQ3RF|k320Ce')):
            if "Benar" in row.get_text():
                sp = row.find('span', class_='OIC90c')
                if sp:
                    correct = sp.get_text(strip=True)
                    break
        if not correct:
            # fallback: regex
            # e.g. "さいふ Benar"
            m = re.search(r'([^\s]+)\s+Benar', full_text)
            if m:
                correct = m.group(1).strip()
                
    # score
    score_m = re.search(r'\*?(\d+/\d+)', h_text)
    score_val = score_m.group(1) if score_m else ""
    
    # check images in this question
    imgs = div.find_all('img')
    img_list = [img.get('src', '') for img in imgs if img.get('src')]
    
    parsed_kunci.append({
        "no": len(parsed_kunci) + 1,
        "section": current_sec,
        "title": clean_t,
        "options": options,
        "correct": correct,
        "score_val": score_val,
        "raw_text": full_text,
        "imgs": img_list
    })

print(f"Parsed {len(parsed_kunci)} questions:")
with open('tools/saifu_parsed_kunci.json', 'w', encoding='utf-8') as out_f:
    json.dump(parsed_kunci, out_f, indent=2, ensure_ascii=False)

for q in parsed_kunci:
    print(f"{q['no']}. [{q['section']}] {q['title'][:35]} | Kunci: {q['correct']} | Opts ({len(q['options'])}): {q['options']}")
