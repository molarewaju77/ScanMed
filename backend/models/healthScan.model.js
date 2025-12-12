import mongoose from "mongoose";

const healthScanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        scanType: {
            type: String,
            enum: ["eyes", "teeth", "skin"],
            required: true,
        },
        result: {
            type: String,
            enum: ["Healthy", "Minor Issues", "Needs Attention", "Concern", "Urgent", "Inconclusive", "Invalid"],
            default: "Inconclusive"
        },
        confidence: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        healthScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        description: { type: String }, // Backwards compat if needed
        findings: {
            type: [String],
            default: []
        },
        notes: {
            type: String,
        },
        recommendations: {
            type: [String],
            default: []
        },
        needsHospital: {
            type: Boolean,
            default: false
        },
        severity: {
            type: String,
            enum: ["none", "moderate", "high"],
            default: "none"
        },
        status: {
            type: String,
            enum: ["Good", "Low", "Critical", "Invalid", "success", "warning", "danger"], // Added new statuses
            default: "Good",
        },
        imageUrl: {
            type: String,
            default: null
        },
        deletedAt: {
            type: Date,
            default: null
        },
    },
    { timestamps: true }
);

export const HealthScan = mongoose.model("HealthScan", healthScanSchema);
