import express from 'express';
import { authMiddleware, adminMiddleware, superAdminMiddleware } from '../middleware/authMiddleware.js';
import {
  searchUsers,
  deleteUser,
  updateUserRole,
  getUsers,
  getUserById,
  getUserStats,
} from '../controllers/admin.controller.js';

const router = express.Router();

// User management routes
router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.get('/users/search', authMiddleware, adminMiddleware, searchUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

// Role management (admin+ can use, but controller has permission logic)
router.put('/users/:id/role', authMiddleware, adminMiddleware, updateUserRole);

// Stats (admin+)
router.get('/stats', authMiddleware, adminMiddleware, getUserStats);

export default router;
