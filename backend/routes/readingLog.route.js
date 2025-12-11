import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { logReading, getReadingHistory } from "../controllers/readingLog.controller.js";

const router = express.Router();

router.post("/", verifyToken, logReading);
router.get("/", verifyToken, getReadingHistory);

export default router;
