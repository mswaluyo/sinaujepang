import os, pymupdf

doc = pymupdf.open(r"D:\soal-jft\_arsip\SSW\45 SOAL KISI-KISI SOAL SSW PETERNAKAN.pdf")
out_dir = r"d:\soal-jft\tools\ssw_peternakan_pages"
os.makedirs(out_dir, exist_ok=True)

for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    save_path = os.path.join(out_dir, f"page_{i+1}.png")
    pix.save(save_path)
    print(f"Rendered page {i+1} -> {save_path}")

print("All pages rendered to PNG!")
