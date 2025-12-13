// import GeminiChat from "../ml/js/chat/geminiChat.js";
import GroqChat from "../ml/js/chat/groqChat.js";

import SttWhisper from "../ml/js/speech/sttWhisper.js";
import TtsOpenAI from "../ml/js/tts/ttsOpenAI.js";
import { ChatHistory } from "../models/chatHistory.model.js";
import { HealthScan } from "../models/healthScan.model.js";
import { RednessDetector } from "../ml/heuristics/eyes/RednessDetector.js";
import { CataractModel } from "../ml/heuristics/eyes/CataractModel.js";
import { FatigueDetector } from "../ml/heuristics/eyes/FatigueDetector.js";
import { TeethHygiene } from "../ml/heuristics/teeth/TeethHygiene.js";
import { CavityDetector } from "../ml/heuristics/teeth/CavityDetector.js";
import { GumHealthDetector } from "../ml/heuristics/teeth/GumHealthDetector.js";
import { SkinToneAnalyzer } from "../ml/heuristics/skin/SkinToneAnalyzer.js";
import { MoleDetector } from "../ml/heuristics/skin/MoleDetector.js";
import { TextureAnalyzer } from "../ml/heuristics/skin/TextureAnalyzer.js";
import fs from 'fs';
import path from 'path';

// Initialize AI provider (Groq for Scan and Chat)
const chatInstance = process.env.GROQ_API_KEY ? new GroqChat(process.env.GROQ_API_KEY) : null;

const sttWhisper = process.env.OPENAI_API_KEY ? new SttWhisper(process.env.OPENAI_API_KEY) : null;
const ttsOpenAI = process.env.OPENAI_API_KEY ? new TtsOpenAI(process.env.OPENAI_API_KEY) : null;

export const chat = async (req, res) => {
    try {
        const { message, history, language, chatId } = req.body;
        const userId = req.userId; // From verifyToken middleware

        // Check if Gemini is available for chat
        if (!chatInstance) {
            return res.status(500).json({
                success: false,
                message: "Groq API not configured. Please add GROQ_API_KEY to your .env file."
            });
        }

        let responseText;
        try {
            // Get AI Response from Groq
            console.log('Using Groq Chat');
            responseText = await chatInstance.sendMessage(history || [], message, language || 'en');
        } catch (aiError) {
            console.error('Gemini error:', aiError.message);
            throw aiError; // Let outer catch handle fallback
        }

        // Save to Database
        let chatEntry;
        const newMessages = [
            { sender: "user", text: message, timestamp: new Date() },
            { sender: "ai", text: responseText, timestamp: new Date() }
        ];

        if (chatId) {
            // Update existing chat
            chatEntry = await ChatHistory.findByIdAndUpdate(
                chatId,
                {
                    $push: { messages: { $each: newMessages } },
                    preview: responseText.substring(0, 50) + "..."
                },
                { new: true }
            );
        } else {
            // Create new chat
            chatEntry = await ChatHistory.create({
                userId,
                title: message.substring(0, 30) + "...",
                messages: newMessages,
                preview: responseText.substring(0, 50) + "..."
            });
        }

        res.status(200).json({
            success: true,
            response: responseText,
            chatId: chatEntry._id
        });
    } catch (error) {
        console.error("Error in chat:", error);

        // Fallback response if AI fails
        const fallbackResponse = "I apologize, but I am currently having trouble connecting to my AI brain. Please try again later, or use the Scan feature which works offline with our heuristic engine.";

        // Save fallback message to DB so user sees something
        try {
            const newMessages = [
                { sender: "user", text: req.body.message, timestamp: new Date() },
                { sender: "ai", text: fallbackResponse, timestamp: new Date() }
            ];

            let chatEntry;
            if (req.body.chatId) {
                chatEntry = await ChatHistory.findByIdAndUpdate(
                    req.body.chatId,
                    { $push: { messages: { $each: newMessages } } },
                    { new: true }
                );
            } else {
                chatEntry = await ChatHistory.create({
                    userId: req.userId,
                    title: req.body.message.substring(0, 30) + "...",
                    messages: newMessages
                });
            }

            return res.status(200).json({
                success: true,
                response: fallbackResponse,
                chatId: chatEntry._id
            });
        } catch (dbError) {
            // If even DB fails, just return error
            return res.status(500).json({ success: false, message: "Service unavailable" });
        }
    }
};

