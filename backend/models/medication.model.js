import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        dosage: {
            type: String,
            required: true,
        },
        frequency: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Active", "Completed", "Paused"],
            default: "Active",
        },
        adherence: {
            type: Number,
            min: 0,
            max: 100,
            default: 100,
        },
        reminderEnabled: {
            type: Boolean,
            default: true,
        },
        reminderTimes: [{
            type: String, // e.g., "09:00", "21:00"
        }],
        notes: {
            type: String,
        },
        deletedAt: {
            type: Date,
            default: null
        },
    },
    { timestamps: true }
);

export const Medication = mongoose.model("Medication", medicationSchema);
