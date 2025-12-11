import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiChat {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    async sendMessage(history, message, language = 'en') {
        const chat = this.model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const prompt = `[Language: ${language}] ${message}`;
        const result = await chat.sendMessage(prompt);
        return result.response.text();
    }
}

export default GeminiChat;
