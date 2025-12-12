import GeminiChat from "../ml/js/chat/geminiChat.js";
import OllamaChat from "../ml/js/chat/ollama/ollamaChat.js";
import HuggingFaceChat from "../ml/js/chat/llama-stack/huggingFaceChat.js";
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

// Initialize AI providers based on environment configuration
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini'; // Options: gemini, ollama, llama-stack

const geminiChat = process.env.GEMINI_API_KEY ? new GeminiChat(process.env.GEMINI_API_KEY) : null;
const ollamaChat = new OllamaChat(); // Ollama runs locally, no API key needed
const huggingFaceChat = new HuggingFaceChat(); // Hugging Face cloud API, no local installation

const sttWhisper = process.env.OPENAI_API_KEY ? new SttWhisper(process.env.OPENAI_API_KEY) : null;
const ttsOpenAI = process.env.OPENAI_API_KEY ? new TtsOpenAI(process.env.OPENAI_API_KEY) : null;

/**
 * Get the active AI client based on environment configuration
 * Falls back to next available provider if primary is unavailable
 */
function getAIClient() {
    const providers = {
        'gemini': geminiChat,
        'ollama': ollamaChat,
        'huggingface': huggingFaceChat
    };

    // Try primary provider
    const primary = providers[AI_PROVIDER];
    if (primary) {
        console.log(`Using AI Provider: ${AI_PROVIDER}`);
        return { client: primary, provider: AI_PROVIDER };
    }

    // Fallback chain: Ollama → Hugging Face → Gemini
    const fallbackOrder = ['ollama', 'huggingface', 'gemini'];
    for (const providerName of fallbackOrder) {
        const client = providers[providerName];
        if (client) {
            console.log(`Primary provider '${AI_PROVIDER}' not available. Using fallback: ${providerName}`);
            return { client, provider: providerName };
        }
    }

    return { client: null, provider: null };
}

