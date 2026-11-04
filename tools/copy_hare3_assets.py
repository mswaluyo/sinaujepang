import os
import shutil

src_dir = r'_arsip\hare-new'
dest_img_dir = r'public\assets\quizzes\hare3-quiz\images'
dest_audio_dir = r'public\assets\quizzes\hare3-quiz\audio'

os.makedirs(dest_img_dir, exist_ok=True)
os.makedirs(dest_audio_dir, exist_ok=True)

# Copy images
img_mapping = {
    'm1.jpg': 'm1.jpg',
    'm2.png': 'm2.png',
    'm3.png': 'm3.png',
    'm4.png': 'm4.png',
    'm5.png': 'm5.png',
    'm12.jpg': 'm12.jpg',
    'm13.jpg': 'm13.jpg'
}

for src_name, dest_name in img_mapping.items():
    s = os.path.join(src_dir, src_name)
    d = os.path.join(dest_img_dir, dest_name)
    if os.path.exists(s):
        shutil.copy2(s, d)
        print(f'Copied image {src_name} -> {d} ({os.path.getsize(d)} bytes)')

# Copy audio
audio_dir_src = r'tools\hare_new_audio'
for f in os.listdir(audio_dir_src):
    s = os.path.join(audio_dir_src, f)
    d = os.path.join(dest_audio_dir, f)
    shutil.copy2(s, d)
    print(f'Copied audio {f} -> {d} ({os.path.getsize(d)} bytes)')

