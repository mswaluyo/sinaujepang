import email
import re

with open(r'_arsip\SHIMEMASU2\c1.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html = part.get_payload(decode=True).decode('utf-8', errors='replace')
        # find dokkai questions
        dokkai_parts = html.split('[ dokkai ]')
        print(f"Total [ dokkai ] sections: {len(dokkai_parts)}")
        for idx, dp in enumerate(dokkai_parts[1:], 1):
            img_m = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', dp)
            clean_txt = re.sub(r'<[^>]+>', ' ', dp[:150]).strip()
            print(f"Dokkai #{idx}: img={img_m[:1]}, text={clean_txt[:100]}")
        break

