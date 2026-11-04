import re, json

with open(r'd:\soal-jft\tools\ssw_peternakan_extracted.txt', 'r', encoding='utf-8') as f:
    raw_text = f.read()

# Bersihkan header page
text = re.sub(r'--- PAGE \d+ ---\s*\d*\s*---?', '', raw_text)
text = text.replace('45 SOAL KISI-KISI SOAL SSW PETERNAKAN', '')

print("Cleaned text length:", len(text))
