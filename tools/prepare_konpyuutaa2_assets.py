import os, json, shutil

# Create assets directory for konpyuutaa2-quiz
os.makedirs('public/assets/quizzes/konpyuutaa2-quiz/images', exist_ok=True)
os.makedirs('public/assets/quizzes/konpyuutaa2-quiz/audio', exist_ok=True)
os.makedirs('public/quizzes/konpyuutaa2-quiz', exist_ok=True)

# 1. Copy images from _arsip/konpyuuta2 to public/assets/quizzes/konpyuutaa2-quiz/images
img_map = {
    "m1.jpg": "konpyuuta.jpg",
    "m2.png": "kagi1.png",
    "m3.png": "kagi2.png",
    "m4.png": "kagi3.png",
    "m14.png": "kagi4.png",
    "h7.png": "kagi5.png",
}

for src_name, target_alias in img_map.items():
    src_path = os.path.join('_arsip/konpyuuta2', src_name)
    if os.path.exists(src_path):
        dest_alias = os.path.join('public/assets/quizzes/konpyuutaa2-quiz/images', target_alias)
        dest_orig = os.path.join('public/assets/quizzes/konpyuutaa2-quiz/images', src_name)
        shutil.copyfile(src_path, dest_alias)
        shutil.copyfile(src_path, dest_orig)
        # Also copy fallback to public/assets/
        shutil.copyfile(src_path, os.path.join('public/assets', target_alias))
        shutil.copyfile(src_path, os.path.join('public/assets', src_name))

# 2. Copy audios from tools/konpyuuta2_audio to public/assets/quizzes/konpyuutaa2-quiz/audio
for i in range(1, 9):
    afn = f"c{i}.wav"
    asrc = os.path.join('tools/konpyuuta2_audio', afn)
    if os.path.exists(asrc):
        adest = os.path.join('public/assets/quizzes/konpyuutaa2-quiz/audio', afn)
        shutil.copyfile(asrc, adest)
        shutil.copyfile(asrc, os.path.join('public/assets', afn))

print("Assets prepared for konpyuutaa2-quiz!")

