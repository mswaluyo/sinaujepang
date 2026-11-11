import quopri, re, json, os, email
from email import policy
from bs4 import BeautifulSoup

def inspect_c3():
    fpath = r'D:\sinaujepang\_arsip\des-jan\saifu\3.mhtml'
    with open(fpath, 'rb') as fp:
        msg = email.message_from_binary_file(fp, policy=policy.default)
        
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
            img_name = f"3_img_{idx}.{ext}"
            if loc: img_map[loc] = img_name
            if cid:
                clean_cid = cid.strip('<>')
                img_map[f"cid:{clean_cid}"] = img_name
                img_map[cid] = img_name
                
    for part in msg.walk():
        if 'text/html' in part.get_content_type():
            payload = part.get_payload(decode=True)
            html = payload.decode('utf-8', errors='replace')
            break
            
    soup = BeautifulSoup(html, 'html.parser')
    for div in soup.find_all('div', role='listitem'):
        h = div.find('div', role='heading')
        if not h: continue
        h_txt = h.get_text(" ", strip=True)
        if 'SESI' in h_txt: continue
        print("="*50)
        print("QUESTION:", h_txt)
        # Look for options and their nested images
        radios = div.find_all('div', role='radio')
        if radios:
            for r_idx, r in enumerate(radios):
                r_txt = r.get_text(" ", strip=True)
                r_imgs = [img_map.get(im.get('src', ''), im.get('src', '')) for im in r.find_all('img')]
                print(f"  Opt {r_idx+1}: text='{r_txt}', imgs={r_imgs}")
        else:
            # check labels or spans
            for r_idx, opt_div in enumerate(div.find_all('label')):
                opt_txt = opt_div.get_text(" ", strip=True)
                opt_imgs = [img_map.get(im.get('src', ''), im.get('src', '')) for im in opt_div.find_all('img')]
                print(f"  Opt {r_idx+1}: text='{opt_txt}', imgs={opt_imgs}")

inspect_c3()
