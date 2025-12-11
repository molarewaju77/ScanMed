import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        messages: [{
            sender: {
                type: String,
                enum: ["user", "ai"],
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }],
        preview: {
            type: String,
            default: ""
        },
        deletedAt: {
            type: Date,
            default: null
        },
    },
    { timestamps: true }
);

export const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
