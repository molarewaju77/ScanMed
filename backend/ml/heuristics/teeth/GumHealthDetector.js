import { Jimp } from "jimp";

export class GumHealthDetector {
    /**
     * Analyzes gum health by detecting redness and inflammation.
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Gum health assessment
     */
    static async analyze(imageBuffer) {
        try {
            const image = await Jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            // Scan upper and lower edges of mouth region (where gums are)
            const regions = [
                { startY: Math.floor(height * 0.30), endY: Math.floor(height * 0.40) }, // Upper gums
                { startY: Math.floor(height * 0.60), endY: Math.floor(height * 0.70) }  // Lower gums
            ];

            let totalPixels = 0;
            let redPixelCount = 0;
            let pinkPixelCount = 0;

            const startX = Math.floor(width * 0.25);
            const endX = Math.floor(width * 0.75);

            regions.forEach(region => {
                image.scan(startX, region.startY, endX - startX, region.endY - region.startY, (x, y, idx) => {
                    const r = image.bitmap.data[idx + 0];
                    const g = image.bitmap.data[idx + 1];
                    const b = image.bitmap.data[idx + 2];

                    totalPixels++;

                    // Healthy gums: Pale pink (balanced RGB with slight red tint)
                    if (r > 150 && r < 220 && g > 120 && g < 180 && b > 120 && b < 180) {
                        pinkPixelCount++;
                    }

                    // Inflamed gums: Strong red coloring
                    if (r > 140 && r > g * 1.3 && r > b * 1.3) {
                        redPixelCount++;
                    }
                });
            });

            if (totalPixels === 0) return { health: "Unknown", score: 0 };

            const redRatio = redPixelCount / totalPixels;
            const pinkRatio = pinkPixelCount / totalPixels;

            let health = "Healthy";
            let inflammationLevel = "None";
            let score = 0;

            if (redRatio > 0.30) {
                health = "Severe Inflammation";
                inflammationLevel = "High";
                score = 80;
            } else if (redRatio > 0.15) {
                health = "Moderate Inflammation";
                inflammationLevel = "Moderate";
                score = 50;
            } else if (pinkRatio > 0.25) {
                health = "Healthy";
                inflammationLevel = "None";
                score = 10;
            } else {
                health = "Unclear";
                score = 20;
            }

            return {
                health,
                inflammationLevel,
                score,
                details: {
                    redRatio: redRatio.toFixed(4),
                    pinkRatio: pinkRatio.toFixed(4)
                }
            };

        } catch (error) {
            console.error("GumHealthDetector Error:", error);
            return { health: "Error", inflammationLevel: "Unknown", score: 0 };
        }
    }
}
