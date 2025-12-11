import { Medication } from "../models/medication.model.js";

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
