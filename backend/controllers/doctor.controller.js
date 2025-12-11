import { Appointment } from "../models/appointment.model.js";
import { HealthScan } from "../models/healthScan.model.js";
import { Doctor } from "../models/doctor.model.js";

// Doctor Dashboard - Overview stats
export const getDoctorDashboard = async (req, res) => {
    try {
        const doctor = req.doctor; // Set by verifyDoctor middleware

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalAppointments, todayAppointments, pendingAppointments] = await Promise.all([
            Appointment.countDocuments({ hospitalName: doctor.hospitalId.name, status: { $ne: 'cancelled' } }),
            Appointment.countDocuments({
                hospitalName: doctor.hospitalId.name,
                date: { $gte: today },
                status: { $ne: 'cancelled' }
            }),
            Appointment.countDocuments({ hospitalName: doctor.hospitalId.name, status: 'pending' })
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalAppointments,
                todayAppointments,
                pendingAppointments,
                hospital: doctor.hospitalId.name
            }
        });
    } catch (error) {
        console.error("Error in getDoctorDashboard:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get doctor's appointments only
export const getDoctorAppointments = async (req, res) => {
    try {
        const doctor = req.doctor;
        const { status } = req.query;

        let query = { hospitalName: doctor.hospitalId.name };
        if (status) {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
            .populate('userId', 'name email')
            .sort({ date: -1, time: -1 });

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error("Error in getDoctorAppointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get patient scan for a specific appointment
export const getPatientScan = async (req, res) => {
    try {
        const doctor = req.doctor;
        const { appointmentId } = req.params;

        // Verify appointment belongs to doctor's hospital
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.hospitalName !== doctor.hospitalId.name) {
            return res.status(403).json({ success: false, message: "Access denied - Not your patient" });
        }

        // Get patient's recent scans
        const scans = await HealthScan.find({
            userId: appointment.userId,
            isDeleted: { $ne: true }
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({ success: true, scans, appointment });
    } catch (error) {
        console.error("Error in getPatientScan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const doctor = req.doctor;
        const { appointmentId } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.hospitalName !== doctor.hospitalId.name) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        console.error("Error in updateAppointmentStatus:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add consultation notes
export const addConsultationNotes = async (req, res) => {
    try {
        const doctor = req.doctor;
        const { appointmentId } = req.params;
        const { notes } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.hospitalName !== doctor.hospitalId.name) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // Add to existing notes
        appointment.notes = (appointment.notes || "") + "\n\n[Dr. " + doctor.userId.name + " - " + new Date().toLocaleString() + "]\n" + notes;
        await appointment.save();

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        console.error("Error in addConsultationNotes:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
