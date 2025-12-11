import dotenv from "dotenv";
dotenv.config();

async function checkModels() {
    const key = process.env.GEMINI_API_KEY;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("All Models:");
            data.models.forEach(m => {
                console.log(`- ${m.name.replace("models/", "")}`);
            });
        } else {
            console.log("Error:", JSON.stringify(data));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

checkModels();
