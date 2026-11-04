import pymupdf, os

doc = pymupdf.open(r"D:\soal-jft\_arsip\SSW\45 SOAL KISI-KISI SOAL SSW PETERNAKAN.pdf")
os.makedirs("public/assets", exist_ok=True)

targets = [
    (314, "ssw_peternakan_q15_silase.png"),
    (315, "ssw_peternakan_q16_tangki.png"),
    (322, "ssw_peternakan_q24_kompos.png"),
]

for xref, name in targets:
    base = doc.extract_image(xref)
    p = os.path.join("public/assets", name)
    with open(p, "wb") as f:
        f.write(base["image"])
    print(f"Saved {name} ({len(base['image'])} bytes)")
