const speech = require('@google-cloud/speech');

class SttGoogle {
    constructor(keyFilename) {
        this.client = new speech.SpeechClient({ keyFilename });
    }

    async transcribe(audioBuffer, languageCode = 'en-US') {
        const audio = { content: audioBuffer.toString('base64') };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: languageCode,
        };

        const [response] = await this.client.recognize({ audio, config });
        return response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
    }
}

module.exports = SttGoogle;
