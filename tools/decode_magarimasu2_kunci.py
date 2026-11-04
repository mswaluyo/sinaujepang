import quopri

with open(r'D:\soal-jft\_arsip\Magarimasu2\kunci.mhtml', 'rb') as f:
    raw = f.read()

# Blink MHTML has quoted-printable inside boundary
# Find Content-Transfer-Encoding: quoted-printable
parts = raw.split(b'\n\n', 2)
# Or direct quopri decode
decoded = quopri.decodestring(raw)
try:
    text = decoded.decode('utf-8')
except:
    text = decoded.decode('utf-8', errors='ignore')

with open(r'd:\soal-jft\tools\magarimasu2_kunci_clean.html', 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Decoded kunci.mhtml: {len(text)} characters written.")

