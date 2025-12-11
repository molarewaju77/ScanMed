import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyDoctor } from "../middleware/verifyDoctor.js";
import {
    getDoctorDashboard,
    getDoctorAppointments,
    getPatientScan,
    updateAppointmentStatus,
    addConsultationNotes
} from "../controllers/doctor.controller.js";

const router = express.Router();

// All routes require authentication + doctor verification
router.use(verifyToken, verifyDoctor);

router.get("/dashboard", getDoctorDashboard);
router.get("/appointments", getDoctorAppointments);
router.get("/appointments/:appointmentId/scan", getPatientScan);
router.put("/appointments/:appointmentId/status", updateAppointmentStatus);
router.put("/appointments/:appointmentId/notes", addConsultationNotes);

export default router;
