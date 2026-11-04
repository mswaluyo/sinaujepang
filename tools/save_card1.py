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
        c1 = cards[0]
        
        with open('tools/c1_card1.html', 'w', encoding='utf-8') as out:
            out.write(str(c1.prettify()))
        print("Card 1 saved to tools/c1_card1.html")
        break

