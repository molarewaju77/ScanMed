import { Jimp } from "jimp";

export class CavityDetector {
    /**
     * Specialized detector for identifying potential cavities via dark spots.
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Cavity risk assessment
     */
    static async analyze(imageBuffer) {
        try {
            const image = await Jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            const startX = Math.floor(width * 0.25);
            const endX = Math.floor(width * 0.75);
            const startY = Math.floor(height * 0.35);
            const endY = Math.floor(height * 0.65);

            let totalPixels = 0;
            let veryDarkPixels = 0;
            let brownishPixels = 0;

            image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
                const r = image.bitmap.data[idx + 0];
                const g = image.bitmap.data[idx + 1];
                const b = image.bitmap.data[idx + 2];

                totalPixels++;
                const brightness = (r + g + b) / 3;

                // Very dark spots (potential deep cavities)
                if (brightness < 60) {
                    veryDarkPixels++;
                }

                // Brownish discoloration (early cavity signs)
                if (r > 80 && r < 140 && g > 60 && g < 120 && b < 80 && brightness < 120) {
                    brownishPixels++;
                }
            });

            if (totalPixels === 0) return { risk: "Unknown", score: 0 };

            const darkRatio = veryDarkPixels / totalPixels;
            const brownRatio = brownishPixels / totalPixels;

            let risk = "Low";
            let score = Math.round((darkRatio + brownRatio) * 200);

            if (darkRatio > 0.15 || brownRatio > 0.20) {
                risk = "High";
            } else if (darkRatio > 0.05 || brownRatio > 0.10) {
                risk = "Moderate";
            }

            return {
                risk,
                score: Math.min(score, 100),
                details: {
                    darkSpotRatio: darkRatio.toFixed(4),
                    brownRatio: brownRatio.toFixed(4)
                }
            };

        } catch (error) {
            console.error("CavityDetector Error:", error);
            return { risk: "Error", score: 0 };
        }
    }
}
