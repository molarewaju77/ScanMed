import { ChatHistory } from "../models/chatHistory.model.js";

export const createChat = async (req, res) => {
    try {
        const { title, messages, preview } = req.body;
        const userId = req.userId;

        const chat = new ChatHistory({
            userId,
            title,
            messages,
            preview,
        });

        await chat.save();

        res.status(201).json({
            success: true,
            message: "Chat created successfully",
            chat,
        });
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserChats = async (req, res) => {
    try {
        const userId = req.userId;
        const { includeDeleted } = req.query;

        const filter = { userId };
        if (includeDeleted !== 'true') {
            filter.deletedAt = null;
        }

        const chats = await ChatHistory.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            chats,
        });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getChatById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const chat = await ChatHistory.findOne({
            _id: id,
            userId,
            deletedAt: null
        });

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.status(200).json({
            success: true,
            chat,
        });
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateChat = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { messages, title, preview } = req.body;

        const chat = await ChatHistory.findOneAndUpdate(
            { _id: id, userId, deletedAt: null },
            { messages, title, preview },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.status(200).json({
            success: true,
            message: "Chat updated successfully",
            chat,
        });
    } catch (error) {
        console.error("Error updating chat:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Soft delete
        const chat = await ChatHistory.findOneAndUpdate(
            { _id: id, userId },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const restoreChat = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const chat = await ChatHistory.findOneAndUpdate(
            { _id: id, userId, deletedAt: { $ne: null } },
            { deletedAt: null },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found or already active" });
        }

        res.status(200).json({
            success: true,
            message: "Chat restored successfully",
            chat,
        });
    } catch (error) {
        console.error("Error restoring chat:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
