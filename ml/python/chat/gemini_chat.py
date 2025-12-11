import google.generativeai as genai

class GeminiChat:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def send_message(self, history, message, language='en'):
        chat = self.model.start_chat(history=history)
        prompt = f"[Language: {language}] {message}"
        response = chat.send_message(prompt)
        return response.text
