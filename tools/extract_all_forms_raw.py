import email, re, json, os
from email import policy
from bs4 import BeautifulSoup

def parse_with_raw_decode(s):
    if s.startswith('%.@.'): s = s[4:]
    dec = json.JSONDecoder()
    obj, idx = dec.raw_decode(s)
    return obj

all_parsed = []

for fname, sname, mnn in [
    ('1.mhtml', 'SESI 1 : MOJIGOI', 'Mojigoi'),
    ('2.mhtml', 'SESI 2 : HYOUGEN', 'Hyougen'),
    ('3.mhtml', 'SESI 3 : CHOUKAI', 'Choukai'),
    ('4.mhtml', 'SESI 4 : DOKKAI', 'Dokkai')
]:
    fpath = f'D:/sinaujepang/_arsip/des-jan/saifu/{fname}'
    with open(fpath, 'rb') as fp:
        msg = email.message_from_binary_file(fp, policy=policy.default)
    
    img_map = {}
    idx = 0
    prefix = fname.replace('.mhtml', '')
    for part in msg.walk():
        ctype = part.get_content_type()
        if ctype.startswith('image/'):
            idx += 1
            loc = part.get('Content-Location', '')
            cid = part.get('Content-ID', '')
            ext = ctype.split('/')[-1]
            if ext == 'jpeg': ext = 'jpg'
            img_name = f"{prefix}_img_{idx}.{ext}"
            if loc: img_map[loc] = img_name
            if cid: img_map[cid.strip('<>')] = img_name

    for p in msg.walk():
        if 'text/html' in p.get_content_type():
            html = p.get_payload(decode=True).decode('utf-8', errors='replace')
            break
            
    soup = BeautifulSoup(html, 'html.parser')
    divs = soup.find_all('div', attrs={'data-params': True})
    for i, div in enumerate(divs):
        dp = div['data-params']
        try:
            obj = parse_with_raw_decode(dp)
            q_title = obj[1] if obj[1] else ''
            opts_data = []
            
            # Check options in data-params
            if len(obj) > 4 and obj[4] and len(obj[4]) > 0 and obj[4][0] and len(obj[4][0]) > 1 and obj[4][0][1]:
                for row_idx, row in enumerate(obj[4][0][1]):
                    if row:
                        txt = row[0] if row[0] else ''
                        opts_data.append(txt)
            
            # Check images inside radio labels
            radio_imgs = []
            for r_div in div.find_all('label'):
                imgs = [img_map.get(im.get('src'), im.get('src')) for im in r_div.find_all('img')]
                if imgs:
                    radio_imgs.append(imgs[0])
            
            # Question image (outside radio buttons)
            # Find images in question body
            q_body_imgs = []
            # Find all images in div that are NOT in radio labels
            for im in div.find_all('img'):
                mapped = img_map.get(im.get('src'), im.get('src'))
                if mapped not in radio_imgs and mapped not in q_body_imgs and 'googlelogo' not in mapped:
                    q_body_imgs.append(mapped)

            all_parsed.append({
                "source_file": fname,
                "section": sname,
                "mnn": mnn,
                "title_raw": q_title,
                "options_text": opts_data,
                "radio_imgs": radio_imgs,
                "q_imgs": q_body_imgs
            })
        except Exception as e:
            print(f"Error {fname} item {i}: {e}")

print(f"Total all_parsed questions: {len(all_parsed)}")
with open('tools/saifu_all_forms_raw.json', 'w', encoding='utf-8') as f:
    json.dump(all_parsed, f, indent=2, ensure_ascii=False)
