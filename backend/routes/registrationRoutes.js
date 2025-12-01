const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerForEvent, registerForProgram } = require('../controllers/registrationController');

// Register for event (protected - requires authentication)
router.post('/event', authMiddleware, registerForEvent);

// Register for program (protected - requires authentication)
router.post('/program', authMiddleware, registerForProgram);

module.exports = router;

