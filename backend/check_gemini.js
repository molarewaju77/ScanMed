import 'dotenv/config';

console.log("GEMINI_API_KEY Present:", !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
    console.log("Key Length:", process.env.GEMINI_API_KEY.length);
}
