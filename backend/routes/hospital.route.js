import express from "express";
import {
    findNearbyHospitals,
    createHospital,
    getAllHospitals,
    updateHospital,
    deleteHospital,
    togglePartnerStatus
} from "../controllers/hospital.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Public/User routes
router.get("/nearby", verifyToken, findNearbyHospitals);

// Admin-only routes
router.get("/admin/all", verifyToken, verifyAdmin, getAllHospitals);
router.post("/admin/create", verifyToken, verifyAdmin, createHospital);
router.put("/admin/:id", verifyToken, verifyAdmin, updateHospital);
router.delete("/admin/:id", verifyToken, verifyAdmin, deleteHospital);
router.put("/admin/:id/partner", verifyToken, verifyAdmin, togglePartnerStatus);

export default router;
