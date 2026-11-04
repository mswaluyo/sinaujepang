import glob, os, json, sys
import soundfile as sf
import numpy as np
from faster_whisper import WhisperModel

print("Loading faster-whisper model (small)...")
model = WhisperModel("small", device="cpu", compute_type="int8")

audio_dir = r"public\assets\quizzes\hare3-quiz\audio"
audios = sorted(glob.glob(os.path.join(audio_dir, "c*.wav")))

results = {}

for audio_path in audios:
    fname = os.path.basename(audio_path)
    print(f"Transcribing {fname}...")
    data, orig_sr = sf.read(audio_path)
    if data.ndim > 1:
        data = data.mean(axis=1)
    
    target_sr = 16000
    target_length = int(len(data) * target_sr / orig_sr)
    indices = np.linspace(0, len(data) - 1, target_length)
    resampled_data = np.interp(indices, np.arange(len(data)), data).astype(np.float32)

    segments, info = model.transcribe(resampled_data, language="ja", beam_size=5)
    text_list = []
    for s in segments:
        text_list.append(s.text.strip())
    full_text = " ".join(text_list)
    results[fname] = {
        'full_text': full_text,
        'segments': text_list
    }
    sys.stdout.buffer.write(f"Done {fname}: {full_text}\n".encode('utf-8'))
    sys.stdout.flush()

with open(r"tools\hare3_whisper_transcripts.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved transcripts to tools/hare3_whisper_transcripts.json")

