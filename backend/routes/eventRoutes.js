const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Get all events
router.get('/', getAllEvents);

// Get single event by ID
router.get('/:id', getEventById);

// Create event (protected - requires authentication)
router.post('/', authMiddleware, createEvent);

// Update event (protected - requires authentication)
router.put('/:id', authMiddleware, updateEvent);

// Delete event (protected - requires authentication)
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;

