import email, re, os
from bs4 import BeautifulSoup

with open(r'D:\soal-jft\_arsip\gakusei2\c1.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)
    for part in msg.walk():
        if part.get_content_type() == 'text/html':
            html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            audio_btns = soup.find_all(attrs={'data-audio-src': True})
            with open(r'D:\soal-jft\tools\c1_audio_inspect.txt', 'w', encoding='utf-8') as out:
                for i, btn in enumerate(audio_btns):
                    parent_q = btn.find_parent('div', class_=re.compile(r'soal|question|item|card', re.I))
                    q_text = parent_q.get_text(separator=' | ', strip=True) if parent_q else "No parent"
                    out.write(f"=== Audio {i+1} ===\nSrc: {btn['data-audio-src']}\nContext: {q_text}\n\n")
print("Done writing to tools/c1_audio_inspect.txt")
