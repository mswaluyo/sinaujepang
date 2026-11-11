import quopri, re, json
from bs4 import BeautifulSoup

def inspect_kunci_structure():
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
    
    # Let's inspect item 2 (question 1) and item 13 (question 12)
    for idx in [2, 13, 15, 33, 38]:
        div = items[idx]
        print("="*50)
        print(f"ITEM {idx}:")
        print("Full Text:", div.get_text(" | ", strip=True))
        # let's look at child elements
        for child in div.descendants:
            if child.name in ['span', 'div'] and child.get('dir') == 'auto':
                t = child.get_text(strip=True)
                if t:
                    print(f"  [{child.name}] class={child.get('class')}: {t}")

inspect_kunci_structure()
