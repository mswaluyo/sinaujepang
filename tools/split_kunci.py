with open(r'D:\soal-jft\tools\kunci_dump_all.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re
items = re.split(r'\n(?=✓|✗|\b#[0-9]+)', text)
print(f"Total split sections: {len(items)}")

with open(r'D:\soal-jft\tools\kunci_sections.txt', 'w', encoding='utf-8') as out:
    for i, item in enumerate(items):
        m = re.search(r'#(\d+)', item)
        no_str = m.group(1) if m else f"sec_{i}"
        out.write(f"==================== ITEM {no_str} ====================\n")
        out.write(item.strip() + "\n\n")

print("Saved to tools/kunci_sections.txt")

