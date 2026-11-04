# Let's inspect each choukai question (1 to 8) from lines 516 to 670 in kunci_dump_all.txt
with open(r'D:\soal-jft\tools\kunci_dump_all.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

choukai_text = "".join(lines[515:672])
with open(r'D:\soal-jft\tools\choukai_kunci.txt', 'w', encoding='utf-8') as out:
    out.write(choukai_text)

print("Saved Choukai to tools/choukai_kunci.txt")

