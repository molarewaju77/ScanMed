import { User } from "../models/user.model.js";
import { HealthScan } from "../models/healthScan.model.js";
import { Medication } from "../models/medication.model.js";
import { ChatHistory } from "../models/chatHistory.model.js";
import { ReadingLog } from "../models/readingLog.model.js";
import bcryptjs from "bcryptjs";

// Get user settings
export const getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("settings");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            settings: user.settings || {
                notifications: {
                    email: true,
                    push: true,
                    medicationReminders: true,
                    healthTips: false,
                    scanReminders: true,
                },
                appearance: {
                    theme: "system",
                    language: "en",
                },
                privacy: {
                    shareData: false,
                    analytics: true,
                    crashReports: true,
                },
            },
        });
    } catch (error) {
        console.error("Error in getSettings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update user settings
export const updateSettings = async (req, res) => {
    try {
        const { settings } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { settings },
            { new: true, runValidators: true }
        ).select("settings");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings: user.settings,
        });
    } catch (error) {
        console.error("Error in updateSettings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters",
            });
        }

        const user = await User.findById(req.userId).select("+password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify current password
        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Hash new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Export user data
export const exportData = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -resetPasswordToken -resetPasswordTokenExpiresAt -verificationToken -verificationTokenExpiresAt");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Fetch all user data
        const healthScans = await HealthScan.find({ userId: req.userId });
        const medications = await Medication.find({ userId: req.userId });
        const chatHistory = await ChatHistory.find({ userId: req.userId });
        const readingLogs = await ReadingLog.find({ userId: req.userId });

        const exportData = {
            user: user.toObject(),
            healthScans,
            medications,
            chatHistory,
            readingLogs,
            exportedAt: new Date().toISOString(),
        };

        res.status(200).json({
            success: true,
            data: exportData,
        });
    } catch (error) {
        console.error("Error in exportData:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Clear cache (placeholder - implement based on your caching strategy)
export const clearCache = async (req, res) => {
    try {
        // In a real implementation, you would clear Redis cache or similar
        // For now, we'll just return success
        res.status(200).json({
            success: true,
            message: "Cache cleared successfully",
        });
    } catch (error) {
        console.error("Error in clearCache:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to delete account",
            });
        }

        const user = await User.findById(req.userId).select("+password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Verify password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

        // Delete all user data
        await Promise.all([
            User.findByIdAndDelete(req.userId),
            HealthScan.deleteMany({ userId: req.userId }),
            Medication.deleteMany({ userId: req.userId }),
            ChatHistory.deleteMany({ userId: req.userId }),
            ReadingLog.deleteMany({ userId: req.userId }),
        ]);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteAccount:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
