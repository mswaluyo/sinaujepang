with open(r'D:\soal-jft\tools\kunci_dump_all.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

import re
nums = []
for idx, line in enumerate(lines):
    m = re.match(r'^[✓✗]?\s*#(\d+)\s*$', line.strip())
    if m:
        nums.append((int(m.group(1)), idx, lines[idx+1].strip() if idx+1 < len(lines) else ''))

with open(r'D:\soal-jft\tools\nums_output.txt', 'w', encoding='utf-8') as out:
    for n, idx, next_l in nums:
        out.write(f"Line {idx}: #{n} -> {next_l}\n")

print(f"Total entries: {len(nums)}")
