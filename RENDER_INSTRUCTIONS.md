# Ice Carrier Render Instructions

## What's Complete ✅

1. **Story timeline** (`src/videos/ice-carrier/story.ts`) - 14 shots synced to 83s voiceover (2485 frames @ 30fps)
2. **Composition** (`src/videos/ice-carrier/IceCarrier.tsx`) - 1440x2560 @ 30fps, proper post chain
3. **Characters** (`src/videos/ice-carrier/cast.ts`) - Inventor, Sailors, Officer for all 14 shots
4. **Environment** (`src/videos/ice-carrier/build.ts`) - Ocean, Pykrete carrier hull, icebergs
5. **World/lighting** (`src/videos/ice-carrier/world.ts`) - Sky, camera-relative sun, fog, clouds
6. **Audio mix** (`audio/mix.wav`) - Voice at 0dB, SFX at -12dB, Music at -6dB (voice noticeably louder)

## Render on Linux/macOS/Windows

```bash
# 1. Install dependencies
npm install

# 2. Set temp directory (avoids filling system drive)
export TEMP=/path/to/large/drive/remotion-tmp
export TMP=/path/to/large/drive/remotion-tmp
mkdir -p $TEMP

# 3. Render (2K vertical: 1440x2560 = 1080x1920 * 1.3333)
npx remotion render src/Root.tsx IceCarrierShort out/ice-carrier/video.mp4 \
  --codec h264 --crf 16 --scale 1.3333

# 4. Mux with audio (Remotion outputs silent video)
ffmpeg -y -i out/ice-carrier/video.mp4 -i audio/mix.wav \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k \
  out/ice-carrier/final.mp4

# 5. QA check
python3 scripts/short_qa.py out/ice-carrier/final.mp4 out/ice-carrier/qa shots.json
```

## Expected Render Time
- ~10 minutes for 83s at 2K on modern hardware (~4 fps)
- Stills at --scale 0.5 take 3-8s each after ~40s bundle

## Audio Mix Spec
- Voice: 0 dB (reference)
- SFX: -12 dB (voice 12dB louder than SFX)
- Music: -6 dB (voice 6dB louder than music)
- Final master gain: -0.5 dB headroom
- 48 kHz, 16-bit PCM → AAC 192 kbps for final

## Files to Check Before Render
- `src/videos/ice-carrier/story.ts` - Shot timings match words.json
- `audio/mix.wav` - Duration 82.83s matches TOTAL frames
- `src/Root.tsx` - Composition registered with correct duration (2485 frames)