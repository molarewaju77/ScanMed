import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createChat,
  getUserChats,
  getChatById,
  updateChat,
  deleteChat,
  restoreChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", verifyToken, createChat);
router.get("/", verifyToken, getUserChats);
router.get("/:id", verifyToken, getChatById);
router.put("/:id", verifyToken, updateChat);
router.delete("/:id", verifyToken, deleteChat);
router.patch("/:id/restore", verifyToken, restoreChat);

export default router;
