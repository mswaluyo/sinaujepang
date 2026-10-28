import json

d = json.load(open('public/basu2-quiz/quiz-data.json', encoding='utf-8', errors='ignore'))

# Look at a few session 1 questions
ses1 = [q for q in d if q.get('section') == 'SESI 1 : MOJIGOI']
print('Total SESI 1:', len(ses1))
print()

# Print question 2, 3, 4
for q in ses1[1:4]:
    print('No:', q['no'])
    print('Title:', q['title'])
    print('Options:', json.dumps(q['options'], ensure_ascii=False)[:300])
    print('Answer:', q['answer'])
    print('Trans:', q.get('trans', 'N/A'))
    print('Trans_rom:', q.get('trans_rom', 'N/A'))
    print('MNN:', q.get('mnn', 'N/A'))
    print('Analisis:', q.get('analisis', 'N/A')[:100] if q.get('analisis') else 'N/A')
    print('Opt_detail:', json.dumps(q.get('opt_detail', []), ensure_ascii=False)[:300])
    print('Kunci_id:', q.get('kunci_id', 'N/A'))
    print('---')
