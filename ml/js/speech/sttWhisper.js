import OpenAI from "openai";

class SttWhisper {
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
    }

    async transcribe(audioBuffer) {
        // Convert buffer to file-like object if needed
        const response = await this.openai.audio.transcriptions.create({
            file: audioBuffer,
            model: "whisper-1",
        });
        return response.text;
    }
}

export default SttWhisper;
