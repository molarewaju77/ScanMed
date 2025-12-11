import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    createScan,
    getUserScans,
    getScanById,
    deleteScan,
    restoreScan,
} from "../controllers/healthScan.controller.js";

const router = express.Router();

router.post("/", verifyToken, createScan);
router.get("/", verifyToken, getUserScans);
router.get("/:id", verifyToken, getScanById);
router.delete("/:id", verifyToken, deleteScan);
router.patch("/:id/restore", verifyToken, restoreScan);

export default router;
