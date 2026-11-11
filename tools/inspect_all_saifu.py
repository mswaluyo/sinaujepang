import quopri, re, os
from bs4 import BeautifulSoup

def inspect_mhtml(filepath):
    print("="*60)
    print("FILE:", os.path.basename(filepath))
    with open(filepath, 'rb') as fp:
        content = fp.read()
    parts = content.split(b'------MultipartBoundary')
    for p in parts:
        if b'Content-Type: text/html' in p:
            headers, body = p.split(b'\r\n\r\n', 1)
            html = quopri.decodestring(body).decode('utf-8', errors='replace')
            soup = BeautifulSoup(html, 'html.parser')
            items = soup.find_all('div', role='listitem')
            print(f"Total listitem: {len(items)}")
            for idx, div in enumerate(items):
                heading = div.find('div', role='heading')
                h_text = heading.get_text(strip=True) if heading else "NO_HEADING"
                # check if there is img
                imgs = div.find_all('img')
                img_srcs = [img.get('src') for img in imgs if img.get('src')]
                print(f"  [{idx+1}] {h_text[:60]} | imgs: {len(img_srcs)}")
            break

for f in ['1.mhtml', '2.mhtml', '3.mhtml', '4.mhtml', 'kunci.mhtml']:
    inspect_mhtml(os.path.join(r'D:\sinaujepang\_arsip\des-jan\saifu', f))
