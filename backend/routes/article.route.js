import express from "express";
import {
    getArticles,
    getArticleBySlug,
    getArticleById,
    getFeaturedArticles,
    getArticlesByCategory,
    incrementViews,
    likeArticle,
    getCategories,
    createArticle,
    updateArticle,
    deleteArticle,
} from "../controllers/article.controller.js";
import { protect, managerMiddleware } from "../middleware/authMiddleware.js";

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const router = express.Router();

// Public routes
router.get("/", getArticles);
router.get("/featured", getFeaturedArticles);
router.get("/categories", getCategories);
router.get("/category/:category", getArticlesByCategory);
router.get("/id/:id", getArticleById);
router.get("/:slug", getArticleBySlug);
router.post("/:id/view", incrementViews);
router.post("/:id/like", likeArticle);

// Protected routes (Manager, Admin, SuperAdmin)
router.post("/", protect, managerMiddleware, upload.single('image'), createArticle);
router.put("/:id", protect, managerMiddleware, upload.single('image'), updateArticle);
router.delete("/:id", protect, managerMiddleware, deleteArticle);

export default router;
