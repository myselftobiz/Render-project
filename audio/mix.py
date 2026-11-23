#!/usr/bin/env python3
"""
Audio mix for Ice Carrier short.
Standard mix: music +3 dB, SFX -6 dB, voice unchanged.
Uses only ffmpeg for generation and mixing.
"""
import subprocess
import sys
import os

VOICE = "/data/data/com.termux/files/home/my-project/voice/voice.wav"
MIX_OUT = "/data/data/com.termux/files/home/my-project/audio/mix.wav"
DURATION = 82.83  # seconds from voice.wav

def run(cmd):
    print("+", " ".join(cmd))
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    return result

def generate_sfx_ffmpeg():
    """Generate synthesized SFX using ffmpeg"""
    sfx_files = []

    # Ocean waves (continuous low rumble) - brown noise filtered
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"anoisesrc=color=brown:duration={DURATION}",
         "-af", "lowpass=f=200,volume=-30dB", "/data/data/com.termux/files/home/my-project/tmp_audio/waves.wav"])
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/waves.wav", 0, DURATION, -12))  # -12 dB for SFX (voice 12dB louder)

    # Submarine sonar ping (shot 2: 6-10s) - 800Hz tone
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", "sine=frequency=800:duration=1",
         "-af", "volume=-20dB", "/data/data/com.termux/files/home/my-project/tmp_audio/sonar.wav"])
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/sonar.wav", 6, 7, -12))
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/sonar.wav", 8, 9, -12))

    # Wind howling (exterior scenes) - pink noise bandpassed
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"anoisesrc=color=pink:duration={DURATION}",
         "-af", "bandpass=f=200:width_type=h:w=400,volume=-35dB", "/data/data/com.termux/files/home/my-project/tmp_audio/wind.wav"])
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/wind.wav", 0, DURATION, -12))

    # Ice cracking (shots 5, 6) - high frequency noise bursts
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anoisesrc=color=white:duration=0.3",
         "-af", "bandpass=f=4000:width_type=h:w=4000,volume=-15dB", "/data/data/com.termux/files/home/my-project/tmp_audio/ice_crack.wav"])
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/ice_crack.wav", 23, 23.3, -12))
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/ice_crack.wav", 26, 26.3, -12))
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/ice_crack.wav", 29, 29.3, -12))

    # Machinery hum (carrier engine) - 60Hz sine
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"sine=frequency=60:duration={DURATION}",
         "-af", "volume=-40dB", "/data/data/com.termux/files/home/my-project/tmp_audio/hum.wav"])
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/hum.wav", 33, DURATION, -12))

    # Paper rustling (shot 10: 40-45s) - mid-frequency noise
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anoisesrc=color=white:duration=2",
         "-af", "bandpass=f=2000:width_type=h:w=2000,volume=-25dB", "/data/data/com.termux/files/home/my-project/tmp_audio/paper.wav"])
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/paper.wav", 40, 42, -12))
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/paper.wav", 43, 45, -12))

    # Fire crackle (shot 10: flammable demo)
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anoisesrc=color=white:duration=3",
         "-af", "bandpass=f=500:width_type=h:w=1000,volume=-20dB", "/data/data/com.termux/files/home/my-project/tmp_audio/fire.wav"])
    sfx_files.append(("/data/data/com.termux/files/home/my-project/tmp_audio/fire.wav", 41, 44, -12))

    return sfx_files

