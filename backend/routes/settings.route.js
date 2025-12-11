import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    getSettings,
    updateSettings,
    changePassword,
    exportData,
    clearCache,
    deleteAccount,
} from "../controllers/settings.controller.js";

const router = express.Router();

// All routes require authentication
router.get("/", verifyToken, getSettings);
router.put("/", verifyToken, updateSettings);
router.post("/change-password", verifyToken, changePassword);
router.get("/export-data", verifyToken, exportData);
router.post("/clear-cache", verifyToken, clearCache);
router.delete("/delete-account", verifyToken, deleteAccount);

export default router;
