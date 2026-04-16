import math
import wave
import struct
import os

sample_rate = 44100
duration = 8.0 # 8 seconds of looping audio
num_samples = int(sample_rate * duration)

audio_data = []

for i in range(num_samples):
    t = i / sample_rate
    
    # Bass Setup
    beats = int(math.floor(t * 4)) % 16
    if beats < 6:
        freq = 55.00
    elif 6 <= beats < 8:
        freq = 65.41
    elif 8 <= beats < 14:
        freq = 55.00
    else:
        freq = 49.00
        
    sixteenth_time = (t * 4) - math.floor(t * 4)
    envelope = math.exp(-sixteenth_time * 4)
    
    # Saw and Square generator
    phase = (t * freq) - math.floor(t * freq + 0.5)
    saw = 2 * phase
    square = 1 if math.sin(2 * math.pi * freq * t) > 0 else -1
    bass = (saw * 0.4 + square * 0.6) * envelope
    
    # Clean Snare (No white noise) - replacing with a harmonic zap
    snare_time = t - math.floor(t) - 0.5
    snare = 0
    if snare_time > 0:
        snare_env = math.exp(-snare_time * 30)
        snare = math.sin(2 * math.pi * 800 * snare_time) * snare_env * 0.3
    
    # Kick
    kick_time = t - (math.floor(t * 2) / 2.0)
    kick_freq = 150 * math.exp(-kick_time * 25)
    kick = math.sin(2 * math.pi * kick_freq * kick_time) * math.exp(-kick_time * 10)
    
    # High-Hat (Pure high-pitch sine instead of noise)
    hat_time = (t * 2) - math.floor(t * 2)
    hat_env = math.exp(-hat_time * 60)
    hat = math.sin(2 * math.pi * 5000 * hat_time) * hat_env * 0.1
    
    # Mix with safety ceiling to prevent clipping
    sample = (bass * 0.5 + kick * 0.4 + snare * 0.3 + hat * 0.1) * 0.7
    sample = max(-1.0, min(1.0, sample))
    audio_data.append(int(sample * 32767))

os.makedirs('web/public/audio', exist_ok=True)
with wave.open('web/public/audio/miami_bass.wav', 'w') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(sample_rate)
    data = struct.pack('<' + ('h' * len(audio_data)), *audio_data)
    f.writeframes(data)

print("Miami Bass Loop Regenerated (Static-Free).")
