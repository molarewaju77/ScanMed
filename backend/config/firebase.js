import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Initialize Firebase only if credentials exist
try {
    let serviceAccount = null;
    const __dirname = path.resolve();

    // 1. Try loading from file in the new 'firebase' folder
    const filePath = path.join(__dirname, "firebase", "serviceAccountKey.json");
    if (fs.existsSync(filePath)) {
        console.log("Found serviceAccountKey.json in firebase folder.");
        serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    // 2. Fallback to Environment Variable
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.log("Found FIREBASE_SERVICE_ACCOUNT in env.");
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", e);
        }
    }

    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin initialized successfully");
    } else {
        console.warn("Firebase credentials not found. Please place 'serviceAccountKey.json' in 'backend/firebase/' or set 'FIREBASE_SERVICE_ACCOUNT' in .env");
    }
} catch (error) {
    console.error("Error initializing Firebase Admin:", error);
}

export const messaging = admin.apps.length > 0 ? admin.messaging() : {
    send: async () => console.log("Mock: Sending notification (Firebase not init)"),
    sendMulticast: async () => console.log("Mock: Sending multicast (Firebase not init)")
};
