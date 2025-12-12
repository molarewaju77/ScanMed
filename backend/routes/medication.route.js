import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    createMedication,
    getUserMedications,
    updateMedication,
    deleteMedication,
    restoreMedication,
    logMedication,
    getAdherence,
} from "../controllers/medication.controller.js";

const router = express.Router();

router.post("/", verifyToken, createMedication);
router.get("/", verifyToken, getUserMedications);
router.get("/adherence", verifyToken, getAdherence);
router.put("/:id", verifyToken, updateMedication);
router.delete("/:id", verifyToken, deleteMedication);
router.patch("/:id/restore", verifyToken, restoreMedication);
router.post("/:id/log", verifyToken, logMedication);

export default router;

