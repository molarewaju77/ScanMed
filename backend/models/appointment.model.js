import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        doctorName: {
            type: String,
            required: true,
        },
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
        },
        hospitalName: {
            type: String, // Fallback if no ID
        },
        specialty: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String, // e.g., "14:30"
            required: true,
        },
        location: {
            type: String,
            default: "Virtual",
        },
        notes: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled",
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
