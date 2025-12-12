import { useState, useEffect } from "react";
// Firebase completely disabled
// import { requestPermission, onMessageListener } from "@/lib/firebase";
// import { toast } from "sonner";
// import api from "@/lib/api";

const useFcm = () => {
    const [notification, setNotification] = useState({ title: "", body: "" });

    useEffect(() => {
        // Firebase FCM completely disabled
        console.log("Firebase FCM is disabled - no push notifications will be received");

        // const initFcm = async () => {
        //     const token = await requestPermission();
        //     if (token) {
        //         console.log("FCM Token:", token);
        //         const isAuthenticated = localStorage.getItem("isAuthenticated");

        //         if (isAuthenticated) {
        //             // Send token to backend to save it
        //             try {
        //                 await api.post("/users/fcm-token", { fcmToken: token });
        //             } catch (error: any) {
        //                 console.error("Failed to save FCM token to backend", error);
        //                 if (error.response && error.response.status === 401) {
        //                     localStorage.removeItem("isAuthenticated");
        //                     localStorage.removeItem("user");
        //                 }
        //             }
        //         }
        //     }
        // };

        // initFcm();

        // const unsubscribe = onMessageListener().then((payload: any) => {
        //     setNotification({
        //         title: payload?.notification?.title || "New Message",
        //         body: payload?.notification?.body || "",
        //     });
        //     toast(payload?.notification?.title || "New Message", {
        //         description: payload?.notification?.body,
        //     });
        // });

        // return () => {
        //   unsubscribe.catch((err) => console.log("failed: ", err));
        // };
    }, []);

    return { notification };
};

export default useFcm;

