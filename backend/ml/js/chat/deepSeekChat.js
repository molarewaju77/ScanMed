import axios from 'axios';

class DeepSeekChat {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.deepseek.com/chat/completions";
        this.model = "deepseek-chat";
    }

    async sendMessage(history, message, language = 'en') {
        try {
            // Convert Gemini history format to OpenAI/DeepSeek format
            // Gemini: { role: 'user'/'model', parts: [{ text: '...' }] }
            // DeepSeek: { role: 'user'/'assistant', content: '...' }
            const messages = history.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.parts[0].text
            }));

            // Add current message
            // DeepSeek specific: Add a system prompt for behavior if needed, or just append user msg
            // Adding a system prompt for persona
            if (messages.length === 0) {
                messages.push({
                    role: "system",
                    content: `You are ScanMed AI, a medical health assistant. You are helpful, professional, and concise. Respond in ${language}.`
                });
            }

            messages.push({ role: 'user', content: message });

            const response = await axios.post(
                this.baseUrl,
                {
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000 // Limit output
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("DeepSeek API Error Details:", error.response ? error.response.data : error.message);
            if (error.response) console.error("Status:", error.response.status);
            throw new Error(`Failed to get response from DeepSeek AI: ${error.message}`);
        }
    }
}

export default DeepSeekChat
