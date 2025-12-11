import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { verifySuperAdmin } from "../middleware/verifySuperAdmin.js";
import {
    getAllDoctors,
    verifyDoctor,
    blockDoctor,
    unblockDoctor,
    deleteDoctor,
    getAllAdmins,
    createAdmin,
    blockAdmin,
    unblockAdmin
} from "../controllers/adminManagement.controller.js";

const router = express.Router();

// ===== ADMIN ROUTES (Manage Doctors) =====
router.get("/doctors", verifyToken, verifyAdmin, getAllDoctors);
router.put("/doctors/:doctorId/verify", verifyToken, verifyAdmin, verifyDoctor);
router.put("/doctors/:doctorId/block", verifyToken, verifyAdmin, blockDoctor);
router.put("/doctors/:doctorId/unblock", verifyToken, verifyAdmin, unblockDoctor);
router.delete("/doctors/:doctorId", verifyToken, verifyAdmin, deleteDoctor);

// ===== SUPERADMIN ROUTES (Manage Admins) =====
router.get("/admins", verifyToken, verifySuperAdmin, getAllAdmins);
router.post("/admins/create", verifyToken, verifySuperAdmin, createAdmin);
router.put("/admins/:adminId/block", verifyToken, verifySuperAdmin, blockAdmin);
router.put("/admins/:adminId/unblock", verifyToken, verifySuperAdmin, unblockAdmin);

export default router;
