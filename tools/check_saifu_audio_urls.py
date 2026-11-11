import email, re
from email import policy

fpath = r'D:\sinaujepang\_arsip\des-jan\saifu\3.mhtml'
with open(fpath, 'rb') as fp:
    msg = email.message_from_binary_file(fp, policy=policy.default)
for p in msg.walk():
    if 'text/html' in p.get_content_type():
        html = p.get_payload(decode=True).decode('utf-8', errors='replace')
        break

urls = re.findall(r'https?://[^\s\"\'<>]+', html)
audio_urls = [u for u in urls if any(k in u for k in ['drive', 'audio', 'mp3', 'wav', 'm4a', 'docs.google.com/uc'])]
print(f"Audio URLs found: {len(audio_urls)}")
for u in set(audio_urls):
    print(" ", u)
