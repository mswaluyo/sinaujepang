import os, json, wave, numpy as np
from faster_whisper import WhisperModel

def resample_linear(audio, orig_sr, target_sr=16000):
    if orig_sr == target_sr:
        return audio
    duration = len(audio) / orig_sr
    target_length = int(duration * target_sr)
    orig_indices = np.linspace(0, len(audio) - 1, len(audio))
    target_indices = np.linspace(0, len(audio) - 1, target_length)
    return np.interp(target_indices, orig_indices, audio).astype(np.float32)

def read_wav_16k(wav_path):
    with wave.open(wav_path, 'rb') as wf:
        n_channels = wf.getnchannels()
        framerate = wf.getframerate()
        frames = wf.readframes(wf.getnframes())
        
        audio_int16 = np.frombuffer(frames, dtype=np.int16)
        if n_channels > 1:
            audio_int16 = audio_int16.reshape(-1, n_channels).mean(axis=1).astype(np.int16)
        
        audio_float32 = audio_int16.astype(np.float32) / 32768.0
        return resample_linear(audio_float32, framerate, 16000)

audio_dir = "tools/konpyuuta2_audio"
files = [f"c{i}.wav" for i in range(1, 9)]

model = WhisperModel("small", device="cpu", compute_type="int8")

transcripts = {}
for fn in files:
    fpath = os.path.join(audio_dir, fn)
    if not os.path.exists(fpath):
        continue
    try:
        arr = read_wav_16k(fpath)
        segments, info = model.transcribe(arr, language="ja", beam_size=5)
        text_list = [s.text.strip() for s in segments]
        full_text = " ".join(text_list)
        transcripts[fn] = full_text
        print(f"Transcribed {fn} ({len(full_text)} chars)")
    except Exception as e:
        print(f"Error on {fn}: {e}")

with open("tools/konpyuuta2_whisper.json", "w", encoding="utf-8") as out:
    json.dump(transcripts, out, ensure_ascii=False, indent=2)

print("Finished Whisper transcription!")

