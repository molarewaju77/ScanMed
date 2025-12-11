import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const SECRET = "thisisadevelopmentsecretkey12345"; // From restored .env
const BASE_URL = "http://localhost:8000/api/ml/chat";

// Generate a dummy token
const token = jwt.sign({ userId: "6929cb18ff335c7aa109204d8" }, SECRET, { expiresIn: "1h" });

async function testChat() {
    console.log("Testing Chat Endpoint...");
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}` // VerifyToken usually checks cookies or Auth header
            },
            body: JSON.stringify({
                message: "Hello, are you working?",
                history: []
            })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

testChat();
