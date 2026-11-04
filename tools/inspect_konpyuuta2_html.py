import sys
from bs4 import BeautifulSoup
import re

with open('tools/konpyuuta2_kunci.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

with open('tools/konpyuuta2_structure.txt', 'w', encoding='utf-8') as out:
    out.write("Title: " + str(soup.title.string if soup.title else "No title") + "\n")
    
    # Check classes
    for cls in ['card', 'question', 'soal', 'item', 'box', 'panel']:
        elems = soup.find_all(class_=re.compile(cls, re.I))
        out.write(f"Class {cls}: {len(elems)}\n")
        
    out.write("\n=== Headers & Key Texts ===\n")
    for el in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p']):
        txt = el.get_text(strip=True)
        if any(k in txt for k in ['SESI', 'MOJIGOI', 'HYOUGEN', 'CHOUKAI', 'DOKKAI', 'Kunci', 'Jawaban']):
            if len(txt) < 150:
                out.write(f"[{el.name}] {txt}\n")

print("Wrote structure to tools/konpyuuta2_structure.txt")
