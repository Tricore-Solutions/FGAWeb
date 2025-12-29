const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
} = require('../controllers/tournamentController');

// Get all tournaments (public)
router.get('/', getAllTournaments);

// Get single tournament by ID (public)
router.get('/:id', getTournamentById);

// Create tournament (protected - requires authentication)
router.post('/', authMiddleware, createTournament);

// Update tournament (protected - requires ownership OR admin role)
router.put('/:id', authMiddleware, updateTournament);

// Delete tournament (protected - requires ownership OR admin role)
router.delete('/:id', authMiddleware, deleteTournament);

module.exports = router;

