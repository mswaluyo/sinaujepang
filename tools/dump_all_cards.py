import email

with open(r'_arsip\SHIMEMASU2\kunci.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        raw = part.get_payload(decode=True)
        text = raw.decode('utf-8', errors='replace')
        # find all occurrences of 'review-soal-card'
        cards = text.split('<div class="review-soal-card">')
        print(f'Total cards: {len(cards)}')
        for idx, c in enumerate(cards[1:], 1):
            with open(f'tools/card_{idx}.txt', 'w', encoding='utf-8') as out:
                out.write(c[:2000])
        print('Saved all cards to tools/card_*.txt')
        break

