with open(r'D:\soal-jft\tools\kunci_dump_all.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

hyougen_text = "".join(lines[332:515])
with open(r'D:\soal-jft\tools\hyougen_kunci.txt', 'w', encoding='utf-8') as out:
    out.write(hyougen_text)

print("Saved Hyougen to tools/hyougen_kunci.txt")

