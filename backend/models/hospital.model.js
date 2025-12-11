import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: "2dsphere", // For geospatial queries
            },
        },
        isPartner: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
        },
        contactPhone: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0,
        },
        bookingEnabled: {
            type: Boolean,
            default: false,
        },
        tags: [{ type: String }], // e.g., ["General", "Optometry", "Dental"]
    },
    { timestamps: true }
);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
