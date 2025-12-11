from google.cloud import speech

class SttGoogle:
    def __init__(self, key_filename):
        self.client = speech.SpeechClient.from_service_account_json(key_filename)

    def transcribe(self, audio_content, language_code='en-US'):
        audio = speech.RecognitionAudio(content=audio_content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code=language_code,
        )

        response = self.client.recognize(config=config, audio=audio)
        
        results = []
        for result in response.results:
            results.append(result.alternatives[0].transcript)
            
        return "\n".join(results)
