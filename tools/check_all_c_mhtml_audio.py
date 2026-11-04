import email

for c_num in range(1, 13):
    fname = f'_arsip/konpyuuta2/c{c_num}.mhtml'
    try:
        with open(fname, 'rb') as f:
            msg = email.message_from_binary_file(f)
        audios = []
        for p in msg.walk():
            ct = p.get_content_type()
            fn = p.get_filename() or p.get('Content-Location', '')
            if 'audio' in ct or any(fn.lower().endswith(ext) for ext in ['.mp3', '.wav', '.m4a']):
                audios.append(fn)
        if audios:
            print(f"{fname} has audio: {audios}")
    except Exception as e:
        pass

print("Finished checking c1..c12 for audio parts!")

