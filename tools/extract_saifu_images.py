import quopri, re, os, email
from email import policy

base = r'D:\sinaujepang\_arsip\des-jan\saifu'
out_img_dir = r'tools\saifu_extracted_images'
os.makedirs(out_img_dir, exist_ok=True)

for fname in ['1.mhtml', '2.mhtml', '3.mhtml', '4.mhtml', 'kunci.mhtml']:
    fpath = os.path.join(base, fname)
    with open(fpath, 'rb') as fp:
        msg = email.message_from_binary_file(fp, policy=policy.default)
    img_idx = 0
    for part in msg.walk():
        ctype = part.get_content_type()
        if ctype.startswith('image/'):
            img_idx += 1
            ext = ctype.split('/')[-1]
            if ext == 'jpeg': ext = 'jpg'
            loc = part.get('Content-Location', '')
            cid = part.get('Content-ID', '')
            payload = part.get_content() # automatically decoded!
            out_name = f"{fname.replace('.mhtml','')}_img_{img_idx}.{ext}"
            with open(os.path.join(out_img_dir, out_name), 'wb') as img_out:
                img_out.write(payload)
    print(f"Extracted {img_idx} images from {fname}")
