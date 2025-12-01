const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerForEvent, registerForProgram, getMyRegistrations } = require('../controllers/registrationController');

// Get all registrations for logged-in user (protected - requires authentication)
router.get('/my', authMiddleware, getMyRegistrations);

// Register for event (protected - requires authentication)
router.post('/event', authMiddleware, registerForEvent);

// Register for program (protected - requires authentication)
router.post('/program', authMiddleware, registerForProgram);

module.exports = router;

