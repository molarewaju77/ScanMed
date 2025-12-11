import mongoose from "mongoose";

const readingLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    readTime: {
        type: String, // e.g., "5 min"
        required: true,
    },
    dateRead: {
        type: Date,
        default: Date.now,
    },
    articleId: {
        type: String, // Optional reference to an article ID if we have an articles collection later
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export const ReadingLog = mongoose.model("ReadingLog", readingLogSchema);
