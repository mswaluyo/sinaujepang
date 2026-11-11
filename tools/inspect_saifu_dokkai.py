import quopri, re, json, os, email
from email import policy
from bs4 import BeautifulSoup

def inspect_dokkai():
    fpath = r'D:\sinaujepang\_arsip\des-jan\saifu\kunci.mhtml'
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
    # Dokkai starts around item 37-53
    for idx, it in enumerate(items[37:]):
        h = it.find('div', role='heading')
        h_txt = h.get_text(" ", strip=True) if h else ""
        print(f"[{idx+38}] {h_txt}")
        imgs = it.find_all('img')
        for im in imgs:
            print("    IMG:", im.get('src')[:60])
        spans = [s.get_text(strip=True) for s in it.find_all('span', class_='OIC90c')]
        print("    OPTS:", spans)
        print("    TEXT:", it.get_text(" | ", strip=True)[:150])

inspect_dokkai()
