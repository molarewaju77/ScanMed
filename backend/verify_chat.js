import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function verifyChat() {
    try {
        const key = process.env.GEMINI_API_KEY;
        console.log("Testing with Key:", key ? `${key.substring(0, 5)}...` : "NONE");

        if (!key) {
            console.log(" API Success! Response:", response);
        } catch (error) {
            console.error(" API Failed!");
            console.error("Error Message:", error.message);
            if (error.response) {
                console.error("Error Details:", JSON.stringify(error.response, null, 2));
            }
        }
    }

verifyChat();
