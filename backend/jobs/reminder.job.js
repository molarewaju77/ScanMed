import cron from "node-cron";
import { Medication } from "../models/medication.model.js";
import { User } from "../models/user.model.js";
import { sendNotification } from "../services/notification.service.js";

const setupReminderJob = () => {
    // Run every minute
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const currentHour = now.getHours().toString().padStart(2, "0");
            const currentMinute = now.getMinutes().toString().padStart(2, "0");
            const currentTime = `${currentHour}:${currentMinute}`;

            console.log(`Running reminder job for time: ${currentTime}`);

            // Find all active medications that have this time in their reminderTimes
            const medications = await Medication.find({
                status: "Active",
                reminderEnabled: true,
                reminderTimes: currentTime,
                deletedAt: null
            }).populate("userId", "fcmToken name");

            for (const med of medications) {
                const user = med.userId;
                if (user && user.fcmToken) {
                    await sendNotification(
                        user.fcmToken,
                        "Medication Reminder",
                        `Time to take your ${med.name} (${med.dosage})`,
                        {
                            type: "medication",
                            medicationId: med._id.toString()
                        }
                    );
                    console.log(`Sent reminder to ${user.name} for ${med.name}`);
                }
            }
        } catch (error) {
            console.error("Error in reminder job:", error);
        }
    });

    console.log("Reminder job scheduled.");
};

export default setupReminderJob;
