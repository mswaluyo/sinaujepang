import json, re

with open('tools/saifu_parsed_kunci.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    txt = q['raw_text']
    # Check if "Jawaban yang benar" exists
    if "Jawaban yang benar" in txt:
        ans = txt.split("Jawaban yang benar")[-1].strip()
        q['correct'] = ans
    elif "Benar" in txt:
        # e.g. "... さいふ Benar ..." -> word before Benar
        # let's find the word before Benar
        m = re.search(r'([^\s]+)\s+Benar', txt)
        if m:
            q['correct'] = m.group(1).strip()
    print(f"No {q['no']} [{q['section']}]: Kunci -> '{q['correct']}' | Opts: {q['options']}")

with open('tools/saifu_parsed_kunci_clean.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
