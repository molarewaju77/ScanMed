import Groq from "groq-sdk";

class GroqChat {
    constructor(apiKey) {
        this.client = new Groq({ apiKey: apiKey });
        this.chatModel = "llama-3.1-8b-instant";
        this.visionModel = "llama-3.2-11b-vision-preview";
    }

    async sendMessage(history, message, language = 'en') {
        const systemPrompt = {
            role: "system",
            content: `You are an advanced medical AI assistant. Answer in ${language}. Provide clear, accurate, and concise health information. Disclaimer: You are an AI, not a doctor.`
        };

        const formattedHistory = Array.isArray(history) ? history.map(msg => ({
            role: msg.sender === 'ai' ? 'assistant' : 'user', // Map our 'ai' to Groq's 'assistant'
            content: msg.text
        })) : [];

        const messages = [systemPrompt, ...formattedHistory, { role: "user", content: message }];

        const completion = await this.client.chat.completions.create({
            messages: messages,
            model: this.chatModel,
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            stop: null,
            stream: false
        });

        return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    }

    async analyzeImage(imageBuffer, mimeType, prompt) {
        try {
            const base64Image = imageBuffer.toString('base64');
            const dataUrl = `data:${mimeType};base64,${base64Image}`;

            const completion = await this.client.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: {
                                    url: dataUrl,
                                },
                            },
                        ],
                    },
                ],
                model: this.visionModel,
                temperature: 0.1, // Low temp for analytical precision
                max_tokens: 1024,
            });

            return completion.choices[0]?.message?.content || "{}";
        } catch (error) {
            console.error("Groq Vision Error:", error);
            throw error;
        }
    }
}

export default GroqChat;
