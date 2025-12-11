import { Jimp } from "jimp";

export class MoleDetector {
    /**
     * Specialized detector for moles, dark spots, and potential skin irregularities.
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Mole detection result
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

            let totalPixels = 0;
            let veryDarkPixels = 0;
            let brownPixels = 0;
            let blackPixels = 0;

            image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
                const r = image.bitmap.data[idx + 0];
                const g = image.bitmap.data[idx + 1];
                const b = image.bitmap.data[idx + 2];

                totalPixels++;
                const brightness = (r + g + b) / 3;

                // Very dark spots (possible concerning moles)
                if (brightness < 50) {
                    blackPixels++;
                    veryDarkPixels++;
                } else if (brightness < 100) {
                    veryDarkPixels++;
                }

                // Brown patches (common moles/freckles)
                if (r > 60 && r < 130 && g > 40 && g < 100 && b < 80) {
                    brownPixels++;
                }
            });

            if (totalPixels === 0) return { risk: "Unknown", count: 0, score: 0 };

            const darkRatio = veryDarkPixels / totalPixels;
            const brownRatio = brownPixels / totalPixels;
            const blackRatio = blackPixels / totalPixels;

            let risk = "Low";
            let count = 0;
            let score = Math.round((darkRatio + brownRatio) * 200);

            // Estimate mole count (clustering dark pixels)
            if (darkRatio > 0.20) count = "Multiple (5+)";
            else if (darkRatio > 0.10) count = "Several (2-4)";
            else if (darkRatio > 0.03) count = "Few (1-2)";
            else count = "None detected";

            // Risk assessment
            if (blackRatio > 0.10 || darkRatio > 0.25) {
                risk = "High";
            } else if (blackRatio > 0.03 || darkRatio > 0.10) {
                risk = "Moderate";
            }

            return {
                risk,
                count,
                score: Math.min(score, 100),
                details: {
                    darkRatio: darkRatio.toFixed(4),
                    brownRatio: brownRatio.toFixed(4),
                    blackRatio: blackRatio.toFixed(4)
                }
            };

        } catch (error) {
            console.error("MoleDetector Error:", error);
            return { risk: "Error", count: 0, score: 0 };
        }
    }
}