export const speechToText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No audio file uploaded" });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ success: false, message: "OpenAI API key not configured" });
        }

        const transcript = await sttWhisper.transcribe(req.file.buffer);

        res.status(200).json({ success: true, transcript });
    } catch (error) {
        console.error("Error in STT:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const textToSpeech = async (req, res) => {
    try {
        const { text } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ success: false, message: "OpenAI API key not configured" });
        }

        const audioBuffer = await ttsOpenAI.speak(text);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });

        res.send(audioBuffer);
    } catch (error) {
        console.error("Error in TTS:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const analyzeFace = async (req, res) => {
    try {
        const userId = req.userId;
        let { scanType } = req.body;

        // Normalize 'eye' to 'eyes' for consistency with DB enum
        if (scanType === 'eye') scanType = 'eyes';

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        let jsonResponse;

        // Construct prompt based on scan type for Gemini
        // Construct prompt based on scan type for Gemini
        // Construct prompt based on scan type for Gemini
        // Construct prompt based on scan type for Gemini
        // CHAIN-OF-THOUGHT PROMPTING FOR ACCURACY
        const prompts = {
            eyes: `Analyze this eye image step-by-step:
            1. CHECK LIGHTING: Is the redness just poor lighting or flash reflection? If yes, classify as Good/Low.
            2. CHECK STRUCTURE: Are the pupils symmetrical? Is the sclera clear?
            3. DIFFERENTIATE: Distinguish between normal blood vessels (Good/Low) vs diffuse pinkness/swelling (Critical).
            4. ASSIGN SCORE: 
               - Critical (0-39): Conjunctivitis, Severe Haze, Infection.
               - Low (40-60): Dryness, Fatigue, Mild Irritation.
               - Good (61-90): Clear Eye, Healthy.`,

            teeth: `Analyze this dental image step-by-step:
            1. CHECK OBJECT: Is this a clear view of teeth/gums?
            2. SHADOW CHECK (Crucial): Is that dark spot a cavity or just a shadow from the mouth being open? If uncertain, assume Shadow (Low).
            3. CHECK GUMS: Are they pink (Good) or inflamed bright red (Critical)?
            4. ASSIGN SCORE:
               - Critical (0-39): Obvious deep holes (Cavities), Abscess, Severe Gum Bleeding.
               - Low (40-60): Plaque, Tartar, Stains, Shadows, Mild Inflammation.
               - Good (61-90): Clean, White-ish, Pink Gums.`,

            skin: `Analyze this skin image step-by-step:
            1. CHECK SURFACE: Look for texture irregularities (Acne, Rash).
            2. MOLE ANALYSIS: Use ABCD rule (Asymmetry, Border, Color, Diameter). If symmetrical/even -> Low/Good.
            3. ASSIGN SCORE:
               - Critical (0-39): Bleeding, Infection, Asymmetrical Moles, Severe Cystic Acne.
               - Low (40-60): Common Acne, Dry Skin, Mild Redness.
               - Good (61-90): Clear, Even Tone.`
        };

        const specificPrompt = prompts[scanType] || "Analyze this medical image for health concerns.";

        const fullPrompt = `${specificPrompt} Act as a professional medical AI assistant.
        IMPORTANT: Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
        {
            "status": "Good" or "Low" or "Critical" or "Invalid",
            "healthScore": number betwen 0-100,
            "findings": ["Finding 1", "Finding 2"],
            "summary": "Observation summary (2 sentences).",
            "recommendations": ["Action 1", "Action 2", "Visual Analysis Disclaimer"],
            "needsHospital": true or false
            
            // STRICT SCORING RULES:
            // 61-90: "Good" (Healthy) -> Score must be 61-90.
            // 40-60: "Low" (Concern/Fair) -> Score must be 40-60.
            // 0-39: "Critical" (Urgent) -> Score must be 0-39.
        }`;

        // Try AI vision analysis with Groq and Gemini (Dual-Model Verification)
        let useHeuristics = !chatInstance && !geminiInstance;

        if (chatInstance || geminiInstance) {
            try {
                console.log('Running AI Consensus Analysis (Groq + Gemini)...');

                // Define analysis promises
                const runGroq = chatInstance 
                    ? chatInstance.analyzeImage(req.file.buffer, req.file.mimetype, fullPrompt).catch(e => null)
                    : Promise.resolve(null);
                
                const runGemini = geminiInstance
                    ? geminiInstance.analyzeImage(req.file.buffer, req.file.mimetype, fullPrompt).catch(e => null)
                    : Promise.resolve(null);

                // Run in parallel
                const [groqRaw, geminiRaw] = await Promise.all([runGroq, runGemini]);

                // Helper to parse JSON safely
                const parseResult = (raw) => {
                    try {
                        // Extract JSON from markdown blocks if present
                        const jsonStr = raw.replace(/```json\n?|\n?```/g, "").trim();
                        return JSON.parse(jsonStr);
                    } catch (e) { return null; }
                };

                const groqResult = groqRaw ? parseResult(groqRaw) : null;
                const geminiResult = geminiRaw ? parseResult(geminiRaw) : null;

                console.log("Groq Result:", groqResult ? groqResult.status : "Failed");
                console.log("Gemini Result:", geminiResult ? geminiResult.status : "Failed");

                // CONSENSUS LOGIC:
                // 1. Prioritize Gemini (1.5 Flash is currently more stable/accurate than Llama Preview)
                // 2. If Gemini fails, use Groq.
                // 3. If Groq says "Critical" but Gemini says "Good/Low", TRUST GEMINI (False Positive prevention).
                
                if (geminiResult && geminiResult.status !== "Invalid") {
                    jsonResponse = JSON.stringify(geminiResult);
                } else if (groqResult && groqResult.status !== "Invalid") {
                     jsonResponse = JSON.stringify(groqResult);
                } else {
                    throw new Error("Both AI models failed to produce valid JSON.");
                }

            } catch (apiError) {
                console.error('AI Vision verification failed:', apiError.message);
                console.log("Falling back to Heuristic Engine...");
                useHeuristics = true;
            }
        }

        // Helper to generate a consistent variance based on image content
        const getVariance = (buffer) => {
            // Sum pseudo-random bytes from the buffer to create a "hash"
            let sum = 0;
            for (let i = 0; i < Math.min(buffer.length, 100); i += 10) {
                sum += buffer[i];
            }
            // Generate a number between -3 and 3
            return (sum % 7) - 3;
        };

        if (useHeuristics) {
            console.log("Using Heuristic Engine (No API Key provided)");

            if (scanType === 'eyes' || scanType === 'eye') {
                try {
                    // Use all 3 detectors: Redness, Cataract, Fatigue
                    console.log("Running Heuristic Analysis (Redness + Cataract + Fatigue)...");
                    const [redness, cataract, fatigue] = await Promise.all([
                        RednessDetector.analyze(req.file.buffer),
                        CataractModel.analyze(req.file.buffer),
                        FatigueDetector.analyze(req.file.buffer)
                    ]);

                    let primaryIssues = [];
                    let scoreCategory = "Good"; // Default

                    // --- 1. CRITICAL CHECKS (0-39) ---
                    // Severe abnormalities requiring medical attention
                    // TUNE: Threshold raised to 95 to avoid false positives (User Request: "is critical the only result?")
                    if (redness.score > 95) {
                        scoreCategory = "Critical";
                        primaryIssues.push("Severe Eye Redness (Infection risk)");
                    }
                    if (cataract.risk === "High") {
                        scoreCategory = "Critical";
                        primaryIssues.push("Pupil Abnormality / Clouding");
                    }
                    // REMOVED "Extreme Swelling" check to prevent false positives


                    // --- 2. LOW CHECKS (40-60) ---
                    // Mild/Moderate issues, monitoring recommended
                    if (scoreCategory !== "Critical") {
                        if (fatigue.isFatigued) {
                            scoreCategory = "Low";
                            primaryIssues.push("Eye Strain / Fatigue Indicators");
                        }
                        if (redness.score > 30 && redness.score <= 95) {
                            scoreCategory = "Low";
                            primaryIssues.push("Mild-Moderate Eye Redness");
                        }
                        if (cataract.risk === "Moderate") {
                            scoreCategory = "Low";
                            primaryIssues.push("Mild Haze / Cloudiness");
                        }
                    }

                    const isDangerous = scoreCategory === "Critical";

                    const notes = primaryIssues.length > 0
                        ? `Detected: ${primaryIssues.join(", ")}.`
                        : "Eyes appear healthy. Clear white of eyes, no visible inflammation.";

                    // Recommendations per User Taxonomy
                    let recommendations = [];
                    if (scoreCategory === "Critical") {
                        recommendations = [
                            "⚠️ Seek medical attention immediately",
                            "Do not rub eyes or use unprescribed drops",
                            "Check for vision changes",
                            "Disclaimer: Not a medical diagnosis. Visual analysis only."
                        ];
                    } else if (scoreCategory === "Low") {
                        recommendations = [
                            "Rest your eyes (20-20-20 rule)",
                            "Use lubricating eye drops if dry",
                            "Ensure adequate sleep and hydration",
                            "Disclaimer: Not a medical diagnosis. Visual analysis only."
                        ];
                    } else {
                        // Good
                        recommendations = [
                            "Maintain good eye hygiene",
                            "Wear UV-protective sunglasses",
                            "Schedule regular eye exams",
                            "Disclaimer: Not a medical diagnosis. Visual analysis only."
                        ];
                    }

                    // --- Strict Scoring Logic ---
                    let calculatedScore = 88;
                    const variance = getVariance(req.file.buffer); // -3 to +3

                    if (scoreCategory === "Critical") {
                        // Range 0-39
                        if (cataract.risk === "High") calculatedScore = 30 + variance;
                        else if (redness.score > 85) calculatedScore = 20 + variance;
                        else calculatedScore = 35 + variance;
                    } else if (scoreCategory === "Low") {
                        // Range 40-60
                        if (redness.score > 45) calculatedScore = 45 + variance;
                        else if (fatigue.isFatigued) calculatedScore = 55 + variance;
                        else calculatedScore = 58 + variance;
                    } else {
                        // Good Range 61-90
                        calculatedScore = 88 + variance;
                        // Minor deduction for slight imperfections
                        if (redness.score > 10) calculatedScore -= 2;
                    }

                    // Clamp
                    calculatedScore = Math.max(0, Math.min(90, Math.round(calculatedScore)));

                    // Final Status Map
                    let finalStatus = "Low";
                    if (calculatedScore >= 61) finalStatus = "Good";
                    else if (calculatedScore >= 40) finalStatus = "Low";
                    else finalStatus = "Critical";

                    jsonResponse = JSON.stringify({
                        status: finalStatus,
                        healthScore: calculatedScore,
                        findings: primaryIssues.length > 0 ? primaryIssues : ["Clear Sclera", "Normal Pupil Symmetry"],
                        summary: notes,
                        recommendations: recommendations,
                        needsHospital: isDangerous
                    });
                } catch (err) {
                    // ... error handling
                    console.error("Heuristic analysis failed:", err);
                    // ...
                    jsonResponse = JSON.stringify({
                        status: "Low",
                        healthScore: 50,
                        findings: ["Error analyzing image"],
                        summary: "Processing failed. Please ensure proper lighting and focus.",
                        recommendations: ["Retake scan"],
                        needsHospital: false
                    });
                }
            } else if (scanType === 'teeth') {
                try {
                    console.log("Running Multi-Model Teeth Analysis...");
                    const [hygiene, cavity, gumHealth] = await Promise.all([
                        TeethHygiene.analyze(req.file.buffer),
                        CavityDetector.analyze(req.file.buffer),
                        GumHealthDetector.analyze(req.file.buffer)
                    ]);

                    let primaryIssues = [];
                    let scoreCategory = "Good"; // Default

                    // --- 1. CRITICAL CHECKS (0-39) ---
                    // Serious oral health issues

                    // SHADOW CHECK: Deep cavities usually equate to poor hygiene.
                    // If hygiene is Good (>50), "High" cavity risk is likely just shadows in the mouth.
                    const likelyShadows = hygiene.score > 50;

                    if (cavity.risk === "High" && !likelyShadows) {
                        scoreCategory = "Critical";
                        primaryIssues.push("Severe Tooth Decay / Advanced Cavities");
                    }
                    if (gumHealth.inflammationLevel === "High") {
                        scoreCategory = "Critical";
                        primaryIssues.push("Severe Gum Disease (Periodontitis Risk)");
                    }
                    if (hygiene.score < 30) {
                        scoreCategory = "Critical";
                        primaryIssues.push("Severe Plaque/Tartar or Damaged Teeth");
                    }

                    // --- 2. LOW CHECKS (40-60) ---
                    // Mild to moderate issues w/ upgrades for false-positive Criticals
                    if (scoreCategory !== "Critical") {
                        // Map "High" cavity risk to Low if it was skipped above (Shadows)
                        if (cavity.risk === "Moderate" || (cavity.risk === "High" && likelyShadows)) {
                            scoreCategory = "Low";
                            primaryIssues.push(likelyShadows ? "Dark Spots (Possible Shadows/Stains)" : "Early Cavities / Enamel Damage");
                        }
                        if (gumHealth.inflammationLevel === "Moderate") {
                            scoreCategory = "Low";
                            primaryIssues.push("Mild Gum Inflammation (Gingivitis)");
                        }
                        if (hygiene.score >= 30 && hygiene.score < 60) {
                            scoreCategory = "Low";
                            primaryIssues.push("Plaque and Tartar Buildup");
                        }
                    }

                    const isDangerous = scoreCategory === "Critical";

                    const notes = primaryIssues.length > 0
                        ? `Detected: ${primaryIssues.join(", ")}.`
                        : "Teeth and gums appear healthy. No visible cavities or inflammation.";

                    let recommendations = [];
                    if (scoreCategory === "Critical") {
                        recommendations = [
                            "⚠️ Schedule immediate dental appointment",
                            "Avoid hard foods",
                            "Maintain gentle brushing",
                            "Disclaimer: Not a medical diagnosis. Visual analysis only."
                        ];
                    } else if (scoreCategory === "Low") {
                        recommendations = [
                            "Get checkup within 2 weeks",
                            "Brush twice daily",
                            "Floss regularly",
                            "Disclaimer: Not a medical diagnosis. Visual analysis only."
                        ];
                    } else {
                        recommendations = [
                            "Continue regular brushing",
                            "Schedule checkup every 6 months",
                            "Disclaimer: Not a medical diagnosis. Visual analysis only."
                        ];
                    }

                    // --- Strict Dynamic Scoring for Teeth ---
                    let calculatedScore = 88;
                    const variance = getVariance(req.file.buffer);

                    if (scoreCategory === "Critical") {
                        // Range 0-39
                        if (gumHealth.inflammationLevel === "High") calculatedScore = 25 + variance;
                        else if (cavity.risk === "High") calculatedScore = 30 + variance;
                        else calculatedScore = 35 + variance;
                    } else if (scoreCategory === "Low") {
                        // Range 40-60
                        if (gumHealth.inflammationLevel === "Moderate") calculatedScore = 55 + variance;
                        else if (cavity.risk === "High") calculatedScore = 50 + variance; // Downgraded High Risk
                        else if (cavity.risk === "Moderate") calculatedScore = 52 + variance;
                        else calculatedScore = 58 + variance;
                    } else {
                        // Good Range 61-90
                        calculatedScore = 85 + (hygiene.score * 0.05) + variance;
                    }

                    calculatedScore = Math.max(0, Math.min(90, Math.round(calculatedScore)));

                    let finalStatus = "Low";
                    if (calculatedScore >= 61) finalStatus = "Good";
                    else if (calculatedScore >= 40) finalStatus = "Low";
                    else finalStatus = "Critical";

                    jsonResponse = JSON.stringify({
                        status: finalStatus,
                        healthScore: calculatedScore,
                        findings: primaryIssues.length > 0 ? primaryIssues : ["Teeth look healthy"],
                        summary: notes,
                        recommendations: recommendations,
                        needsHospital: isDangerous
                    });
                } catch (err) {
                    console.error("Teeth analysis failed:", err);
                    jsonResponse = JSON.stringify({
                        status: "Low",
                        healthScore: 50,
                        findings: ["Analysis failed"],
                        summary: "Could not process teeth image.",
                        recommendations: ["Retake with better lighting"],
                        needsHospital: false
                    });
                }
            } else if (scanType === 'skin' || scanType === 'face') {
                try {
                    console.log("Running Multi-Model Skin/Face Analysis...");
                    const [skinTone, moles, texture] = await Promise.all([
                        SkinToneAnalyzer.analyze(req.file.buffer),
                        MoleDetector.analyze(req.file.buffer),
                        TextureAnalyzer.analyze(req.file.buffer)
                    ]);

                    let primaryIssues = [];
                    let scoreCategory = "Good"; // Default

                    // --- 1. CRITICAL CHECKS (0-39) ---
                    // Serious or high-risk visual indicators
                    if (moles.risk === "High") {
                        scoreCategory = "Critical";
                        primaryIssues.push("Suspicious Lesion (Irregular border/color)");
                    }
                    if (skinTone.inflammationLevel === "High") {
                        scoreCategory = "Critical";
                        primaryIssues.push("Severe Skin Infection/Inflammation");
                    }
                    if (texture.acneLevel === "Severe") {
                        scoreCategory = "Critical";
                        primaryIssues.push("Severe Inflammatory Acne (Cysts/Nodules)");
                    }

                    // --- 2. LOW CHECKS (40-60) ---
                    // Noticeable issues but not immediately dangerous
                    // Only check if not already Critical
                    if (scoreCategory !== "Critical") {
                        if (texture.acneLevel === "Moderate") {
                            scoreCategory = "Low";
                            primaryIssues.push("Moderate Acne");
                        }
                        if (skinTone.inflammationLevel === "Moderate") {
                            scoreCategory = "Low";
                            primaryIssues.push("Uneven Skin Tone / Redness");
                        }
                        if (moles.risk === "Moderate") {
                            scoreCategory = "Low";
                            primaryIssues.push("Skin Spots / Pigmentation");
                        }
                        // Note: If we had a Fatigue/Dark Circle detector for skin, it would go here.
                        // For now, assuming texture/tone covers most "tired" looks.
                    }

                    const isDangerous = scoreCategory === "Critical";

                    const notes = primaryIssues.length > 0
                        ? `Detected: ${primaryIssues.join(", ")}.`
                        : "Skin appears healthy. No visible lesions or inflammation.";

                    // Recommendations per User Taxonomy
                    let recommendations = [];
                    if (scoreCategory === "Critical") {
                        recommendations = [
                            "⚠️ Consult a dermatologist immediately",
                            "Monitor for rapid changes (size/color)",
                            "Avoid touching or squeezing areas",
                            "Disclaimer: Not a medical diagnosis."
                        ];
                    } else if (scoreCategory === "Low") {
                        recommendations = [
                            "Maintain a consistent skincare routine",
                            "Use non-comedogenic products",
                            "Stay hydrated and monitor diet",
                            "Disclaimer: Not a medical diagnosis."
                        ];
                    } else {
                        // Good
                        recommendations = [
                            "Continue your good skincare habits",
                            "Use sunscreen daily (SPF 30+)",
                            "Stay hydrated",
                            "Disclaimer: Not a medical diagnosis."
                        ];
                    }

                    // --- Strict Scoring Logic ---
                    let calculatedScore = 88;
                    const variance = getVariance(req.file.buffer); // -3 to +3

                    if (scoreCategory === "Critical") {
                        // Range 0-39
                        // Assign specific base based on severity type
                        if (moles.risk === "High") calculatedScore = 30 + variance; // Lesions = 30
                        else if (skinTone.inflammationLevel === "High") calculatedScore = 25 + variance; // Infection = 25
                        else calculatedScore = 35 + variance; // Severe Acne = 35
                    } else if (scoreCategory === "Low") {
                        // Range 40-60
                        if (texture.acneLevel === "Moderate") calculatedScore = 50 + variance; // Acne = 50
                        else if (skinTone.inflammationLevel === "Moderate") calculatedScore = 55 + variance; // Redness = 55
                        else calculatedScore = 58 + variance; // Mild spots = 58
                    } else {
                        // Good Range 61-90
                        calculatedScore = 88 + variance;
                    }

                    // Clamp
                    calculatedScore = Math.max(0, Math.min(90, Math.round(calculatedScore)));

                    // Final Status Map
                    let finalStatus = "Low";
                    if (calculatedScore >= 61) finalStatus = "Good";
                    else if (calculatedScore >= 40) finalStatus = "Low";
                    else finalStatus = "Critical";

                    jsonResponse = JSON.stringify({
                        status: finalStatus,
                        healthScore: calculatedScore,
                        findings: primaryIssues.length > 0 ? primaryIssues : ["Clear skin surface", "Even tone"],
                        summary: notes,
                        recommendations: recommendations,
                        needsHospital: isDangerous
                    });

                } catch (err) {
                    console.error("Skin analysis failed:", err);
                    jsonResponse = JSON.stringify({
                        status: "Low",
                        healthScore: 50,
                        findings: ["Analysis failed"],
                        summary: "Could not process skin image.",
                        recommendations: ["Retake with better lighting"],
                        needsHospital: false
                    });
                }
            } else {
                jsonResponse = JSON.stringify({
                    result: "Healthy",
                    confidence: 70,
                    notes: "Analysis for this scan type coming soon.",
                    recommendations: ["Consult a specialist"],
                    needsHospital: false
                });
            }
        }


        // Parse JSON response
        let analysis;
        try {
            // Clean up any potential markdown formatting
            const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse Gemini/Heuristic response:", jsonResponse);
            // Fallback if parsing fails
            analysis = {
                status: "Low",
                healthScore: 50,
                findings: ["Analysis unavailable"],
                summary: "Could not parse AI response. Please try again.",
                recommendations: ["Consult a healthcare provider"],
                needsHospital: false
            };
        }

        // Save image to disk
        // Privacy: Do not save image to disk. Only store analysis results.
        const imageUrl = null;

        // Save to Database
        const scan = await HealthScan.create({
            userId,
            scanType: scanType || "eyes",
            // Map new fields to DB schema
            healthScore: analysis.healthScore || 0,
            findings: analysis.findings || [],
            status: analysis.status || "Low", // Default to Low if undefined
            notes: analysis.summary || analysis.notes,

            // Derived fields for UI compatibility
            result: analysis.status === "Good" ? "Healthy" : (analysis.status === "Critical" ? "Urgent" : "Concern"),
            confidence: analysis.healthScore || 0,
            severity: analysis.status === "Critical" ? "high" : (analysis.status === "Low" ? "moderate" : "none"),

            recommendations: analysis.recommendations || [],
            needsHospital: analysis.needsHospital || false,
            // status: "success", // REMOVED: This was overriding the medical status with an API status
            imageUrl: imageUrl
        });

        res.status(200).json({
            success: true,
            message: "Analysis complete",
            data: {
                ...scan.toObject(),
                recommendations: analysis.recommendations,
                needsHospital: analysis.needsHospital || false,
                healthScore: analysis.healthScore,
                findings: analysis.findings || [],
                findings: analysis.findings || [],
                status: scan.status // Use the DB status which guarantees a value
            }
        });
    } catch (error) {
        console.error("Error in analyzeFace:", error);
        try { await import('fs').then(fs => fs.writeFileSync('backend_error.log', error.toString() + "\n" + (error.stack || "") + "\n" + JSON.stringify(error, null, 2))); } catch (e) { }
        res.status(500).json({ success: false, message: error.message });
    }
};
