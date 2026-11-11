import email, quopri, re, json
from email import policy
from bs4 import BeautifulSoup

def parse_kunci(filepath):
    with open(filepath, 'rb') as fp:
        raw = fp.read()
    parts = raw.split(b'------MultipartBoundary')
    html = ''
    for p in parts:
        if b'Content-Type: text/html' in p:
            headers, body = p.split(b'\r\n\r\n', 1)
            html = quopri.decodestring(body).decode('utf-8', errors='replace')
            break
    
    soup = BeautifulSoup(html, 'html.parser')
    items = soup.find_all('div', role='listitem')
    results = []
    current_section = "SESI 1 : MOJIGOI"
    
    for idx, div in enumerate(items):
        text = div.get_text(" ", strip=True)
        # Check section headers
        if "SESI 1 VB" in text:
            current_section = "SESI 1 : MOJIGOI"
            continue
        elif "SESI II" in text and "SESI IIII" not in text and "SESI III" not in text:
            current_section = "SESI 2 : HYOUGEN"
            continue
        elif "SESI III" in text and "SESI IIII" not in text:
            current_section = "SESI 3 : CHOUKAI"
            continue
        elif "SESI IIII" in text:
            current_section = "SESI 4 : DOKKAI"
            continue
        
        heading_el = div.find('div', role='heading')
        if not heading_el:
            continue
        
        title_raw = heading_el.get_text(" ", strip=True)
        # remove trailing point like *5/5 or *0/4
        title_clean = re.sub(r'\s*\*\d+/\d+.*$', '', title_raw).strip()
        title_clean = re.sub(r'^\d+[\.\、\s]*', '', title_clean).strip()
        
        # Options and correct answer
        # In Google Form response view (kunci):
        # Correct answer usually has class or icon or 'Benar' text or 'Jawaban yang benar'
        # Let's see radio options or checkboxes
        options = []
        correct_ans = ""
        user_ans = ""
        
        # Find all option containers
        # Typically div with role="radio" or class containing option
        # Or let's inspect the text
        results.append({
            "idx": len(results) + 1,
            "section": current_section,
            "title_raw": title_raw,
            "title": title_clean,
            "div_text": text
        })
        
    print(f"Total parsed questions from kunci: {len(results)}")
    for r in results[:5]:
        print(f"[{r['section']}] No {r['idx']}: {r['title']}")
        print(f"   text snippet: {r['div_text'][:120]}")
    for r in results[12:16]:
        print(f"[{r['section']}] No {r['idx']}: {r['title']}")
        print(f"   text snippet: {r['div_text'][:120]}")

parse_kunci(r'D:\sinaujepang\_arsip\des-jan\saifu\kunci.mhtml')
