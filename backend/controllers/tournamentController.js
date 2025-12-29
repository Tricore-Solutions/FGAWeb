const pool = require('../config/db');

// Get all tournaments
const getAllTournaments = async (req, res) => {
  try {
    const [tournaments] = await pool.query(
      'SELECT * FROM tournaments ORDER BY created_at DESC'
    );
    res.json(tournaments);
  } catch (error) {
    console.error('Get tournaments error:', error);
    // Check if error is due to table not existing
    if (error.code === 'ER_NO_SUCH_TABLE' || error.message.includes("doesn't exist")) {
      return res.status(500).json({ 
        error: 'Tournaments table does not exist. Please run the database migration to create the tournaments table.',
        details: 'Run the SQL from backend/database/schema.sql to create the tournaments table.'
      });
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Get single tournament by ID
const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [tournaments] = await pool.query(
      'SELECT * FROM tournaments WHERE id = ?',
      [id]
    );

    if (tournaments.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournaments[0]);
  } catch (error) {
    console.error('Get tournament error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create tournament
const createTournament = async (req, res) => {
  try {
    const { name, description, date, location, status, participants } = req.body;
    const userId = req.user.id; // Get user ID from authenticated user

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO tournaments (name, description, date, location, status, participants, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, date, location, status || 'Upcoming', participants || 0, userId]
    );

    res.status(201).json({
      message: 'Tournament created successfully',
      tournament: {
        id: result.insertId,
        name,
        description,
        date,
        location,
        status: status || 'Upcoming',
        participants: participants || 0
      }
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update tournament
const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, location, status, participants } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if tournament exists
    const [tournaments] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [id]);
    if (tournaments.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const existingTournament = tournaments[0];

    // Validate ownership or admin role
    if (existingTournament.user_id !== undefined) {
      // If user_id field exists, check ownership
      if (existingTournament.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: 'You can only update your own tournaments' });
      }
    } else {
      // If no user_id field, only admin can update
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    // Build update query dynamically - only update provided fields
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (location !== undefined) {
      updateFields.push('location = ?');
      updateValues.push(location);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (participants !== undefined) {
      updateFields.push('participants = ?');
      updateValues.push(participants);
    }

    // If no fields to update, return error
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add id for WHERE clause
    updateValues.push(id);

    // Execute update
    await pool.query(
      `UPDATE tournaments SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated tournament
    const [updatedTournaments] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [id]);

    res.json({
      message: 'Tournament updated successfully',
      tournament: updatedTournaments[0]
    });
  } catch (error) {
    console.error('Update tournament error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete tournament
const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if tournament exists
    const [tournaments] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [id]);
    if (tournaments.length === 0) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const existingTournament = tournaments[0];

    // Validate ownership or admin role
    if (existingTournament.user_id !== undefined) {
      // If user_id field exists, check ownership
      if (existingTournament.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: 'You can only delete your own tournaments' });
      }
    } else {
      // If no user_id field, only admin can delete
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    await pool.query('DELETE FROM tournaments WHERE id = ?', [id]);

    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
};

