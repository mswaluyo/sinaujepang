with open(r'D:\soal-jft\tools\kunci_dump_all.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

dokkai_text = "".join(lines[671:1018])
with open(r'D:\soal-jft\tools\dokkai_kunci.txt', 'w', encoding='utf-8') as out:
    out.write(dokkai_text)

print("Saved Dokkai to tools/dokkai_kunci.txt")

