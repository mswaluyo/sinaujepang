import quopri, re
from bs4 import BeautifulSoup

with open(r'D:\sinaujepang\_arsip\des-jan\saifu\1.mhtml', 'rb') as fp:
    content = fp.read()

parts = content.split(b'------MultipartBoundary')
for p in parts:
    if b'Content-Type: text/html' in p:
        headers, body = p.split(b'\r\n\r\n', 1)
        html = quopri.decodestring(body).decode('utf-8', errors='replace')
        soup = BeautifulSoup(html, 'html.parser')
        print("Page Title:", soup.title.string if soup.title else "")
        # Google Form questions usually in div with role="listitem" or test question spans
        questions = []
        for div in soup.find_all('div', role='listitem'):
            title_el = div.find('div', role='heading')
            if title_el:
                questions.append(title_el.get_text(strip=True))
        print(f"Found {len(questions)} questions in 1.mhtml:")
        for q in questions[:10]:
            print("  *", q)
        break
