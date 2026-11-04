import email
import re
from bs4 import BeautifulSoup
import json

kunci_path = r"D:\soal-jft\_arsip\gakusei2\kunci.mhtml"
with open(kunci_path, 'rb') as f:
    msg = email.message_from_binary_file(f)

html = ""
for part in msg.walk():
    if part.get_content_type() == 'text/html':
        html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
        break

soup = BeautifulSoup(html, "html.parser")
cards = soup.find_all("div", class_="review-soal-card")
print(f"Found {len(cards)} review-soal-card in gakusei2 kunci.mhtml")

with open("tools/gakusei2_kunci_summary.txt", "w", encoding="utf-8") as out:
    for idx, c in enumerate(cards, start=1):
        # find question header
        q_text = c.get_text(separator=' | ', strip=True)
        # shorten
        clean_text = ' '.join(q_text.split())
        out.write(f"CARD {idx}: {clean_text[:250]}\n\n")

print("Dumped gakusei2 cards summary!")

