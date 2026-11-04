import json

with open('public/quizzes/magarimasu-quiz/quiz-data.json', 'r', encoding='utf-8') as f:
    m1 = json.load(f)
with open('public/quizzes/magarimasu2-quiz/quiz-data.json', 'r', encoding='utf-8') as f:
    m2 = json.load(f)

matches = []
for q1 in m1:
    ans1 = q1.get('kunci_id', '').strip()
    opt1_texts = set([o.get('text', '').strip() for o in q1.get('options', [])])
    
    for q2 in m2:
        ans2 = q2.get('kunci_id', '').strip()
        opt2_texts = set([o.get('text', '').strip() for o in q2.get('options', [])])
        
        # 1. Kunci sama dan opsi tumpang tindih
        overlap = opt1_texts.intersection(opt2_texts)
        if ans1 and ans2 and ans1 == ans2:
            matches.append({
                'm1_no': q1['no'],
                'm1_sec': q1['section'],
                'm1_ans': ans1,
                'm1_title': q1.get('title') or q1.get('trans'),
                'm2_no': q2['no'],
                'm2_sec': q2['section'],
                'm2_ans': ans2,
                'm2_title': q2.get('title', '').replace('\n', ' ')[:70],
                'overlap': list(overlap)
            })

with open('tools/magarimasu_key_matches.json', 'w', encoding='utf-8') as f:
    json.dump(matches, f, ensure_ascii=False, indent=2)

print(f"Total matches found: {len(matches)}")
for m in matches:
    print(f"M1 #{m['m1_no']} ({m['m1_sec']}) vs M2 #{m['m2_no']} ({m['m2_sec']})")
    print(f"  Kunci: {m['m1_ans']}")
    print(f"  M1: {m['m1_title']}")
    print(f"  M2: {m['m2_title']}")
    print(f"  Overlap opts: {m['overlap']}")
    print("-" * 50)

