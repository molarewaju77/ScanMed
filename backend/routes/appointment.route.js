import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    createAppointment,
    getUserAppointments,
    updateAppointment,
    deleteAppointment,
    restoreAppointment
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createAppointment);
router.get("/", getUserAppointments);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.patch("/:id/restore", restoreAppointment);

export default router;
