import { Jimp } from "jimp";

export class TextureAnalyzer {
    /**
     * Analyzes skin texture for acne, roughness, and irregularities.
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Texture analysis result
     */
    static async analyze(imageBuffer) {
        try {
            const image = await Jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            const startX = Math.floor(width * 0.2);
            const endX = Math.floor(width * 0.8);
            const startY = Math.floor(height * 0.2);
            const endY = Math.floor(height * 0.8);

            let brightnessValues = [];
            let redValues = [];

            image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
                const r = image.bitmap.data[idx + 0];
                const g = image.bitmap.data[idx + 1];
                const b = image.bitmap.data[idx + 2];

                const brightness = (r + g + b) / 3;
                brightnessValues.push(brightness);
                redValues.push(r - ((g + b) / 2));
            });

            if (brightnessValues.length === 0) return { texture: "Unknown", score: 0 };

            // Calculate variance (high variance = bumpy/acne texture)
            const avgBrightness = brightnessValues.reduce((a, b) => a + b, 0) / brightnessValues.length;
            const brightnessVariance = brightnessValues.reduce((sum, val) =>
                sum + Math.pow(val - avgBrightness, 2), 0) / brightnessValues.length;

            const avgRed = redValues.reduce((a, b) => a + b, 0) / redValues.length;
            const redVariance = redValues.reduce((sum, val) =>
                sum + Math.pow(val - avgRed, 2), 0) / redValues.length;

            // Scoring
            let textureScore = Math.min((brightnessVariance / 10) + (redVariance / 5), 100);
            let texture = "Smooth";
            let acneLevel = "None";

            if (textureScore > 70 || redVariance > 400) {
                texture = "Very Rough / Severe Acne";
                acneLevel = "Severe";
            } else if (textureScore > 45 || redVariance > 200) {
                texture = "Moderate Acne / Bumpy";
                acneLevel = "Moderate";
            } else if (textureScore > 25 || redVariance > 100) {
                texture = "Mild Roughness";
                acneLevel = "Mild";
            }

            return {
                texture,
                acneLevel,
                score: Math.round(textureScore),
                details: {
                    brightnessVariance: brightnessVariance.toFixed(2),
                    redVariance: redVariance.toFixed(2)
                }
            };

        } catch (error) {
            console.error("TextureAnalyzer Error:", error);
            return { texture: "Error", acneLevel: "Unknown", score: 0 };
        }
    }
}
