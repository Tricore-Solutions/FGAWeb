const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerForEvent } = require('../controllers/registrationController');

// Register for event (protected - requires authentication)
router.post('/event', authMiddleware, registerForEvent);

module.exports = router;

