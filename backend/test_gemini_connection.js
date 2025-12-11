import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDXqgZZG8hOutVd-m9JQG_YoRIreQHbdEQ";

async function testGemini() {
    console.log("Testing Gemini API connectivity with key: " + API_KEY.substring(0, 10) + "...");
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const result = await chat.sendMessage("Hello, are you working?");
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response: ", text);
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
    }
}

testGemini();
