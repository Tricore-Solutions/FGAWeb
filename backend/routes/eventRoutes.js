const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Get all events (public)
router.get('/', getAllEvents);

// Get single event by ID (public)
router.get('/:id', getEventById);

// Create event (protected - requires admin role)
router.post('/', authMiddleware, adminMiddleware, createEvent);

// Update event (protected - requires admin role)
router.put('/:id', authMiddleware, adminMiddleware, updateEvent);

// Delete event (protected - requires admin role)
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;

