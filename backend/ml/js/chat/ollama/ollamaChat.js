import axios from 'axios';

/**
 * Ollama Chat Client - Local Llama Model Integration
 * 
 * This client connects to a local Ollama server running Llama models.
 * Ollama is the easiest way to run Llama models locally.
 * 
 * Setup:
 * 1. Install Ollama from https://ollama.ai/download
 * 2. Run: ollama pull llama3.2
 * 3. Run: ollama pull llama3.2-vision (for image analysis)
 * 4. Start server: ollama serve
 */

class OllamaChat {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        this.model = config.model || process.env.OLLAMA_MODEL || 'llama3.2';
        this.visionModel = config.visionModel || process.env.OLLAMA_VISION_MODEL || 'llama3.2-vision';
    }

    /**
     * Send a chat message with optional conversation history
     * @param {Array} history - Previous conversation messages in Gemini format
     * @param {string} message - Current message to send
     * @param {string} language - Language code (e.g., 'en', 'es', 'fr')
     * @returns {Promise<string>} - AI response text
     */
    async sendMessage(history, message, language = 'en') {
        try {
            // Convert Gemini-style history to Ollama format
            const messages = this._convertHistoryToOllama(history);

            // Add language instruction if not English
            const languagePrompt = language !== 'en'
                ? `Please respond in ${this._getLanguageName(language)}. `
                : '';

            // Add current message
            messages.push({
                role: 'user',
                content: languagePrompt + message
            });

            const response = await axios.post(`${this.baseUrl}/api/chat`, {
                model: this.model,
                messages: messages,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 1000 // Max tokens
                }
            });

            return response.data.message.content;
        } catch (error) {
            console.error('Ollama API Error:', error.message);
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Ollama server is not running. Please start it with: ollama serve');
            }
            throw error;
        }
    }

    /**
     * Analyze an image using Llama Vision model
     * @param {Buffer} imageBuffer - Image data buffer
     * @param {string} mimeType - Image MIME type
     * @param {string} prompt - Analysis prompt
     * @returns {Promise<string>} - Analysis result as text
     */
    async analyzeImage(imageBuffer, mimeType, prompt) {
        try {
            const base64Image = imageBuffer.toString('base64');

            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.visionModel,
                prompt: prompt,
                images: [base64Image],
                stream: false,
                options: {
                    temperature: 0.5, // Lower for more consistent medical analysis
                    num_predict: 2000
                }
            });

            return response.data.response;
        } catch (error) {
            console.error('Ollama Vision API Error:', error.message);
            if (error.response?.status === 404) {
                throw new Error(`Vision model '${this.visionModel}' not found. Install it with: ollama pull ${this.visionModel}`);
            }
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Ollama server is not running. Please start it with: ollama serve');
            }
            throw error;
        }
    }

    /**
     * Check if Ollama server is running and model is available
     * @returns {Promise<boolean>}
     */
    async checkHealth() {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`);
            const modelNames = response.data.models.map(m => m.name);

            return {
                serverRunning: true,
                modelAvailable: modelNames.some(name => name.includes(this.model)),
                visionModelAvailable: modelNames.some(name => name.includes(this.visionModel)),
                availableModels: modelNames
            };
        } catch (error) {
            return {
                serverRunning: false,
                modelAvailable: false,
                visionModelAvailable: false,
                error: error.message
            };
        }
    }

    /**
     * Convert Gemini-style message history to Ollama format
     * @private
     */
    _convertHistoryToOllama(history) {
        if (!history || history.length === 0) return [];

        return history.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: typeof msg.parts === 'string' ? msg.parts : msg.parts[0]?.text || ''
        }));
    }

    /**
     * Get full language name from code
     * @private
     */
    _getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'zh': 'Chinese',
            'ja': 'Japanese',
            'ko': 'Korean',
            'ar': 'Arabic',
            'hi': 'Hindi',
            'ru': 'Russian'
        };
        return languages[code] || 'English';
    }
}

export default OllamaChat;
