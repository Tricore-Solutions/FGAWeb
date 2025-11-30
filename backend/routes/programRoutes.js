const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} = require('../controllers/programController');

// Get all programs (public)
router.get('/', getAllPrograms);

// Get single program by ID (public)
router.get('/:id', getProgramById);

// Create program (protected - requires admin role)
router.post('/', authMiddleware, adminMiddleware, createProgram);

// Update program (protected - requires ownership OR admin role)
router.put('/:id', authMiddleware, updateProgram);

// Delete program (protected - requires ownership OR admin role)
router.delete('/:id', authMiddleware, deleteProgram);

module.exports = router;

