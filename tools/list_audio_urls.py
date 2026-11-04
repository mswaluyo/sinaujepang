from bs4 import BeautifulSoup

with open('tools/hare_new_extracted/d1.html', 'r', encoding='utf-8', errors='replace') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

buttons = soup.find_all(class_='play-audio-btn')
print(f'Total play-audio-btn: {len(buttons)}')
for b in buttons:
    soal_id = b.get('data-soal-id')
    src = b.get('data-audio-src')
    print(f'  Soal ID: {soal_id} -> src: {src}')

