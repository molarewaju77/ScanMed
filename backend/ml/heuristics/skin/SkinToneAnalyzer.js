import { Jimp } from "jimp";

export class SkinToneAnalyzer {
    /**
     * Multi-model skin analysis for redness, inflammation, and rashes.
     * Models: (1) Red tone detection, (2) Inflammation patterns, (3) Skin uniformity
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Analysis result
     */
    static async analyze(imageBuffer) {
        try {
            const image = await Jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            // Scan center region
            const startX = Math.floor(width * 0.2);
            const endX = Math.floor(width * 0.8);
            const startY = Math.floor(height * 0.2);
            const endY = Math.floor(height * 0.8);

            let totalPixels = 0;
            let redPixelCount = 0;
            let normalSkinCount = 0;
            let darkSpotCount = 0;
            let avgRedness = 0;
            let brightnessVariance = [];

            image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
                const r = image.bitmap.data[idx + 0];
                const g = image.bitmap.data[idx + 1];
                const b = image.bitmap.data[idx + 2];

                totalPixels++;
                const brightness = (r + g + b) / 3;
                brightnessVariance.push(brightness);

                // Model 1: Redness Detection (inflammation, rashes)
                const redDominance = r - ((g + b) / 2);
                avgRedness += redDominance;

                if (redDominance > 30 && r > 120) {
                    redPixelCount++;
                }

                // Model 2: Normal Skin Tone (balanced, healthy)
                // Healthy skin: moderate brightness, balanced RGB with slight red tint
                if (brightness > 120 && brightness < 200 &&
                    r > g * 0.9 && r < g * 1.3 &&
                    g > b * 0.9 && g < b * 1.2) {
                    normalSkinCount++;
                }

                // Model 3: Dark spots/hyperpigmentation
                if (brightness < 80) {
                    darkSpotCount++;
                }
            });

            if (totalPixels === 0) return { condition: "Unknown", score: 0, confidence: 0 };

            avgRedness = avgRedness / totalPixels;

            // Calculate uniformity (low variance = uniform skin)
            const avgBrightness = brightnessVariance.reduce((a, b) => a + b, 0) / brightnessVariance.length;
            const variance = brightnessVariance.reduce((sum, val) => sum + Math.pow(val - avgBrightness, 2), 0) / brightnessVariance.length;
            const uniformityScore = 100 - Math.min(variance / 5, 100); // Lower variance = more uniform

            // Individual model scores
            const rednessRatio = redPixelCount / totalPixels;
            const normalRatio = normalSkinCount / totalPixels;
            const darkSpotRatio = darkSpotCount / totalPixels;

            // Ensemble Scoring
            let overallScore = 0;
            let condition = "Healthy";
            let inflammationLevel = "None";
            let confidenceLevel = 0;

            // Condition 1: Severe Redness/Inflammation
            if (rednessRatio > 0.40 || avgRedness > 50) {
                overallScore += 80;
                condition = "Severe Inflammation/Rash";
                inflammationLevel = "High";
                confidenceLevel += 30;
            } else if (rednessRatio > 0.20 || avgRedness > 30) {
                overallScore += 50;
                condition = "Moderate Redness";
                inflammationLevel = "Moderate";
                confidenceLevel += 25;
            } else {
                confidenceLevel += 20;
            }

            // Condition 2: Dark Spots/Hyperpigmentation
            if (darkSpotRatio > 0.25) {
                overallScore += 40;
                if (condition === "Healthy") condition = "Hyperpigmentation Detected";
                confidenceLevel += 20;
            } else if (darkSpotRatio > 0.10) {
                overallScore += 20;
                confidenceLevel += 15;
            } else {
                confidenceLevel += 10;
            }

            // Condition 3: Skin Uniformity
            if (uniformityScore < 40) {
                overallScore += 30;
                if (condition === "Healthy") condition = "Uneven Skin Texture";
                confidenceLevel += 15;
            } else if (uniformityScore < 60) {
                overallScore += 15;
                confidenceLevel += 10;
            } else {
                confidenceLevel += 20;
            }

            // Final Assessment
            if (normalRatio > 0.60 && rednessRatio < 0.15 && uniformityScore > 60) {
                condition = "Healthy Skin";
                overallScore = Math.min(overallScore, 20);
            }

            confidenceLevel = Math.min(100, confidenceLevel);

            return {
                condition,
                score: Math.min(100, overallScore),
                confidence: confidenceLevel,
                inflammationLevel,
                details: {
                    rednessRatio: rednessRatio.toFixed(4),
                    normalSkinRatio: normalRatio.toFixed(4),
                    darkSpotRatio: darkSpotRatio.toFixed(4),
                    uniformityScore: uniformityScore.toFixed(2),
                    avgRedness: avgRedness.toFixed(2)
                }
            };

        } catch (error) {
            console.error("SkinToneAnalyzer Error:", error);
            return { condition: "Error", score: 0, confidence: 0, inflammationLevel: "Unknown" };
        }
    }
}
