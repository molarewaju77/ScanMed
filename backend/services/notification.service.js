import { messaging } from "../config/firebase.js";

export const sendNotification = async (token, title, body, data = {}) => {
    try {
        if (!token) return;

        const message = {
            notification: {
                title,
                body,
            },
            data,
            token,
        };

        const response = await messaging.send(message);
        console.log("Successfully sent message:", response);
        return response;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const sendMulticastNotification = async (tokens, title, body, data = {}) => {
    try {
        if (!tokens || tokens.length === 0) return;

        const message = {
            notification: {
                title,
                body,
            },
            data,
            tokens,
        };

        const response = await messaging.sendMulticast(message);
        console.log(response.successCount + " messages were sent successfully");

        // Handle failed tokens if necessary (e.g., remove invalid ones)
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                }
            });
            console.log("List of tokens that caused failures: " + failedTokens);
        }

        return response;
    } catch (error) {
        console.error("Error sending multicast message:", error);
        throw error;
    }
};
