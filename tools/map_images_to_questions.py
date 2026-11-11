import quopri, re, json, os, email
from email import policy
from bs4 import BeautifulSoup

def map_images_in_file(fname):
    fpath = os.path.join(r'D:\sinaujepang\_arsip\des-jan\saifu', fname)
    with open(fpath, 'rb') as fp:
        msg = email.message_from_binary_file(fp, policy=policy.default)
    
    # map part cid/location to image bytes or index
    img_map = {}
    idx = 0
    for part in msg.walk():
        ctype = part.get_content_type()
        if ctype.startswith('image/'):
            idx += 1
            loc = part.get('Content-Location', '')
            cid = part.get('Content-ID', '')
            ext = ctype.split('/')[-1]
            if ext == 'jpeg': ext = 'jpg'
            img_name = f"{fname.replace('.mhtml','')}_img_{idx}.{ext}"
            if loc: img_map[loc] = img_name
            if cid: 
                clean_cid = cid.strip('<>')
                img_map[f"cid:{clean_cid}"] = img_name
                img_map[cid] = img_name
    
    # parse html
    html = ''
    for part in msg.walk():
        if 'text/html' in part.get_content_type():
            payload = part.get_payload(decode=True)
            html = payload.decode('utf-8', errors='replace')
            break
            
    soup = BeautifulSoup(html, 'html.parser')
    items = soup.find_all('div', role='listitem')
    
    q_mapped = []
    for div in items:
        h = div.find('div', role='heading')
        if not h: continue
        h_txt = h.get_text(" ", strip=True)
        if 'SESI' in h_txt or 'pasword' in h_txt.lower(): continue
        
        # find img
        imgs = div.find_all('img')
        mapped_imgs = []
        for im in imgs:
            src = im.get('src', '')
            if src in img_map:
                mapped_imgs.append(img_map[src])
            else:
                mapped_imgs.append(src)
                
        q_mapped.append({
            "heading": h_txt,
            "images": mapped_imgs
        })
    return q_mapped

for f in ['1.mhtml', '2.mhtml', '3.mhtml', '4.mhtml']:
    mapped = map_images_in_file(f)
    print(f"=== {f} ===")
    for idx, q in enumerate(mapped):
        if q['images']:
            print(f"  Q{idx+1}: {q['heading'][:30]} -> {q['images']}")
