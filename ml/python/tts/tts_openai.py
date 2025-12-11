from openai import OpenAI

class TtsOpenAI:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)

    def speak(self, text):
        response = self.client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=text
        )
        return response.content
