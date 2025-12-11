import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true
    },
    specialization: {
        type: String,
        required: true,
        enum: ["General Medicine", "Ophthalmology", "Dentistry", "Dermatology", "Cardiology", "Pediatrics", "Other"]
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    availableHours: [{
        day: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        startTime: String, // "09:00"
        endTime: String    // "17:00"
    }],
    consultationFee: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ""
    },
    yearsOfExperience: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema);
