import os, pypdf

reader = pypdf.PdfReader(r"D:\soal-jft\_arsip\SSW\45 SOAL KISI-KISI SOAL SSW PETERNAKAN.pdf")
out_dir = r"d:\soal-jft\tools\ssw_peternakan_images"
os.makedirs(out_dir, exist_ok=True)

img_count = 0
for i, page in enumerate(reader.pages):
    for j, img in enumerate(page.images):
        img_count += 1
        name = getattr(img, 'name', f"img_{j}.png")
        save_name = f"page_{i+1}_{j}_{name}"
        save_path = os.path.join(out_dir, save_name)
        with open(save_path, "wb") as f:
            f.write(img.data)
        print(f"Saved {save_name} ({len(img.data)} bytes)")

print(f"Extracted {img_count} images to {out_dir}")
