const textToSpeech = require('@google-cloud/text-to-speech');

class TtsGoogle {
    constructor(keyFilename) {
        this.client = new textToSpeech.TextToSpeechClient({ keyFilename });
    }

    async speak(text, languageCode = 'en-US') {
        const request = {
            input: { text: text },
            voice: { languageCode: languageCode, ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [response] = await this.client.synthesizeSpeech(request);
        return response.audioContent;
    }
}

module.exports = TtsGoogle;
