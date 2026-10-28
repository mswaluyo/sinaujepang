import json
from collections import Counter

d = json.load(open('public/basu2-quiz/quiz-data.json', encoding='utf-8', errors='ignore'))

ses1 = [q for q in d if q.get('section') == 'SESI 1 : MOJIGOI']
print('Sesi 1 MOJIGOI count:', len(ses1))
for q in ses1[:5]:
    print(q['no'], q['title'][:60])
