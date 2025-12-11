import { Appointment } from "../models/appointment.model.js";

export const createAppointment = async (req, res) => {
    try {
        const { doctorName, specialty, date, time, location, notes, hospitalName, hospitalId } = req.body;
        const userId = req.userId;

        const appointment = new Appointment({
            userId,
            doctorName,
            specialty,
            date,
            time,
            location,
            notes,
            hospitalName,
            hospitalId
        });

        await appointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment scheduled successfully",
            appointment,
        });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserAppointments = async (req, res) => {
    try {
        const userId = req.userId;
        const { includeDeleted } = req.query;

        const filter = { userId };
        if (includeDeleted !== 'true') {
            filter.deletedAt = null;
        }

        const appointments = await Appointment.find(filter).sort({ date: 1 });

        res.status(200).json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updates = req.body;

        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, userId, deletedAt: null },
            updates,
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        res.status(200).json({
            success: true,
            message: "Appointment updated successfully",
            appointment,
        });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Soft delete
        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, userId },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
        });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const restoreAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, userId, deletedAt: { $ne: null } },
            { deletedAt: null },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found or already active" });
        }

        res.status(200).json({
            success: true,
            message: "Appointment restored successfully",
            appointment,
        });
    } catch (error) {
        console.error("Error restoring appointment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
