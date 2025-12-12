import { Medication } from "../models/medication.model.js";
import { MedicationLog } from "../models/medicationLog.model.js";


export const createMedication = async (req, res) => {
    try {
        const { name, dosage, frequency, startDate, endDate, reminderTimes, notes } = req.body;
        const userId = req.userId;

        const medication = new Medication({
            userId,
            name,
            dosage,
            frequency,
            startDate,
            endDate,
            reminderTimes,
            notes,
        });

        await medication.save();

        res.status(201).json({
            success: true,
            message: "Medication added successfully",
            medication,
        });
    } catch (error) {
        console.error("Error creating medication:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserMedications = async (req, res) => {
    try {
        const userId = req.userId;
        const { includeDeleted } = req.query;

        const filter = { userId };
        if (includeDeleted !== 'true') {
            filter.deletedAt = null;
        }

        const medications = await Medication.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            medications,
        });
    } catch (error) {
        console.error("Error fetching medications:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateMedication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updates = req.body;

        const medication = await Medication.findOneAndUpdate(
            { _id: id, userId, deletedAt: null },
            updates,
            { new: true }
        );

        if (!medication) {
            return res.status(404).json({ success: false, message: "Medication not found" });
        }

        res.status(200).json({
            success: true,
            message: "Medication updated successfully",
            medication,
        });
    } catch (error) {
        console.error("Error updating medication:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteMedication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Soft delete
        const medication = await Medication.findOneAndUpdate(
            { _id: id, userId },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!medication) {
            return res.status(404).json({ success: false, message: "Medication not found" });
        }

        res.status(200).json({
            success: true,
            message: "Medication deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting medication:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const restoreMedication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const medication = await Medication.findOneAndUpdate(
            { _id: id, userId, deletedAt: { $ne: null } },
            { deletedAt: null },
            { new: true }
        );

        if (!medication) {
            return res.status(404).json({ success: false, message: "Medication not found or already active" });
        }

        res.status(200).json({
            success: true,
            message: "Medication restored successfully",
            medication,
        });
    } catch (error) {
        console.error("Error restoring medication:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logMedication = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, date } = req.body;
        const userId = req.userId;

        const logDate = new Date(date);
        logDate.setHours(0, 0, 0, 0);

        const log = await MedicationLog.findOneAndUpdate(
            { medicationId: id, date: logDate, userId },
            { status, takenAt: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "Medication logged successfully",
            log
        });
    } catch (error) {
        console.error("Error logging medication:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdherence = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const adherenceData = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });

            const totalMeds = await Medication.countDocuments({
                userId,
                startDate: { $lte: d },
                $or: [{ endDate: { $gte: d } }, { endDate: null }],
                deletedAt: null,
                status: "Active"
            });

            const takenLogs = await MedicationLog.countDocuments({
                userId,
                date: d,
                status: "Taken"
            });

            let percentage = 0;
            if (totalMeds > 0) {
                percentage = Math.round((takenLogs / totalMeds) * 100);
            }

            adherenceData.push({ day: dateStr, adherence: percentage, date: d });
        }

        res.status(200).json({
            success: true,
            adherence: adherenceData
        });

    } catch (error) {
        console.error("Error fetching adherence:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
