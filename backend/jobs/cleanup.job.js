import cron from "node-cron";
import { HealthScan } from "../models/healthScan.model.js";
import { Medication } from "../models/medication.model.js";
import { Appointment } from "../models/appointment.model.js";
import { ChatHistory } from "../models/chatHistory.model.js";
import { ReadingLog } from "../models/readingLog.model.js";

const cleanupJob = () => {
    // Run every day at midnight: '0 0 * * *'
    cron.schedule("0 0 * * *", async () => {
        console.log("Running cleanup job...");
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const query = { deletedAt: { $lt: thirtyDaysAgo } };

            const scans = await HealthScan.deleteMany(query);
            const meds = await Medication.deleteMany(query);
            const appts = await Appointment.deleteMany(query);
            const chats = await ChatHistory.deleteMany(query);
            const readings = await ReadingLog.deleteMany(query);

            console.log(`Cleanup complete:
        Scans: ${scans.deletedCount}
        Meds: ${meds.deletedCount}
        Appts: ${appts.deletedCount}
        Chats: ${chats.deletedCount}
        Readings: ${readings.deletedCount}
      `);
        } catch (error) {
            console.error("Error in cleanup job:", error);
        }
    });
};

export default cleanupJob;
