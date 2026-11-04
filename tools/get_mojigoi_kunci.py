with open(r'D:\soal-jft\tools\kunci_dump_all.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

mojigoi_text = "".join(lines[74:332])
with open(r'D:\soal-jft\tools\mojigoi_kunci.txt', 'w', encoding='utf-8') as out:
    out.write(mojigoi_text)

print("Saved Mojigoi to tools/mojigoi_kunci.txt")

