from bs4 import BeautifulSoup

with open('tools/konpyuuta2_kunci_utf-8.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

classes = {}
for el in soup.find_all(class_=True):
    for c in el['class']:
        classes[c] = classes.get(c, 0) + 1

for c, count in sorted(classes.items(), key=lambda x: -x[1])[:30]:
    print(f"{c}: {count}")

# Check any div containing "Kunci:"
kunci_divs = [d for d in soup.find_all('div') if 'Kunci:' in d.get_text()]
print(f"Divs with 'Kunci:': {len(kunci_divs)}")

