import glob, os

files = glob.glob('public/gakusei2-quiz/assets/*')
for f in sorted(files):
    print(f"{os.path.basename(f)}: {os.path.getsize(f)} bytes")

