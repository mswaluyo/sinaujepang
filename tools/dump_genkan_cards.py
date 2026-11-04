import email

with open(r'_arsip\GENKAN\KUNCI.mhtml', 'rb') as fp:
    msg = email.message_from_binary_file(fp)

for part in msg.walk():
    if part.get_content_type() == 'text/html':
        raw = part.get_payload(decode=True)
        text = raw.decode('utf-8', errors='replace')
        cards = text.split('<div class="review-soal-card">')
        print(f"Total cards in GENKAN: {len(cards)}")
        for i, c in enumerate(cards[1:], 1):
            if i >= 38:
                with open(f"tools/genkan_card_{i}.txt", "w", encoding="utf-8") as out:
                    out.write(c)
        print("Saved dokkai cards to tools/genkan_card_*.txt")
        break

