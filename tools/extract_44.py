import re

with open(r'D:\soal-jft\tools\kunci_dump_all.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Find matches for #1, #2, etc.
matches = list(re.finditer(r'(?:^|\n)(?:[✓✗]\s*)?#(\d+)\n', text))
print(f"Total numbered questions matched: {len(matches)}")

questions = []
for i, m in enumerate(matches):
    start = m.start()
    end = matches[i+1].start() if i+1 < len(matches) else len(text)
    q_num = int(m.group(1))
    content = text[start:end].strip()
    questions.append((q_num, content))

with open(r'D:\soal-jft\tools\kunci_44_items.txt', 'w', encoding='utf-8') as out:
    for q_num, content in questions:
        out.write(f"########################################\nSOAL NO: {q_num}\n########################################\n")
        out.write(content + "\n\n")

print("Saved to tools/kunci_44_items.txt")

