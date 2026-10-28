with open('d:/soal-jft/public/jft-a2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove duplicate kun reading lines
lines = content.split('\n')
cleaned_lines = []
seen_kun = False
for i, line in enumerate(lines):
    if 'k.kun ? k.kun' in line:
        if seen_kun:
            continue
        seen_kun = True
    elif 'k.vocab[0].kana' in line or '${k.arti}' in line:
        continue
    cleaned_lines.append(line)

content = '\n'.join(cleaned_lines)
with open('d:/soal-jft/public/jft-a2.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')

