import mongoose from "mongoose";

const medicationLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    medicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medication",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        // Should be normalized to midnight (00:00:00) of the day
    },
    status: {
        type: String,
        enum: ["Taken", "Skipped", "Missed"],
        default: "Taken",
    },
    takenAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Ensure one log per med per day
medicationLogSchema.index({ medicationId: 1, date: 1 }, { unique: true });

export const MedicationLog = mongoose.model("MedicationLog", medicationLogSchema);
