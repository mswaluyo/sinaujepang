import quopri
from bs4 import BeautifulSoup

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    raw = f.read()

boundary = b"----MultipartBoundary--ReRqCJktJAZOk0JwdoeIpfNGKWeuoY973klldgEkMf----"
parts = raw.split(boundary)

for p in parts:
    if b"Content-Type: text/html" in p:
        header_end = p.find(b"\r\n\r\n")
        body = p[header_end+4:]
        decoded = quopri.decodestring(body)
        soup = BeautifulSoup(decoded, 'html.parser')
        
        cards = soup.find_all(class_='soal-card')
        print(f"Cards found in c1.mhtml: {len(cards)}")
        
        # Check first 3 cards
        for i, c in enumerate(cards[:3]):
            no = c.get('data-nomor') or c.find(class_='soal-nomor')
            q = c.find(class_='soal-pertanyaan')
            opts = [o.get_text(' ', strip=True) for o in c.find_all(class_='opsi-item')]
            print(f"#{i+1} No: {no.get_text(strip=True) if hasattr(no, 'get_text') else no}")
            print(f"Pertanyaan: {q.get_text(strip=True) if q else ''}")
            print(f"Options: {opts}")
        break

