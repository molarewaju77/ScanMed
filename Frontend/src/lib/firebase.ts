// Firebase completely disabled - uncomment to re-enable
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
//     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

console.log("Firebase is disabled");

// Mock messaging object
export const messaging = null;

export const requestPermission = async () => {
    console.log("Firebase disabled: requestPermission called but doing nothing");
    return null;
    // try {
    //     const permission = await Notification.requestPermission();
    //     if (permission === "granted") {
    //         const token = await getToken(messaging, {
    //             vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    //         });
    //         return token;
    //     } else {
    //         console.log("Notification permission not granted.");
    //         return null;
    //     }
    // } catch (error) {
    //     console.error("Error getting notification permission:", error);
    //     return null;
    // }
};

export const onMessageListener = () => {
    console.log("Firebase disabled: onMessageListener called but doing nothing");
    return new Promise(() => { });
    // new Promise((resolve) => {
    //     onMessage(messaging, (payload) => {
    //         resolve(payload);
    //     });
    // });
};

