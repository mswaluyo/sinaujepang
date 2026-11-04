import email, re, json
from bs4 import BeautifulSoup

with open(r'D:\soal-jft\_arsip\gakusei2\kunci.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)
    for part in msg.walk():
        if part.get_content_type() == 'text/html':
            html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')

cards = soup.find_all('div', class_='card')
print(f"Cards found: {len(cards)}")

questions_data = []

for idx, card in enumerate(cards):
    text_all = card.get_text(separator='\n', strip=True)
    if 'Jawaban Benar' not in text_all and 'Kunci' not in text_all:
        continue
    
    # header / category / number
    badge = card.find('span', class_=re.compile(r'badge', re.I))
    badge_text = badge.get_text(strip=True) if badge else ""
    
    # images inside card
    imgs = [img['src'] for img in card.find_all('img') if img.get('src')]
    
    # options
    options = []
    # check list-group or option containers
    opt_items = card.find_all(['li', 'div'], class_=re.compile(r'list-group-item|option', re.I))
    for opt in opt_items:
        options.append(opt.get_text(separator=' ', strip=True))
        
    questions_data.append({
        'index': len(questions_data) + 1,
        'badge': badge_text,
        'imgs': imgs,
        'raw_text': text_all,
        'options': options
    })

with open(r'D:\soal-jft\tools\kunci_structured.json', 'w', encoding='utf-8') as f:
    json.dump(questions_data, f, ensure_ascii=False, indent=2)

print(f"Parsed {len(questions_data)} structured questions saved to tools/kunci_structured.json")

