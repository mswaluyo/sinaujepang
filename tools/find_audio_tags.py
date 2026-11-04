from bs4 import BeautifulSoup

with open('tools/hare_new_extracted/d1.html', 'r', encoding='utf-8', errors='replace') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

audios = soup.find_all(['audio', 'source'])
print('audio/source tags:', len(audios))
for a in audios:
    print(' ', a)

# check for any playAudio, data-audio, sound in scripts or elements
sound_tags = soup.find_all(attrs={'data-audio': True})
print('data-audio tags:', len(sound_tags))
for s in sound_tags[:5]:
    print(' ', s.get('data-audio'))

