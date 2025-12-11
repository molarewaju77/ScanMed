import { HealthScan } from "../models/healthScan.model.js";

export const createScan = async (req, res) => {
    try {
        const { scanType, result, confidence, notes, status, imageUrl } = req.body;
        const userId = req.userId;

        const scan = new HealthScan({
            userId,
            scanType,
            result,
            confidence,
            notes,
            status,
            imageUrl,
        });

        await scan.save();

        res.status(201).json({
            success: true,
            message: "Scan created successfully",
            scan,
        });
    } catch (error) {
        console.error("Error creating scan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserScans = async (req, res) => {
    try {
        const userId = req.userId;
        const { includeDeleted } = req.query;

        const filter = { userId };
        if (includeDeleted !== 'true') {
            filter.deletedAt = null;
        }

        const scans = await HealthScan.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            scans,
        });
    } catch (error) {
        console.error("Error fetching scans:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getScanById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const scan = await HealthScan.findOne({
            _id: id,
            userId,
            deletedAt: null
        });

        if (!scan) {
            return res.status(404).json({ success: false, message: "Scan not found" });
        }

        res.status(200).json({
            success: true,
            scan,
        });
    } catch (error) {
        console.error("Error fetching scan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteScan = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Soft delete
        const scan = await HealthScan.findOneAndUpdate(
            { _id: id, userId },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!scan) {
            return res.status(404).json({ success: false, message: "Scan not found" });
        }

        res.status(200).json({
            success: true,
            message: "Scan deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting scan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const restoreScan = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const scan = await HealthScan.findOneAndUpdate(
            { _id: id, userId, deletedAt: { $ne: null } },
            { deletedAt: null },
            { new: true }
        );

        if (!scan) {
            return res.status(404).json({ success: false, message: "Scan not found or already active" });
        }

        res.status(200).json({
            success: true,
            message: "Scan restored successfully",
            scan,
        });
    } catch (error) {
        console.error("Error restoring scan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