export const chat = async (req, res) => {
    try {
        const { message, history, language, chatId } = req.body;
        const userId = req.userId; // From verifyToken middleware

        // Get active AI client with fallback support
        const { client: aiClient, provider } = getAIClient();

        if (!aiClient) {
            return res.status(500).json({
                success: false,
                message: "No AI provider available. Please configure Ollama, Llama Stack, or Gemini API."
            });
        }

        let responseText;
        try {
            // Get AI Response from active provider
            responseText = await aiClient.sendMessage(history || [], message, language || 'en');
        } catch (providerError) {
            console.error(`${provider} error:`, providerError.message);

            // Try fallback to heuristic response for chat
            throw providerError; // Let outer catch handle fallback
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
        const prompts = {
            eyes: "Analyze this eye image for redness, jaundice, cataracts, fatigue, or other visible conditions.",
            teeth: "Analyze this dental image for plaque, cavities, or gum issues.",
            skin: "Analyze this skin image for rashes, moles, or dermatological concerns."
        };

        const specificPrompt = prompts[scanType] || "Analyze this medical image for health concerns.";

        const fullPrompt = `${specificPrompt} Act as a professional medical AI assistant.
        IMPORTANT: Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
        {
            "result": "Healthy" or "Concern" or "Urgent",
            "confidence": number between 70-99,
            "notes": "Brief, professional medical observation (max 2 sentences)",
            "recommendations": ["Action 1", "Action 2", "Action 3"],
            "needsHospital": true or false,
            "severity": "none" or "moderate" or "high"
        }`;

        // Try AI vision analysis with active provider
        const { client: visionClient, provider: visionProvider } = getAIClient();
        let useHeuristics = !visionClient;

        if (visionClient) {
            try {
                // Call AI Vision (Gemini, Ollama Vision, or Llama Stack)
                console.log(`Using ${visionProvider} for image analysis...`);
                jsonResponse = await visionClient.analyzeImage(
                    req.file.buffer,
                    req.file.mimetype,
                    fullPrompt
                );
            } catch (apiError) {
                console.error(`${visionProvider} Vision Error:`, apiError.message);
                console.log("Falling back to Heuristic Engine...");
                useHeuristics = true;
            }
        }

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

                    // Determine severity and recommendations
                    const hasSevereRedness = redness.score > 60;
                    const hasCataract = cataract.risk !== "Low";
                    const isFatigued = fatigue.isFatigued;

                    // Overall health determination
                    const isHealthy = redness.label.includes("Healthy") && cataract.risk === "Low" && !isFatigued;
                    const isDangerous = hasSevereRedness || (cataract.risk === "High");

                    // Build detailed notes
                    const issues = [];
                    if (!redness.label.includes("Healthy")) issues.push(redness.label);
                    if (hasCataract) issues.push(`${cataract.label} (Cataract Risk: ${cataract.risk})`);
                    if (isFatigued) issues.push(fatigue.label);

                    const notes = issues.length > 0
                        ? `Detected: ${issues.join(", ")}. ${isDangerous ? "⚠️ Urgent medical attention recommended." : "Monitor and consider consultation if symptoms persist."}`
                        : "Eyes appear healthy. No significant redness, cloudiness, or fatigue detected.";

                    // Smart recommendations based on severity
                    let recommendations = [];
                    if (isDangerous) {
                        recommendations = [
                            "⚠️ Seek immediate medical attention",
                            "Consult an ophthalmologist as soon as possible",
                            "Avoid straining your eyes until examined"
                        ];
                    } else if (!isHealthy) {
                        if (isFatigued && !hasSevereRedness) {
                            recommendations = [
                                "Get adequate sleep (7-8 hours)",
                                "Rest your eyes regularly",
                                "Consider using lubricating eye drops"
                            ];
                        } else {
                            recommendations = [
                                "Rest your eyes from screens",
                                "Use lubricating drops if feeling dry",
                                "Consult a doctor if symptoms worsen"
                            ];
                        }
                    } else {
                        recommendations = [
                            "Continue good eye hygiene",
                            "Wear sunglasses outdoors",
                            "Regular eye checkups recommended"
                        ];
                    }

                    jsonResponse = JSON.stringify({
                        result: isHealthy ? "Healthy" : (isDangerous ? "Urgent" : "Concern"),
                        confidence: Math.max(redness.score, cataract.score, fatigue.score),
                        notes: notes,
                        recommendations: recommendations,
                        needsHospital: isDangerous, // Flag to trigger hospital finder
                        severity: isDangerous ? "high" : (isHealthy ? "none" : "moderate")
                    });
                } catch (err) {
                    console.error("Heuristic analysis failed:", err);
                    jsonResponse = JSON.stringify({
                        result: "Inconclusive",
                        confidence: 0,
                        notes: "Could not process image for analysis. Ensure eye is well-lit and centered.",
                        recommendations: ["Consult a doctor for accurate diagnosis"],
                        needsHospital: false,
                        severity: "none"
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

                    let ensembleScore = 0;
                    let isDangerous = false;

                    if (cavity.risk === "High") {
                        ensembleScore += 80;
                        isDangerous = true;
                    } else if (cavity.risk === "Moderate") ensembleScore += 40;

                    if (gumHealth.inflammationLevel === "High") {
                        ensembleScore += 60;
                        isDangerous = true;
                    } else if (gumHealth.inflammationLevel === "Moderate") ensembleScore += 30;

                    if (hygiene.score < 30) ensembleScore += 50;
                    else if (hygiene.score < 60) ensembleScore += 20;

                    let result = "Healthy";
                    let primaryIssue = [];

                    if (cavity.risk === "High" && gumHealth.inflammationLevel === "High") {
                        result = "Urgent";
                        primaryIssue.push("Severe cavities & gum disease");
                    } else if (cavity.risk === "High") {
                        result = "Urgent";
                        primaryIssue.push("Deep cavities detected");
                    } else if (gumHealth.inflammationLevel === "High") {
                        result = "Urgent";
                        primaryIssue.push("Severe gum inflammation");
                    } else if (cavity.risk === "Moderate" || gumHealth.inflammationLevel === "Moderate" || hygiene.score < 50) {
                        result = "Concern";
                        if (cavity.risk === "Moderate") primaryIssue.push("Early cavity formation");
                        if (gumHealth.inflammationLevel === "Moderate") primaryIssue.push("Gum inflammation");
                        if (hygiene.score < 50) primaryIssue.push("Poor oral hygiene");
                    }

                    const notes = primaryIssue.length > 0
                        ? `Multi-Model Analysis: ${primaryIssue.join(", ")}. Hygiene Score: ${hygiene.score}/100.`
                        : "Teeth and gums appear healthy.";

                    let recommendations = isDangerous
                        ? ["⚠️ Schedule immediate dental appointment", "Avoid hard foods", "Maintain gentle brushing"]
                        : result === "Concern"
                            ? ["Get checkup within 2 weeks", "Brush twice daily", "Floss regularly"]
                            : ["Continue regular brushing", "Schedule checkup every 6 months"];

                    jsonResponse = JSON.stringify({
                        result,
                        confidence: Math.max(hygiene.confidence, cavity.score, gumHealth.score),
                        notes,
                        recommendations,
                        needsHospital: isDangerous,
                        severity: isDangerous ? "high" : (result === "Concern" ? "moderate" : "none")
                    });
                } catch (err) {
                    console.error("Teeth analysis failed:", err);
                    jsonResponse = JSON.stringify({
                        result: "Inconclusive",
                        confidence: 0,
                        notes: "Could not process teeth image.",
                        recommendations: ["Retake with better lighting"],
                        needsHospital: false,
                        severity: "none"
                    });
                }
            } else if (scanType === 'skin') {
                try {
                    console.log("Running Multi-Model Skin Analysis...");
                    const [skinTone, moles, texture] = await Promise.all([
                        SkinToneAnalyzer.analyze(req.file.buffer),
                        MoleDetector.analyze(req.file.buffer),
                        TextureAnalyzer.analyze(req.file.buffer)
                    ]);

                    // Ensemble Scoring
                    let ensembleScore = 0;
                    let isDangerous = false;

                    // Condition 1: Inflammation (40% weight)
                    if (skinTone.inflammationLevel === "High") {
                        ensembleScore += 70;
                        isDangerous = true;
                    } else if (skinTone.inflammationLevel === "Moderate") {
                        ensembleScore += 35;
                    }

                    // Condition 2: Mole Risk (35% weight)
                    if (moles.risk === "High") {
                        ensembleScore += 65;
                        isDangerous = true;
                    } else if (moles.risk === "Moderate") {
                        ensembleScore += 30;
                    }

                    // Condition 3: Texture/Acne (25% weight)
                    if (texture.acneLevel === "Severe") {
                        ensembleScore += 50;
                    } else if (texture.acneLevel === "Moderate") {
                        ensembleScore += 25;
                    }

                    let result = "Healthy";
                    let primaryIssues = [];

                    // Multi-condition assessment
                    if (skinTone.inflammationLevel === "High" && moles.risk === "High") {
                        result = "Urgent";
                        primaryIssues.push("Severe skin inflammation");
                        primaryIssues.push("Multiple concerning dark spots");
                    } else if (moles.risk === "High") {
                        result = "Urgent";
                        primaryIssues.push("Moles detected - dermatologist evaluation recommended");
                    } else if (skinTone.inflammationLevel === "High") {
                        result = "Urgent";
                        primaryIssues.push("Severe skin inflammation/rash");
                    } else if (skinTone.inflammationLevel === "Moderate" || moles.risk === "Moderate" || texture.acneLevel === "Severe") {
                        result = "Concern";
                        if (skinTone.inflammationLevel === "Moderate") primaryIssues.push("Moderate redness");
                        if (moles.risk === "Moderate") primaryIssues.push("Some dark spots detected");
                        if (texture.acneLevel === "Severe") primaryIssues.push("Severe acne");
                    } else if (texture.acneLevel === "Moderate") {
                        result = "Concern";
                        primaryIssues.push("Moderate acne/rough texture");
                    }

                    const notes = primaryIssues.length > 0
                        ? `Multi-Model Analysis: ${primaryIssues.join(", ")}. Skin Condition: ${skinTone.condition}.`
                        : "Skin appears healthy with no significant issues detected.";

                    let recommendations = isDangerous
                        ? ["⚠️ See a dermatologist immediately", "Avoid sun exposure", "Document any changes"]
                        : result === "Concern"
                            ? ["Schedule dermatology checkup", "Use gentle skincare products", "Monitor for changes"]
                            : ["Maintain good skincare routine", "Use sunscreen daily", "Stay hydrated"];

                    jsonResponse = JSON.stringify({
                        result,
                        confidence: Math.max(skinTone.confidence, moles.score, texture.score),
                        notes,
                        recommendations,
                        needsHospital: isDangerous,
                        severity: isDangerous ? "high" : (result === "Concern" ? "moderate" : "none")
                    });
                } catch (err) {
                    console.error("Skin analysis failed:", err);
                    jsonResponse = JSON.stringify({
                        result: "Inconclusive",
                        confidence: 0,
                        notes: "Could not process skin image.",
                        recommendations: ["Retake with better lighting"],
                        needsHospital: false,
                        severity: "none"
                    });
                }
            } else {
                jsonResponse = JSON.stringify({
                    result: "Healthy",
                    confidence: 70,
                    notes: "Analysis for this scan type coming soon.",
                    recommendations: ["Consult a specialist"],
                    needsHospital: false,
                    severity: "none"
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
                result: "Inconclusive",
                confidence: 85,
                notes: jsonResponse.substring(0, 200),
                recommendations: ["Consult a healthcare provider for detailed assessment"],
                needsHospital: false,
                severity: "none"
            };
        }

        // Save image to disk
        let imageUrl = null;
        if (req.file) {
            const fileName = `${userId}-${Date.now()}.jpg`;
            const uploadDir = path.join('uploads', 'scans');

            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, req.file.buffer);
            imageUrl = `/uploads/scans/${fileName}`;
        }

        // Save to Database
        const scan = await HealthScan.create({
            userId,
            scanType: scanType || "eyes",
            result: analysis.result,
            confidence: analysis.confidence,
            notes: analysis.notes,
            recommendations: analysis.recommendations || [],
            needsHospital: analysis.needsHospital || false,
            severity: analysis.severity || "none",
            status: "success",
            imageUrl: imageUrl
        });

        res.status(200).json({
            success: true,
            message: "Analysis complete",
            data: {
                ...scan.toObject(),
                recommendations: analysis.recommendations,
                needsHospital: analysis.needsHospital || false,
                severity: analysis.severity || "none"
            }
        });
    } catch (error) {
        console.error("Error in analyzeFace:", error);
        try { await import('fs').then(fs => fs.writeFileSync('backend_error.log', error.toString() + "\n" + (error.stack || "") + "\n" + JSON.stringify(error, null, 2))); } catch (e) { }
        res.status(500).json({ success: false, message: error.message });
    }
};
