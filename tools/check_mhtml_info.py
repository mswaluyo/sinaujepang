import email
from email import policy
import os

mhtml_files = sorted([f for f in os.listdir(r'_arsip\hare-new') if f.endswith('.mhtml')])
print('MHTML files in _arsip/hare-new:', mhtml_files)

for fname in mhtml_files:
    fpath = os.path.join(r'_arsip\hare-new', fname)
    with open(fpath, 'rb') as fp:
        msg = email.message_from_binary_file(fp, policy=policy.default)
    sub = msg.get('Subject', '')
    types = {}
    for part in msg.walk():
        ct = part.get_content_type()
        types[ct] = types.get(ct, 0) + 1
    print(f'{fname}: Subject="{sub}", parts={types}')

