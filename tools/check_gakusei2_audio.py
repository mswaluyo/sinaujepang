import email, re, os, glob

for fpath in glob.glob(r'D:\soal-jft\_arsip\gakusei2\c*.mhtml'):
    fname = os.path.basename(fpath)
    with open(fpath, 'rb') as f:
        msg = email.message_from_binary_file(f)
        for part in msg.walk():
            ctype = part.get_content_type()
            loc = part.get('Content-Location', '')
            payload = part.get_payload(decode=True)
            if payload and ('audio' in ctype or 'audio' in loc or loc.endswith('.wav') or loc.endswith('.mp3')):
                print(f'{fname}: audio payload found, len={len(payload)}, loc={loc}, ctype={ctype}')
            elif payload and ctype == 'text/html':
                txt = payload.decode('utf-8', errors='ignore')
                audios = re.findall(r'data-audio-src=["\']([^"\']+)["\']', txt)
                audios2 = re.findall(r'<audio[^>]+src=["\']([^"\']+)["\']', txt)
                print(f'{fname} html: data-audio-src={audios}, audio_src={audios2}')

