import math
import wave
import struct
import os

sample_rate = 44100
duration = 8.0 # 8 seconds of looping audio
num_samples = int(sample_rate * duration)

def save_wav(filename, values):
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        data = struct.pack('<' + ('h' * len(values)), *values)
        f.writeframes(data)

os.makedirs('web/public/audio', exist_ok=True)

# 1. Industrial Pulse (Stem A) - SOFTENED
# Sub-heavy kick with a muffled clang
audio_pulse = []
for i in range(num_samples):
    t = i / sample_rate
    
    # Soft Kick (60 BPM or 120 BPM but with slow decay)
    kick_t = (t * 2) % 1.0
    # Lower frequency kick (40Hz instead of 50Hz) and slower envelope
    kick = math.sin(2 * math.pi * 40 * math.exp(-kick_t * 5) * kick_t) * math.exp(-kick_t * 6)
    
    # Muffled "Clang" - Lower frequency (600Hz) and darker feel
    clang = 0
    if (t * 2) % 2.0 > 1.0:
        clang_t = (t * 2) % 1.0
        clang = math.sin(2 * math.pi * 600 * clang_t) * math.exp(-clang_t * 10) * 0.15
        
    sample = (kick * 0.7 + clang) * 0.6 # Lower overall gain
    sample = max(-1.0, min(1.0, sample))
    audio_pulse.append(int(sample * 32767))

save_wav('web/public/audio/ep7_stem_pulse.wav', audio_pulse)

# 2. Noir Drone (Stem B) - WARMER
# Soft low-pass feel, purely harmonic
audio_drone = []
for i in range(num_samples):
    t = i / sample_rate
    
    # Warmer Drone (Frequencies: 30Hz, 60Hz, 90Hz)
    drone1 = math.sin(2 * math.pi * 30 * t) * 0.3
    drone2 = math.sin(2 * math.pi * 60 * t) * 0.15
    drone3 = math.sin(2 * math.pi * 90 * t) * 0.05
    
    sample = (drone1 + drone2 + drone3) * 0.5
    sample = max(-1.0, min(1.0, sample))
    audio_drone.append(int(sample * 32767))

save_wav('web/public/audio/ep7_stem_drone.wav', audio_drone)

# 3. Mechanical Static (Stem C) - SILENT
audio_static = [0] * num_samples
save_wav('web/public/audio/ep7_stem_static.wav', audio_static)

print("Episode 7 Stems Regenerated (Muffled/Warm Mode).")
