import wave
import struct
import math

def generate_wav(filename, sample_rate, num_samples, waveform_func):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = float(i) / sample_rate
            value = waveform_func(t, i)
            value = max(-1.0, min(1.0, value))
            packed_value = struct.pack('h', int(value * 32767.0))
            wav_file.writeframes(packed_value)

SR = 44100

# 1. Tape Clack (Soft Thud)
def clack_wave(t, i):
    # Much softer, deeper thud
    env = math.exp(-t * 30)
    thud_freq = 60 * math.exp(-t * 5)
    thud = math.sin(2 * math.pi * thud_freq * t)
    return thud * env * 0.4 # Reduced volume

generate_wav('/home/neo/SliceVice/web/public/audio/sfx_clack.wav', SR, int(SR * 0.15), clack_wave)

# 2. Nixie Timer Beep (Muffled Digital Beep)
def nixie_wave(t, i):
    # Lower pitch (800Hz) and very quiet
    freq = 600 
    env = math.exp(-t * 15) # Smooth decay instead of sharp cut
    return math.sin(2 * math.pi * freq * t) * env * 0.1

generate_wav('/home/neo/SliceVice/web/public/audio/sfx_nixie.wav', SR, int(SR * 0.12), nixie_wave)

print("SFX Regenerated (Muffled Mode)")
