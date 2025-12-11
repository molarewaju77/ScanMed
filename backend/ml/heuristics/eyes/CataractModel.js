import { Jimp } from "jimp";

export class CataractModel {
    /**
     * Analyzes an image for signs of cataracts (cloudiness/whitening of the pupil).
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Analysis result { score: 0-100, label: 'Clear'|'Cloudy', risk: 'Low'|'High' }
     */
    static async analyze(imageBuffer) {
        try {
            const image = await Jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            // Heuristic Warning: Without facial landmarks, finding the pupil is hard.
            // Assumption: The user centers their eye in the image.
            // We scan the center 20% of the image looking for "cloudiness".

            const startX = Math.floor(width * 0.40);
            const endX = Math.floor(width * 0.60);
            const startY = Math.floor(height * 0.40);
            const endY = Math.floor(height * 0.60);

            let totalPixels = 0;
            let cloudyPixels = 0;
            let avgBrightness = 0;

            image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
                const r = image.bitmap.data[idx + 0];
                const g = image.bitmap.data[idx + 1];
                const b = image.bitmap.data[idx + 2];

                totalPixels++;
                const brightness = (r + g + b) / 3;
                avgBrightness += brightness;

                // Cataract Logic: Pupil should be dark (low brightness).
                // If the center area is hazy/white/gray, it might be a cataract.
                // Cloudiness = High brightness + Low Saturation (Gray/White)

                const isGray = Math.abs(r - g) < 20 && Math.abs(g - b) < 20;

                // If it's bright and gray in the center of the eye...
                if (brightness > 100 && isGray) {
                    cloudyPixels++;
                }
            });

            if (totalPixels === 0) return { risk: "Unknown", confidence: 0 };

            avgBrightness = avgBrightness / totalPixels;
            const cloudinessRatio = cloudyPixels / totalPixels;

            let score = Math.min(Math.round(cloudinessRatio * 200), 100); // Scale
            let label = "Clear";
            let risk = "Low";

            // If the center is very dark, it's likely a healthy pupil
            if (avgBrightness < 60) {
                score = 0;
                label = "Clear Pupil";
                risk = "Low";
            } else if (score > 50) {
                label = "Cloudy / Hazy";
                risk = "High";
            } else if (score > 20) {
                label = "Mild Haze";
                risk = "Moderate";
            }

            return {
                score,
                label,
                risk,
                details: {
                    cloudinessRatio: cloudinessRatio.toFixed(4),
                    avgCenterBrightness: avgBrightness.toFixed(2)
                }
            };

        } catch (error) {
            console.error("CataractModel Error:", error);
            return { risk: "Error", confidence: 0 };
        }
    }
}
