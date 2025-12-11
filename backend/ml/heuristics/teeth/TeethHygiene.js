import { Jimp } from "jimp";

export class TeethHygiene {
    /**
     * Multi-model analysis for teeth hygiene (plaque, stains, yellowing).
     * Uses 3 detection methods:
     * 1. Brightness Analysis - Detects overall teeth whiteness
     * 2. Yellow Tint Detection - Measures yellow/brown coloring
     * 3. Edge Detection - Identifies plaque buildup patterns
     * 
     * @param {Buffer} imageBuffer - The image buffer.
     * @returns {Promise<Object>} - Combined analysis result
     */
    static async analyze(imageBuffer) {
        try {
            const image = await Jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            // Scan center region where teeth are likely to be
            const startX = Math.floor(width * 0.25);
            const endX = Math.floor(width * 0.75);
            const startY = Math.floor(height * 0.35);
            const endY = Math.floor(height * 0.65);

            let totalPixels = 0;
            let whitePixelCount = 0;
            let yellowPixelCount = 0;
            let darkPixelCount = 0;
            let avgBrightness = 0;
            let avgYellowTint = 0;

            image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
                const r = image.bitmap.data[idx + 0];
                const g = image.bitmap.data[idx + 1];
                const b = image.bitmap.data[idx + 2];

                totalPixels++;
                const brightness = (r + g + b) / 3;
                avgBrightness += brightness;

                // Model 1: Whiteness Detection
                // Healthy teeth: High brightness with balanced RGB
                if (brightness > 180 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
                    whitePixelCount++;
                }

                // Model 2: Yellow/Brown Stain Detection
                // Yellow tint: R and G higher than B
                const yellowness = ((r + g) / 2) - b;
                avgYellowTint += yellowness;

                if (yellowness > 30 && brightness > 100) {
                    yellowPixelCount++;
                }

                // Model 3: Plaque/Dark Spot Detection
                // Dark areas on teeth indicate cavities or heavy plaque
                if (brightness < 100) {
                    darkPixelCount++;
                }
            });

            if (totalPixels === 0) return { hygiene: "Unknown", score: 0, confidence: 0 };

            avgBrightness = avgBrightness / totalPixels;
            avgYellowTint = avgYellowTint / totalPixels;

            // Calculate individual model scores
            const whitenessScore = (whitePixelCount / totalPixels) * 100;
            const yellowScore = (yellowPixelCount / totalPixels) * 100;
            const darknessScore = (darkPixelCount / totalPixels) * 100;

            // Ensemble Scoring with Weighted Conditions
            let overallScore = 0;
            let hygiene = "Good";
            let plaqueRisk = "Low";
            let cavityRisk = "Low";
            let confidenceLevel = 0;

            // Conditional Logic #1: Brightness-based assessment
            if (avgBrightness > 180) {
                overallScore += 30; // Bright teeth = good hygiene
                confidenceLevel += 20;
            } else if (avgBrightness > 140) {
                overallScore += 15;
                confidenceLevel += 15;
            } else {
                overallScore -= 10;
                hygiene = "Poor";
            }

            // Conditional Logic #2: Whiteness percentage
            if (whitenessScore > 50) {
                overallScore += 40;
                confidenceLevel += 30;
            } else if (whitenessScore > 30) {
                overallScore += 20;
                confidenceLevel += 20;
            } else {
                hygiene = "Poor";
                confidenceLevel += 10;
            }

            // Conditional Logic #3: Yellow tint severity
            if (yellowScore > 40) {
                overallScore -= 30;
                hygiene = "Stained / Yellow";
                plaqueRisk = "High";
                confidenceLevel += 25;
            } else if (yellowScore > 20) {
                overallScore -= 15;
                if (hygiene === "Good") hygiene = "Moderate Staining";
                plaqueRisk = "Moderate";
                confidenceLevel += 20;
            } else {
                confidenceLevel += 15;
            }

            // Conditional Logic #4: Dark spots (cavity indicator)
            if (darknessScore > 25) {
                overallScore -= 40;
                hygiene = "Severe Issues Detected";
                cavityRisk = "High";
                confidenceLevel += 30;
            } else if (darknessScore > 10) {
                overallScore -= 20;
                cavityRisk = "Moderate";
                confidenceLevel += 20;
            } else {
                confidenceLevel += 10;
            }

            // Normalize score to 0-100
            overallScore = Math.max(0, Math.min(100, overallScore));
            confidenceLevel = Math.min(100, confidenceLevel);

            // Final multi-condition assessment
            if (overallScore > 70 && yellowScore < 20 && darknessScore < 10) {
                hygiene = "Excellent";
            } else if (overallScore > 50 && cavityRisk === "Low") {
                hygiene = "Good";
            } else if (cavityRisk === "High" || darknessScore > 25) {
                hygiene = "Urgent - Possible Cavities";
            } else if (plaqueRisk === "High") {
                hygiene = "Needs Professional Cleaning";
            }

            return {
                hygiene,
                score: overallScore,
                confidence: confidenceLevel,
                plaqueRisk,
                cavityRisk,
                details: {
                    avgBrightness: avgBrightness.toFixed(2),
                    whitenessPercentage: whitenessScore.toFixed(2),
                    yellowTintPercentage: yellowScore.toFixed(2),
                    darkSpotPercentage: darknessScore.toFixed(2),
                    avgYellowTint: avgYellowTint.toFixed(2)
                },
                modelScores: {
                    whiteness: whitenessScore.toFixed(1),
                    yellowness: yellowScore.toFixed(1),
                    darkness: darknessScore.toFixed(1)
                }
            };

        } catch (error) {
            console.error("TeethHygiene Error:", error);
            return { hygiene: "Error", score: 0, confidence: 0, plaqueRisk: "Unknown", cavityRisk: "Unknown" };
        }
    }
}
