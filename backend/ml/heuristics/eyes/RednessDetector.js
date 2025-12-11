import { Jimp } from "jimp";

export class RednessDetector {
    /**
     * Analyzes an image for eye redness.
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Analysis result { score: 0-100, label: 'Healthy'|'Irritated'|'Infected' }
     */
    static async analyze(imageBuffer) {
        try {
            const image = await Jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            let redPixelCount = 0;
            let whitePixelCount = 0;
            let totalPixels = 0;

            // Simple heuristic: Scan center 50% of image where eye likely is
            const startX = Math.floor(width * 0.25);
            const endX = Math.floor(width * 0.75);
            const startY = Math.floor(height * 0.25);
            const endY = Math.floor(height * 0.75);

            image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
                const r = image.bitmap.data[idx + 0];
                const g = image.bitmap.data[idx + 1];
                const b = image.bitmap.data[idx + 2];

                totalPixels++;

                // Detect "White" (Sclera candidates) - High brightness, low saturation
                // R, G, B should be relatively high and close to each other
                if (r > 150 && g > 150 && b > 150 && Math.abs(r - g) < 30 && Math.abs(r - b) < 30) {
                    whitePixelCount++;
                }

                // Detect "Red" (Inflammation/Blood vessels)
                // R dominant, significantly higher than G and B
                if (r > 100 && r > g * 1.4 && r > b * 1.4) {
                    redPixelCount++;
                }
            });

            // Avoid division by zero
            if (totalPixels === 0) return { score: 0, label: "Unknown" };

            // Logic: Percentage of red pixels relative to "eye area" pixels found
            // We assume "white" pixels + "red" pixels roughly make up the sclera region we care about.
            const eyeAreaPixels = whitePixelCount + redPixelCount;

            // If we didn't find enough "eye-like" pixels, it might not be an eye or bad lighting
            if (eyeAreaPixels < totalPixels * 0.05) {
                return { score: 0, label: "Unclear (Low Eye Confidence)" };
            }

            const rednessRatio = redPixelCount / eyeAreaPixels;

            // Scoring (Calibration needed, but these are decent starting heuristics)
            // Normal eye has very few red pixels in sclera (veins are thin)
            // > 5% red pixels in sclera region is likely irritated
            // > 15% is likely infected/pink eye

            let score = Math.min(Math.round(rednessRatio * 400), 100); // Scale up ratio to 0-100
            let label = "Healthy";
            let severity = "None";

            if (score > 60) {
                label = "Severe Inflammation";
                severity = "High";
            } else if (score > 30) {
                label = "Irritated / Red";
                severity = "Moderate";
            } else if (score > 15) {
                label = "Mild Redness";
                severity = "Low";
            }

            return {
                score,
                label,
                severity,
                details: {
                    redPixels: redPixelCount,
                    scleraPixels: whitePixelCount,
                    ratio: rednessRatio.toFixed(4)
                }
            };

        } catch (error) {
            console.error("RednessDetector Error:", error);
            throw new Error("Failed to process image for redness detection");
        }
    }
}
