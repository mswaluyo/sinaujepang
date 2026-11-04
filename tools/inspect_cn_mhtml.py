import email
import re

for n in range(1, 13):
    fn = rf'_arsip\SHIMEMASU2\c{n}.mhtml'
    try:
        with open(fn, 'rb') as fp:
            msg = email.message_from_binary_file(fp)
            for part in msg.walk():
                if part.get_content_type() == 'text/html':
                    html = part.get_payload(decode=True).decode('utf-8', errors='replace')
                    num_m = re.search(r'#(\d+)', html)
                    num_str = num_m.group(1) if num_m else '?'
                    # Look for questions or audio or images
                    imgs = re.findall(r'<img[^>]+src="([^">]+)"', html)
                    audios = re.findall(r'<audio[^>]+src="([^">]+)"', html)
                    print(f"c{n}.mhtml -> Soal #{num_str}, imgs={len(imgs)}, audios={len(audios)}")
                    break
    except Exception as e:
        print(f"c{n}.mhtml error: {e}")

