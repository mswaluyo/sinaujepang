import pypdf

reader = pypdf.PdfReader(r"D:\soal-jft\_arsip\SSW\45 SOAL KISI-KISI SOAL SSW PETERNAKAN.pdf")
print("Total pages:", len(reader.pages))

full_text = []
for i, page in enumerate(reader.pages):
    txt = page.extract_text() or ""
    full_text.append(f"--- PAGE {i+1} ---\n" + txt)

with open(r"d:\soal-jft\tools\ssw_peternakan_extracted.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(full_text))

print(f"Extracted {len(full_text)} pages to tools/ssw_peternakan_extracted.txt")
