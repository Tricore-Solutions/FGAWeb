const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);

// Protected routes (admin only)
router.post('/', authMiddleware, adminMiddleware, matchController.createMatch);
router.put('/:id', authMiddleware, adminMiddleware, matchController.updateMatch);
router.delete('/:id', authMiddleware, adminMiddleware, matchController.deleteMatch);

module.exports = router;

