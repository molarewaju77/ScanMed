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
router.post("/", protect, managerMiddleware, createArticle);
router.put("/:id", protect, managerMiddleware, updateArticle);
router.delete("/:id", protect, managerMiddleware, deleteArticle);

export default router;
