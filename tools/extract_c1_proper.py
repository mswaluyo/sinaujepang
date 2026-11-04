import email, sys
from bs4 import BeautifulSoup

# Let's write an extractor for c1.mhtml with proper UTF-8 decoding and save to json
with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    if p.get_content_type() == 'text/html':
        payload = p.get_payload(decode=True)
        soup = BeautifulSoup(payload.decode('utf-8', errors='replace'), 'html.parser')
        cards = soup.find_all(class_='soal-card')
        
        with open('tools/c1_proper_preview.txt', 'w', encoding='utf-8') as out:
            for i, c in enumerate(cards[:10]):
                no = c.get('data-nomor') or i+1
                q = c.find(class_='soal-pertanyaan')
                q_txt = q.get_text(strip=True) if q else ''
                q_trans = c.find(class_='soal-terjemahan')
                q_trans_txt = q_trans.get_text(strip=True) if q_trans else ''
                img = c.find('img')
                img_src = img['src'] if img else ''
                
                opts = []
                for p_item in c.find_all(class_='pilihan-item'):
                    key = p_item.find(class_='pilihan-key').get_text(strip=True)
                    txt = p_item.find(class_='pilihan-text').get_text(strip=True)
                    trans = p_item.find(class_='pilihan-terjemahan')
                    trans_txt = trans.get_text(strip=True) if trans else ''
                    opts.append(f"{key}: {txt} {trans_txt}")
                    
                out.write(f"No: {no} | Img: {img_src}\n")
                out.write(f"Q: {q_txt} {q_trans_txt}\n")
                out.write(f"Options: {opts}\n")
                out.write("-" * 40 + "\n")
        print("Successfully wrote 10 cards to tools/c1_proper_preview.txt!")
        break

