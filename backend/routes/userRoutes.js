const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

// Get single user by ID (admin only)
router.get('/:id', authMiddleware, adminMiddleware, getUserById);

// Update user (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateUser);

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;

