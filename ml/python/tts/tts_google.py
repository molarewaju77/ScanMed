from google.cloud import texttospeech

class TtsGoogle:
    def __init__(self, key_filename):
        self.client = texttospeech.TextToSpeechClient.from_service_account_json(key_filename)

    def speak(self, text, language_code='en-US'):
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = self.client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        return response.audio_content
