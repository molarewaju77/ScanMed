import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiChat {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async sendMessage(history, message, language = 'en') {
        // Format history for Gemini
        const formattedHistory = Array.isArray(history) ? history.map(msg => ({
            role: msg.sender === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        })) : [];

        const chat = this.model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const prompt = `[Language: ${language}] ${message}`;
        const result = await chat.sendMessage(prompt);
        return result.response.text();
    }

    async analyzeImage(imageBuffer, mimeType, prompt) {
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: mimeType
            },
        };

        const result = await this.model.generateContent([prompt, imagePart]);
        return result.response.text();
    }
}

export default GeminiChat;
