import subprocess, os, json
import wave, numpy as np

# Let's inspect how faster_whisper decode_audio works or feed numpy array directly!
# Faster-whisper accepts numpy float32 array sampled at 16000Hz!
from faster_whisper import WhisperModel

def read_wav_16k(wav_path):
    with wave.open(wav_path, 'rb') as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        frames = wf.readframes(wf.getnframes())
        
        # 16-bit PCM
        audio_int16 = np.frombuffer(frames, dtype=np.int16)
        if n_channels > 1:
            audio_int16 = audio_int16.reshape(-1, n_channels).mean(axis=1).astype(np.int16)
        
        # Convert to float32
        audio_float32 = audio_int16.astype(np.float32) / 32768.0
        
        # Resample if needed
        if framerate != 16000:
            import scipy.signal
            num_samples = int(len(audio_float32) * 16000 / framerate)
            audio_float32 = scipy.signal.resample(audio_float32, num_samples)
            
        return audio_float32

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
        print(f"Transcribed {fn}: {full_text[:60]}...")
    except Exception as e:
        print(f"Error on {fn}: {e}")

with open("tools/konpyuuta2_whisper.json", "w", encoding="utf-8") as out:
    json.dump(transcripts, out, ensure_ascii=False, indent=2)

print("Finished Whisper transcription!")

