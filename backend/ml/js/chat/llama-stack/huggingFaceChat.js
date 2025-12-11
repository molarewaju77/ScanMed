import axios from 'axios';

/**
 * Hugging Face Inference API Client for Llama Models
 * 
 * This client uses Hugging Face's free Inference API to run Llama models.
 * No local installation required - everything runs in the cloud!
 * 
 * Setup:
 * 1. Get free API token from https://huggingface.co/settings/tokens
 * 2. Add to .env: HUGGINGFACE_API_KEY=your_token_here
 * 3. That's it! No downloads, no server setup needed.
 */

class HuggingFaceChat {
    constructor(config = {}) {
        this.apiKey = config.apiKey || process.env.HUGGINGFACE_API_KEY;
        this.baseUrl = 'https://api-inference.huggingface.co/models';

        // Using Meta's Llama 2 13B Chat - available on HF free tier
        // Alternative: 'meta-llama/Llama-2-70b-chat-hf' (requires Pro account)
        this.model = config.model || process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-2-13b-chat-hf';

        if (!this.apiKey) {
            console.warn('⚠️  HUGGINGFACE_API_KEY not set. Get one free at: https://huggingface.co/settings/tokens');
        }
    }

    /**
     * Send a chat message with optional conversation history
     * @param {Array} history - Previous conversation messages
     * @param {string} message - Current message to send
     * @param {string} language - Language code
     * @returns {Promise<string>} - AI response text
     */
    async sendMessage(history, message, language = 'en') {
        if (!this.apiKey) {
            throw new Error('Hugging Face API key not configured. Get one free at: https://huggingface.co/settings/tokens');
        }

        try {
            // Build conversation prompt in Llama 2 format
            let prompt = '';

            // Add language instruction if not English
            const languageInstruction = language !== 'en'
                ? `Respond in ${this._getLanguageName(language)}. `
                : '';

            // Format history in Llama 2 chat format
            if (history && history.length > 0) {
                for (const msg of history) {
                    const role = msg.role === 'model' ? 'assistant' : 'user';
                    const content = typeof msg.parts === 'string' ? msg.parts : msg.parts[0]?.text || '';

                    if (role === 'user') {
                        prompt += `[INST] ${content} [/INST] `;
                    } else {
                        prompt += `${content} `;
                    }
                }
            }

            // Add current message
            prompt += `[INST] ${languageInstruction}${message} [/INST]`;

            const response = await axios.post(
                `${this.baseUrl}/${this.model}`,
                {
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 1000,
                        temperature: 0.7,
                        top_p: 0.9,
                        return_full_text: false
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000 // 60 seconds - HF can be slow on free tier
                }
            );

            // Extract response
            if (Array.isArray(response.data) && response.data[0]?.generated_text) {
                return response.data[0].generated_text.trim();
            } else if (response.data?.generated_text) {
                return response.data.generated_text.trim();
            } else if (typeof response.data === 'string') {
                return response.data.trim();
            }

            throw new Error('Unexpected response format from Hugging Face API');
        } catch (error) {
            console.error('Hugging Face API Error:', error.message);

            if (error.response?.status === 401) {
                throw new Error('Invalid Hugging Face API key. Get one at: https://huggingface.co/settings/tokens');
            }

            if (error.response?.status === 503) {
                throw new Error('Model is loading on Hugging Face servers. Please try again in 20-30 seconds.');
            }

            if (error.response?.data?.error) {
                throw new Error(`Hugging Face API: ${error.response.data.error}`);
            }

            throw error;
        }
    }

    /**
     * Analyze an image using Hugging Face Vision models
     * @param {Buffer} imageBuffer - Image data buffer
     * @param {string} mimeType - Image MIME type
     * @param {string} prompt - Analysis prompt
     * @returns {Promise<string>} - Analysis result
     */
    async analyzeImage(imageBuffer, mimeType, prompt) {
        if (!this.apiKey) {
            throw new Error('Hugging Face API key not configured');
        }

        try {
            // Use BLIP or similar vision model for image analysis
            const visionModel = 'Salesforce/blip-image-captioning-large';

            const base64Image = imageBuffer.toString('base64');

            const response = await axios.post(
                `${this.baseUrl}/${visionModel}`,
                {
                    inputs: base64Image
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000
                }
            );

            // For medical analysis, we'll use the caption as context
            if (Array.isArray(response.data) && response.data[0]?.generated_text) {
                const imageDescription = response.data[0].generated_text;

                // Now use Llama to analyze based on description
                const analysisPrompt = `Based on this medical image description: "${imageDescription}"\n\n${prompt}`;
                return await this.sendMessage([], analysisPrompt, 'en');
            }

            throw new Error('Could not analyze image');
        } catch (error) {
            console.error('Hugging Face Vision Error:', error.message);

            if (error.response?.status === 503) {
                throw new Error('Vision model is loading. Please try again in 20-30 seconds.');
            }

            throw error;
        }
    }

    /**
     * Check if Hugging Face API is accessible
     * @returns {Promise<Object>}
     */
    async checkHealth() {
        if (!this.apiKey) {
            return {
                serverRunning: false,
                healthy: false,
                error: 'No API key configured',
                suggestion: 'Get free API key at: https://huggingface.co/settings/tokens'
            };
        }

        try {
            // Test with a simple request
            const response = await axios.post(
                `${this.baseUrl}/${this.model}`,
                {
                    inputs: 'Hello',
                    parameters: { max_new_tokens: 10 }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            return {
                serverRunning: true,
                healthy: true,
                model: this.model,
                provider: 'Hugging Face Inference API',
                note: 'Using cloud-based API - no local installation needed'
            };
        } catch (error) {
            if (error.response?.status === 503) {
                return {
                    serverRunning: true,
                    healthy: true,
                    model: this.model,
                    provider: 'Hugging Face Inference API',
                    note: 'Model is loading. First request may take 20-30 seconds.'
                };
            }

            return {
                serverRunning: false,
                healthy: false,
                error: error.message,
                suggestion: error.response?.status === 401
                    ? 'Check your API key at: https://huggingface.co/settings/tokens'
                    : 'Hugging Face API may be experiencing issues'
            };
        }
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

export default HuggingFaceChat;
