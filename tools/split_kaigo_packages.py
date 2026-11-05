import os, sys, json, shutil

sys.stdout.reconfigure(encoding='utf-8')

with open('public/quizzes/ssw-kaigo-quiz/quiz-data.json', encoding='utf-8') as f:
    full_data = json.load(f)

# Package definitions
packages = [
    {
        "slug": "ssw-kaigo-bab1-quiz",
        "title": "SSW Kaigo - Bab 1: Martabat & Kemandirian Manusia",
        "section": "SSW KAIGO BAB 1",
        "mnn": "SSW Kaigo (介護)",
        "start": 0,
        "end": 16
    },
    {
        "slug": "ssw-kaigo-bab2-quiz",
        "title": "SSW Kaigo - Bab 2: Peran Staf & Etika Profesi",
        "section": "SSW KAIGO BAB 2",
        "mnn": "SSW Kaigo (介護)",
        "start": 16,
        "end": 36
    },
    {
        "slug": "ssw-kaigo-bab3-quiz",
        "title": "SSW Kaigo - Bab 3: Menjamin Keselamatan & Manajemen Risiko",
        "section": "SSW KAIGO BAB 3",
        "mnn": "SSW Kaigo (介護)",
        "start": 36,
        "end": 51
    },
    {
        "slug": "ssw-kaigo-bab4-quiz",
        "title": "SSW Kaigo - Bab 4: Pemahaman Mekanisme Mental & Tubuh",
        "section": "SSW KAIGO BAB 4",
        "mnn": "SSW Kaigo (介護)",
        "start": 51,
        "end": 66
    },
    {
        "slug": "ssw-kaigo-nihongo-shukkin-quiz",
        "title": "SSW Kaigo Nihongo - 出勤 (Shukkin)",
        "section": "SSW KAIGO NIHONGO",
        "mnn": "SSW Kaigo (出勤)",
        "start": 66,
        "end": 81
    },
    {
        "slug": "ssw-kaigo-nihongo-nemaki-quiz",
        "title": "SSW Kaigo Nihongo - 寝間着 (Nemaki)",
        "section": "SSW KAIGO NIHONGO",
        "mnn": "SSW Kaigo (寝間着)",
        "start": 81,
        "end": 96
    },
    {
        "slug": "ssw-kaigo-nihongo-koui-quiz",
        "title": "SSW Kaigo Nihongo - 更衣 (Koui)",
        "section": "SSW KAIGO NIHONGO",
        "mnn": "SSW Kaigo (更衣)",
        "start": 96,
        "end": 106
    },
    {
        "slug": "ssw-kaigo-nihongo-tokashimasu-quiz",
        "title": "SSW Kaigo Nihongo - 梳します (Tokashimasu)",
        "section": "SSW KAIGO NIHONGO",
        "mnn": "SSW Kaigo (梳します)",
        "start": 106,
        "end": 121
    },
    {
        "slug": "ssw-kaigo-nihongo-sokutei-quiz",
        "title": "SSW Kaigo Nihongo - 足底 (Sokutei)",
        "section": "SSW KAIGO NIHONGO",
        "mnn": "SSW Kaigo (足底)",
        "start": 121,
        "end": 136
    },
    {
        "slug": "ssw-kaigo-nihongo-hitai-quiz",
        "title": "SSW Kaigo Nihongo - 額 (Hitai)",
        "section": "SSW KAIGO NIHONGO",
        "mnn": "SSW Kaigo (額)",
        "start": 136,
        "end": 151
    }
]

base_dir = r"public/quizzes"

for pkg in packages:
    slug = pkg['slug']
    pkg_dir = os.path.join(base_dir, slug)
    os.makedirs(pkg_dir, exist_ok=True)
    
    sub_questions = full_data[pkg['start']:pkg['end']]
    
    # Renumber questions 1..N and update headers
    adjusted = []
    for idx, q in enumerate(sub_questions):
        item = dict(q)
        item['no'] = idx + 1
        item['section'] = pkg['section']
        item['mnn'] = pkg['mnn']
        # Note: image paths point to /quizzes/ssw-kaigo-quiz/assets/... which exists!
        adjusted.append(item)
        
    out_json = os.path.join(pkg_dir, "quiz-data.json")
    with open(out_json, 'w', encoding='utf-8') as out_f:
        json.dump(adjusted, out_f, ensure_ascii=False, indent=2)
        
    print(f"Created {slug}: {len(adjusted)} questions")

print("All 10 packages created successfully!")

