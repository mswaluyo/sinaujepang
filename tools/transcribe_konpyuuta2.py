import os, json
from faster_whisper import WhisperModel

audio_dir = "tools/konpyuuta2_audio"
files = [f"c{i}.wav" for i in range(1, 9)]

model = WhisperModel("small", device="cpu", compute_type="int8")

transcripts = {}
for fn in files:
    fpath = os.path.join(audio_dir, fn)
    if not os.path.exists(fpath):
        continue
    segments, info = model.transcribe(fpath, language="ja", beam_size=5)
    text_list = []
    for s in segments:
        text_list.append(s.text.strip())
    full_text = " ".join(text_list)
    transcripts[fn] = full_text
    print(f"Transcribed {fn}: {full_text[:60]}...")

with open("tools/konpyuuta2_whisper.json", "w", encoding="utf-8") as out:
    json.dump(transcripts, out, ensure_ascii=False, indent=2)

print("Finished Whisper transcription for all 8 Choukai files!")

