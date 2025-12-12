import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load env vars
dotenv.config();

console.log("Checking Gemini Configuration...");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

console.log(`API Key found: ${apiKey.substring(0, 5)}...`);

async function testConnection() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Debug: List models if possible, or try alternative names
        console.log("Attempting to connect with gemini-1.5-flash...");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        try {
            const result = await model.generateContent("Hello");
            console.log("SUCCESS: gemini-1.5-flash working!", await result.response.text());
        } catch (e) {
            console.error("gemini-1.5-flash FAILED:", e.message);

            console.log("Trying gemini-pro as fallback...");
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            try {
                const result2 = await model2.generateContent("Hello");
                console.log("SUCCESS: gemini-pro working!", await result2.response.text());
            } catch (e2) {
                console.error("gemini-pro FAILED:", e2.message);
            }
        }

    } catch (error) {
        console.error("Critical Error", error);
    }
}

testConnection();
