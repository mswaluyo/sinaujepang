import email, re

with open('_arsip/konpyuuta2/kunci.mhtml', 'rb') as f:
    raw = f.read()

# Let's inspect the first 1000 bytes
print("First 500 bytes of raw mhtml:")
print(raw[:500])

# Find charset in header of text/html part
m = re.search(rb'Content-Type:\s*text/html;\s*charset="?([^";\r\n]+)"?', raw, re.I)
if m:
    print("Found charset in raw:", m.group(1).decode())
else:
    print("No charset found in raw Content-Type")

# Also look for <meta charset="..."> or <meta http-equiv="Content-Type" content="...">
m2 = re.search(rb'<meta[^>]+charset=["\']?([^"\'\s>]+)', raw, re.I)
if m2:
    print("Found meta charset:", m2.group(1).decode())

