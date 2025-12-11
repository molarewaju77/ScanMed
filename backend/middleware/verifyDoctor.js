import { Doctor } from "../models/doctor.model.js";

export const verifyDoctor = async (req, res, next) => {
    try {
        const userId = req.userId; // Set by verifyToken middleware

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized - No user ID" });
        }

        // Check if user is a verified doctor
        const doctor = await Doctor.findOne({ userId, verified: true }).populate('hospitalId');

        if (!doctor) {
            return res.status(403).json({ success: false, message: "Access denied - Not a verified doctor" });
        }

        // Attach doctor info to request
        req.doctor = doctor;
        next();
    } catch (error) {
        console.error("Error in verifyDoctor middleware:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
