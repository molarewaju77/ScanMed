import { Jimp } from "jimp";

export class FatigueDetector {
    /**
     * Analyzes an image for signs of eye fatigue/tiredness (dark circles, puffiness).
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Analysis result { score: 0-100, label: 'Rested'|'Tired', isFatigued: boolean }
     */
    static async analyze(imageBuffer) {
        try {
            const image = await Jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            // Heuristic: Check for DARK areas around the eyes (under-eye darkness)
            // Without facial landmarks, we scan the lower-middle region of the image
            // Assumption: User centers their face/eyes in the image

            // Scan lower portion of center region (where dark circles would appear)
            const startX = Math.floor(width * 0.3);
            const endX = Math.floor(width * 0.7);
            const startY = Math.floor(height * 0.5); // Below center (under eyes)
            const endY = Math.floor(height * 0.7);

            let totalPixels = 0;
            let darkPixelCount = 0;
            let avgBrightness = 0;

            image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
                const r = image.bitmap.data[idx + 0];
                const g = image.bitmap.data[idx + 1];
                const b = image.bitmap.data[idx + 2];

                totalPixels++;
                const brightness = (r + g + b) / 3;
                avgBrightness += brightness;

                // Dark circles: Low brightness + bluish/purplish tint
                // We're looking for patches that are darker than normal skin
                if (brightness < 80) {
                    darkPixelCount++;
                }
            });

            if (totalPixels === 0) return { score: 0, label: "Unknown", isFatigued: false };

            avgBrightness = avgBrightness / totalPixels;
            const darkRatio = darkPixelCount / totalPixels;

            // Scoring
            let score = Math.min(Math.round(darkRatio * 200), 100);
            let label = "Rested";
            let isFatigued = false;

            // Normal under-eye area should be relatively bright (skin tone ~100-180)
            // If avgBrightness is very low, it suggests dark circles
            if (avgBrightness < 60 || score > 60) {
                label = "Severe Fatigue / Dark Circles";
                isFatigued = true;
            } else if (avgBrightness < 90 || score > 30) {
                label = "Mild Fatigue / Tired Eyes";
                isFatigued = true;
            }

            return {
                score,
                label,
                isFatigued,
                confidence: score,
                details: {
                    darkRatio: darkRatio.toFixed(4),
                    avgUnderEyeBrightness: avgBrightness.toFixed(2)
                }
            };

        } catch (error) {
            console.error("FatigueDetector Error:", error);
            return { score: 0, label: "Error", isFatigued: false, confidence: 0 };
        }
    }
}
