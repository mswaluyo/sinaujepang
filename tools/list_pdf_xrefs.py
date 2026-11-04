import pymupdf

doc = pymupdf.open(r"D:\soal-jft\_arsip\SSW\45 SOAL KISI-KISI SOAL SSW PETERNAKAN.pdf")

seen_xref = set()
for i, page in enumerate(doc):
    il = page.get_images()
    print(f"Page {i+1} has {len(il)} image references")
    for img_info in il:
        xref = img_info[0]
        if xref in seen_xref:
            continue
        seen_xref.add(xref)
        base = doc.extract_image(xref)
        print(f"  Xref {xref}: {base['width']}x{base['height']}, ext: {base['ext']}, bytes: {len(base['image'])}")
