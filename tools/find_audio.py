import email
from email import policy
import os
import glob
from bs4 import BeautifulSoup

audio_set = set()
for m_path in glob.glob(r'_arsip\hare-new\*.mhtml'):
    base = os.path.basename(m_path)
    with open(m_path, 'rb') as fp:
        msg = email.message_from_binary_file(fp, policy=policy.default)
    for part in msg.walk():
        ct = part.get_content_type()
        cloc = part.get('Content-Location', '')
        if 'audio' in ct or any(cloc.endswith(ext) for ext in ['.mp3', '.m4a', '.wav', '.ogg']):
            audio_set.add((base, ct, cloc))

print('Found audio parts:', len(audio_set))
for a in audio_set:
    print(' ', a)

