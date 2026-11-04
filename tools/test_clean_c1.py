from bs4 import BeautifulSoup

with open('tools/c1_decoded_utf8.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

cards = soup.find_all(class_='soal-card')
print(f"Cards found in c1_decoded_utf8.html: {len(cards)}")

with open('tools/c1_clean_preview.txt', 'w', encoding='utf-8') as out:
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

print("Saved preview to tools/c1_clean_preview.txt")

