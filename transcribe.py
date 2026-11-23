import speech_recognition as sr
import json

def transcribe():
    r = sr.Recognizer()
    audio_file = "voice/voice.wav"

    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)

    try:
        # Using Google Web Speech API for simplicity.
        # For professional results, you'd usually use a local model like whisper.
        text = r.recognize_google(audio)
        print(f"Transcript: {text}")

        # Simple word timing guess - in reality you need a forced aligner like aeneas
        words = text.split()
        word_data = []
        start = 0.0
        dur = 82.8 / len(words)
        for w in words:
            word_data.append({"word": w, "start": round(start, 2), "end": round(start + dur, 2)})
            start += dur

        with open('voice/words.json', 'w') as f:
            json.dump(word_data, f, indent=2)

    except Exception as e:
        print(f"Error: {e}")

transcribe()
