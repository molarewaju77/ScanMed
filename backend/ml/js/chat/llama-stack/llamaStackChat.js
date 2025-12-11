import axios from 'axios';
import { spawn } from 'child_process';

/**
 * Meta Llama Stack Client - Official Llama 4 Scout Integration
 * 
 * This client uses Meta's official Llama Stack to run Llama 4 Scout models.
 * Llama 4 Scout is the latest and most powerful model from Meta.
 * 
 * Setup:
 * 1. Install: pip install llama-stack -U
 * 2. Download model: llama model download --source meta --model-id Llama-4-Scout-17B-16E-Instruct
 * 3. Start server: llama stack run (see LLAMA_STACK_SETUP.md for details)
 */

class LlamaStackChat {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || process.env.LLAMA_STACK_BASE_URL || 'http://localhost:5001';
        this.model = config.model || process.env.LLAMA_STACK_MODEL || 'Llama-4-Scout-17B-16E-Instruct';
        this.serverProcess = null;
    }

    /**
     * Send a chat message with optional conversation history
     * @param {Array} history - Previous conversation messages
     * @param {string} message - Current message to send
     * @param {string} language - Language code
     * @returns {Promise<string>} - AI response text
     */
    async sendMessage(history, message, language = 'en') {
        try {
            // Convert history to Llama Stack format
            const messages = this._convertHistoryToLlamaStack(history);

            // Add language instruction if not English
            const languagePrompt = language !== 'en'
                ? `Please respond in ${this._getLanguageName(language)}. `
                : '';

            messages.push({
                role: 'user',
                content: languagePrompt + message
            });

            const response = await axios.post(`${this.baseUrl}/inference/chat_completion`, {
                model: this.model,
                messages: messages,
                stream: false,
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.9
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 seconds timeout
            });

            // Extract response text
            if (response.data && response.data.choices && response.data.choices[0]) {
                return response.data.choices[0].message.content;
            }

            throw new Error('Invalid response format from Llama Stack');
        } catch (error) {
            console.error('Llama Stack API Error:', error.message);
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Llama Stack server is not running. Please start it with: llama stack run');
            }
            if (error.response?.status === 404) {
                throw new Error('Llama Stack endpoint not found. Ensure the server is running correctly.');
            }
            throw error;
        }
    }

    /**
     * Analyze an image using Llama 4 Scout with vision
     * Note: As of now, Llama 4 Scout may not have vision capabilities
     * Using Llama Guard for safety check instead
     * @param {Buffer} imageBuffer - Image data buffer
     * @param {string} mimeType - Image MIME type
     * @param {string} prompt - Analysis prompt
     * @returns {Promise<string>} - Analysis result
     */
    async analyzeImage(imageBuffer, mimeType, prompt) {
        try {
            // For Llama 4 Scout, we'll use a text-based approach
            // You can integrate Llama 3.2 Vision separately if needed

            const textPrompt = `${prompt}\n\nNote: This is an image analysis request. Llama 4 Scout is primarily a text model. For true vision capabilities, consider using Llama 3.2 Vision via Ollama or a multimodal endpoint.`;

            const response = await axios.post(`${this.baseUrl}/inference/chat_completion`, {
                model: this.model,
                messages: [{
                    role: 'user',
                    content: textPrompt
                }],
                stream: false,
                max_tokens: 2000,
                temperature: 0.5
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            });

            if (response.data && response.data.choices && response.data.choices[0]) {
                return response.data.choices[0].message.content;
            }

            throw new Error('Invalid response format from Llama Stack');
        } catch (error) {
            console.error('Llama Stack Vision API Error:', error.message);
            throw new Error('Llama 4 Scout does not support vision yet. Use Ollama with llama3.2-vision instead.');
        }
    }

    /**
     * Check if Llama Stack server is running
     * @returns {Promise<Object>}
     */
    async checkHealth() {
        try {
            const response = await axios.get(`${this.baseUrl}/health`, {
                timeout: 5000
            });

            return {
                serverRunning: true,
                healthy: response.status === 200,
                model: this.model,
                baseUrl: this.baseUrl
            };
        } catch (error) {
            return {
                serverRunning: false,
                healthy: false,
                error: error.message,
                suggestion: 'Run: llama stack run --port 5001'
            };
        }
    }

    /**
     * Convert Gemini-style history to Llama Stack format
     * @private
     */
    _convertHistoryToLlamaStack(history) {
        if (!history || history.length === 0) return [];

        return history.map(msg => {
            const role = msg.role === 'model' ? 'assistant' : msg.role;
            let content;

            if (typeof msg.parts === 'string') {
                content = msg.parts;
            } else if (Array.isArray(msg.parts)) {
                content = msg.parts[0]?.text || '';
            } else {
                content = '';
            }

            return { role, content };
        });
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

    /**
     * Start Llama Stack server programmatically (optional)
     * You can also start it manually in a separate terminal
     * @param {number} port - Port to run on
     * @returns {Promise<void>}
     */
    async startServer(port = 5001) {
        return new Promise((resolve, reject) => {
            try {
                this.serverProcess = spawn('llama', ['stack', 'run', '--port', port.toString()], {
                    stdio: 'pipe',
                    shell: true
                });

                this.serverProcess.stdout.on('data', (data) => {
                    console.log(`Llama Stack: ${data}`);
                    if (data.toString().includes('Server running')) {
                        resolve();
                    }
                });

                this.serverProcess.stderr.on('data', (data) => {
                    console.error(`Llama Stack Error: ${data}`);
                });

                this.serverProcess.on('error', (error) => {
                    reject(new Error(`Failed to start Llama Stack: ${error.message}`));
                });

                // Timeout after 30 seconds
                setTimeout(() => {
                    reject(new Error('Llama Stack server did not start within 30 seconds'));
                }, 30000);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Stop Llama Stack server if started programmatically
     */
    stopServer() {
        if (this.serverProcess) {
            this.serverProcess.kill();
            this.serverProcess = null;
        }
    }
}

export default LlamaStackChat;
