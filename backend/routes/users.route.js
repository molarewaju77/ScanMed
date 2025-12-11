import express from 'express';
import { User } from '../models/user.model.js';

import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// GET /api/users - fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password for security
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// PUT /api/users/profile - update user profile
router.put('/profile', verifyToken, async (req, res) => {
  const userId = req.userId;
  const updates = req.body;

  try {
    // Prevent updating sensitive fields like password or role directly through this endpoint if needed
    delete updates.password;
    delete updates.role;
    delete updates.email; // Usually email changes require verification

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// PATCH /api/users/:id/role - update user role
router.patch('/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    console.error('Failed to update user role:', error);
    res.status(500).json({ message: 'Server error updating role' });
  }
});

// POST /api/users/fcm-token - update user FCM token
router.post('/fcm-token', verifyToken, async (req, res) => {
  const userId = req.userId;
  const { fcmToken } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { fcmToken }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'FCM token updated successfully' });
  } catch (error) {
    console.error('Failed to update FCM token:', error);
    res.status(500).json({ message: 'Server error updating FCM token' });
  }
});

export default router;
