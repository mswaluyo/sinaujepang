import email

with open('_arsip/konpyuuta2/kunci.mhtml', 'rb') as f:
    msg = email.message_from_binary_file(f)

for p in msg.walk():
    if p.get_content_type() == 'text/html':
        cs = p.get_content_charset()
        cte = p.get('Content-Transfer-Encoding', '')
        payload = p.get_payload(decode=True)
        print("Charset reported:", cs)
        print("Transfer encoding:", cte)
        # Try various decodings
        for enc in ['utf-8', 'windows-1252', 'shift_jis', 'cp932', 'euc-jp']:
            try:
                txt = payload.decode(enc)
                # check if Japanese appears
                jp = len([c for c in txt if '\u3040' <= c <= '\u309f' or '\u30a0' <= c <= '\u30ff' or '\u4e00' <= c <= '\u9faf'])
                print(f"Encoding {enc}: Japanese characters = {jp}")
                if jp > 500:
                    with open(f'tools/konpyuuta2_kunci_{enc}.html', 'w', encoding='utf-8') as out:
                        out.write(txt)
                    print(f"--> Saved as tools/konpyuuta2_kunci_{enc}.html")
            except Exception as e:
                pass
        break

