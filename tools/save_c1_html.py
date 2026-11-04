import quopri

with open('_arsip/konpyuuta2/c1.mhtml', 'rb') as f:
    raw = f.read()

# Isolate the text/html part between boundary
boundary = b"----MultipartBoundary--ReRqCJktJAZOk0JwdoeIpfNGKWeuoY973klldgEkMf----"
parts = raw.split(boundary)

for p in parts:
    if b"Content-Type: text/html" in p:
        header_end = p.find(b"\r\n\r\n")
        body = p[header_end+4:]
        decoded_html = quopri.decodestring(body)
        with open('tools/c1_decoded_utf8.html', 'wb') as out:
            out.write(decoded_html)
        print("Successfully written c1_decoded_utf8.html! Bytes:", len(decoded_html))
        break