def generate_music_ffmpeg():
    """Generate a simple march-style score using ffmpeg"""
    # Create a simple harmonic pad using multiple sine waves
    # C minor chord: C3 (130.81), Eb3 (164.81), G3 (196.00)

    # Base pad - C minor sustained (each input needs -f lavfi)
    run(["ffmpeg", "-y",
         "-f", "lavfi", "-i", f"sine=frequency=130.81:duration={DURATION}",
         "-f", "lavfi", "-i", f"sine=frequency=164.81:duration={DURATION}",
         "-f", "lavfi", "-i", f"sine=frequency=196.00:duration={DURATION}",
         "-filter_complex", "[0:a][1:a][2:a]amix=inputs=3:duration=first,volume=-30dB,afade=t=in:st=0:d=5,afade=t=out:st=77:d=5",
         "/data/data/com.termux/files/home/my-project/tmp_audio/music_pad.wav"])

    # Simple rhythmic pulse - low sine gated
    run(["ffmpeg", "-y",
         "-f", "lavfi", "-i", f"sine=frequency=65.41:duration={DURATION}",
         "-f", "lavfi", "-i", f"sine=frequency=2:duration={DURATION}",
         "-filter_complex", "[0:a][1:a]amix=inputs=2:duration=first,volume=-35dB",
         "/data/data/com.termux/files/home/my-project/tmp_audio/music_rhythm.wav"])

    # Combine pad and rhythm, boost for -6dB music level (voice 6dB louder)
    run(["ffmpeg", "-y",
         "-i", "/data/data/com.termux/files/home/my-project/tmp_audio/music_pad.wav",
         "-i", "/data/data/com.termux/files/home/my-project/tmp_audio/music_rhythm.wav",
         "-filter_complex", "[0:a][1:a]amix=inputs=2:duration=first,volume=-6dB",
         "/data/data/com.termux/files/home/my-project/tmp_audio/music.wav"])

    return [("/data/data/com.termux/files/home/my-project/tmp_audio/music.wav", 0, DURATION, -6)]  # -6 dB for music (voice 6dB louder)

def main():
    print("Generating SFX...")
    sfx_list = generate_sfx_ffmpeg()

    print("Generating music...")
    music_list = generate_music_ffmpeg()

    # Build filter_complex for ffmpeg
    # Input 0: voice
    # Inputs 1..N: SFX
    # Inputs N+1..: music

    all_inputs = [VOICE]
    filter_parts = ["[0:a]volume=1.0[voice]"]  # voice unchanged
    mix_inputs = ["[voice]"]

    idx = 1
    for sfx_file, start, end, gain_db in sfx_list:
        if not os.path.exists(sfx_file):
            print(f"Warning: {sfx_file} not found, skipping")
            continue
        all_inputs.append(sfx_file)
        # Apply gain and delay
        gain_linear = 10 ** (gain_db / 20)
        filter_parts.append(f"[{idx}:a]volume={gain_linear},adelay={int(start*1000)}|{int(start*1000)}[sfx{idx}]")
        mix_inputs.append(f"[sfx{idx}]")
        idx += 1

    for music_file, start, end, gain_db in music_list:
        if not os.path.exists(music_file):
            print(f"Warning: {music_file} not found, skipping")
            continue
        all_inputs.append(music_file)
        gain_linear = 10 ** (gain_db / 20)
        filter_parts.append(f"[{idx}:a]volume={gain_linear},adelay={int(start*1000)}|{int(start*1000)}[music{idx}]")
        mix_inputs.append(f"[music{idx}]")
        idx += 1

    # Mix everything
    num_inputs = len(mix_inputs)
    filter_parts.append("".join(mix_inputs) + f"amix=inputs={num_inputs}:duration=first:dropout_transition=0,volume=0.9[out]")

    filter_complex = ";".join(filter_parts)

    print("Mixing audio...")
    cmd = ["ffmpeg", "-y"] + sum([["-i", f] for f in all_inputs], []) + \
          ["-filter_complex", filter_complex, "-map", "[out]", "-c:a", "pcm_s16le", "-ar", "48000", MIX_OUT]

    run(cmd)
    print(f"Mix written to {MIX_OUT}")

    # Verify output
    result = run(["ffprobe", "-i", MIX_OUT, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"])
    print(f"Output duration: {result.stdout.strip()}s")

if __name__ == "__main__":
    main()