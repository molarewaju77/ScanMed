import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/user.model.js";

// ===== ADMIN FUNCTIONS (Manage Doctors) =====

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate('userId', 'name email isBlocked')
            .populate('hospitalId', 'name address')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, doctors });
    } catch (error) {
        console.error("Error in getAllDoctors:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { verified: true },
            { new: true }
        ).populate('userId', 'name email');

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.status(200).json({ success: true, doctor });
    } catch (error) {
        console.error("Error in verifyDoctor:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const blockDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Block the associated user account
        const user = await User.findByIdAndUpdate(
            doctor.userId,
            { isBlocked: true },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Doctor blocked successfully", user });
    } catch (error) {
        console.error("Error in blockDoctor:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const unblockDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Unblock the associated user account
        const user = await User.findByIdAndUpdate(
            doctor.userId,
            { isBlocked: false },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Doctor unblocked successfully", user });
    } catch (error) {
        console.error("Error in unblockDoctor:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await Doctor.findByIdAndDelete(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.status(200).json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Error in deleteDoctor:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ===== SUPER ADMIN FUNCTIONS (Manage Admins) =====

export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, admins });
    } catch (error) {
        console.error("Error in getAllAdmins:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create new admin
        const admin = await User.create({
            email,
            name,
            password, // Should be hashed by User model pre-save hook
            role: "admin",
            isVerified: true
        });

        res.status(201).json({ success: true, admin });
    } catch (error) {
        console.error("Error in createAdmin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const blockAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        const admin = await User.findByIdAndUpdate(
            adminId,
            { isBlocked: true },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.status(200).json({ success: true, message: "Admin blocked successfully", admin });
    } catch (error) {
        console.error("Error in blockAdmin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const unblockAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        const admin = await User.findByIdAndUpdate(
            adminId,
            { isBlocked: false },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.status(200).json({ success: true, message: "Admin unblocked successfully", admin });
    } catch (error) {
        console.error("Error in unblockAdmin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
