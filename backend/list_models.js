import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            await model.generateContent("Hi");
            console.log("SUCCESS: gemini-1.5-flash");
        } catch (e) { console.log("FAIL: gemini-1.5-flash"); }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            await model.generateContent("Hi");
            console.log("SUCCESS: gemini-1.0-pro");
        } catch (e) { console.log("FAIL: gemini-1.0-pro"); }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            await model.generateContent("Hi");
            console.log("SUCCESS: gemini-pro");
        } catch (e) { console.log("FAIL: gemini-pro"); }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            await model.generateContent("Hi");
            console.log("SUCCESS: gemini-1.5-pro");
        } catch (e) { console.log("FAIL: gemini-1.5-pro"); }

    } catch (err) {
        console.error("Error:", err);
    }
}

listModels();
