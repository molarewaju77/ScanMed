import express from "express";
import { chat, speechToText, textToSpeech, analyzeFace } from "../controllers/ml.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Chat endpoint
router.post("/chat", verifyToken, chat);

// Speech endpoints
router.post("/stt", verifyToken, upload.single("audio"), speechToText);
router.post("/tts", verifyToken, textToSpeech);

// Analysis endpoints
router.post("/analyze-face", verifyToken, upload.single("image"), analyzeFace);

export default router;
