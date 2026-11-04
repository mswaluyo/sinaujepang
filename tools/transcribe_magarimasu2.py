import wave, json, os
import numpy as np
from faster_whisper import WhisperModel

print("Loading Whisper model small...")
model = WhisperModel("small", device="cpu", compute_type="int8")

audio_dir = r"d:\soal-jft\tools\magarimasu2_audio"
audios = sorted([f for f in os.listdir(audio_dir) if f.endswith(".wav")])

results = {}

for audio_name in audios:
    path = os.path.join(audio_dir, audio_name)
    with wave.open(path, 'rb') as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        data = wf.readframes(n_frames)
    
    if sampwidth == 2:
        audio_np = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0
    else:
        audio_np = np.frombuffer(data, dtype=np.float32)
        
    if n_channels > 1:
        audio_np = audio_np[::n_channels]
        
    if framerate != 16000:
        new_len = int(len(audio_np) * 16000 / framerate)
        audio_np = np.interp(
            np.linspace(0, len(audio_np), new_len, endpoint=False),
            np.arange(len(audio_np)),
            audio_np
        ).astype(np.float32)

    segments, info = model.transcribe(audio_np, language="ja", beam_size=5)
    text = "".join([s.text for s in segments]).strip()
    results[audio_name] = text
    print(f"Transcribed {audio_name} successfully ({len(text)} chars)")

out_path = r"d:\soal-jft\tools\magarimasu2_whisper.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Transcription saved to", out_path)
