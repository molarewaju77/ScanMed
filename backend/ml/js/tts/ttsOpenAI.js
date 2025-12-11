import OpenAI from "openai";

class TtsOpenAI {
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
    }

    async speak(text) {
        const mp3 = await this.openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });
        return Buffer.from(await mp3.arrayBuffer());
    }
}

export default TtsOpenAI;
