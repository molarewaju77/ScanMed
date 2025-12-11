import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.log("No GEMINI_API_KEY found in .env");
            return;
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // For google-generative-ai package, we can't directly list models easily without admin/tuning API sometimes, 
        // but let's try the common 'getGenerativeModel' on a few known ones or just check if we can simply initialize.
        // Actually, the error message 'Call ListModels' suggests we might be able to using the REST API or similar.
        // But the SDK might not expose listModels directly on the main class in older versions.
        // Let's try a direct fetch which is what the library does.

        console.log("Checking commonly used models...");
        const modelsToCheck = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro", "gemini-flash"];

        for (const modelName of modelsToCheck) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                console.log(`✅ Model '${modelName}' is WORKING.`);
                return; // Found one!
            } catch (e) {
                console.log(`❌ Model '${modelName}' failed: ${e.message.split('\n')[0]}`);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
