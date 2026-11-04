import email, re, json
from bs4 import BeautifulSoup

with open(r'D:\soal-jft\_arsip\gakusei2\kunci.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)
    for part in msg.walk():
        if part.get_content_type() == 'text/html':
            html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')

items = []
# Each question card usually has class card, question-card, or similar
# Let's inspect all tables or card divs
cards = soup.find_all('div', class_=re.compile(r'card|soal-item|question', re.I))
print(f"Total card elements: {len(cards)}")

# Let's write out text of questions to inspect structure
with open(r'D:\soal-jft\tools\kunci_dump_all.txt', 'w', encoding='utf-8') as out:
    for idx, card in enumerate(cards):
        txt = card.get_text(separator='\n', strip=True)
        if 'Jawaban Benar' in txt or 'Pembahasan' in txt or 'Kunci' in txt or re.search(r'Soal\s*(?:No\.?)?\s*\d+', txt, re.I):
            out.write(f"=== CARD {idx} ===\n{txt}\n\n")

print("Dumped to tools/kunci_dump_all.txt")

