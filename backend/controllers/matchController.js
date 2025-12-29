const pool = require('../config/db');

// Get all matches
const getAllMatches = async (req, res) => {
  try {
    const [matches] = await pool.query(
      'SELECT * FROM matches ORDER BY match_date ASC'
    );
    res.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'Database table "matches" not found. Please run migrations.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get match by ID
const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);
    
    if (matches.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json(matches[0]);
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create match
const createMatch = async (req, res) => {
  try {
    const { team1_name, team1_image_url, team2_name, team2_image_url, match_date, tournament, venue, matchday } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!team1_name || !team2_name || !match_date) {
      return res.status(400).json({ error: 'Team names and match date are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO matches (team1_name, team1_image_url, team2_name, team2_image_url, match_date, tournament, venue, matchday, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [team1_name, team1_image_url || null, team2_name, team2_image_url || null, match_date, tournament || null, venue || null, matchday || null, userId]
    );

    res.status(201).json({
      message: 'Match created successfully',
      match: {
        id: result.insertId,
        team1_name,
        team1_image_url,
        team2_name,
        team2_image_url,
        match_date,
        tournament,
        venue,
        matchday,
      }
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update match
const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { team1_name, team1_image_url, team2_name, team2_image_url, match_date, tournament, venue, matchday } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if match exists
    const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);
    if (matches.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const existingMatch = matches[0];

    // Validate ownership or admin role
    if (existingMatch.user_id !== null && existingMatch.user_id !== undefined) {
      if (existingMatch.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: 'You can only update your own matches' });
      }
    } else {
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (team1_name !== undefined) {
      updateFields.push('team1_name = ?');
      updateValues.push(team1_name);
    }
    if (team1_image_url !== undefined) {
      updateFields.push('team1_image_url = ?');
      updateValues.push(team1_image_url);
    }
    if (team2_name !== undefined) {
      updateFields.push('team2_name = ?');
      updateValues.push(team2_name);
    }
    if (team2_image_url !== undefined) {
      updateFields.push('team2_image_url = ?');
      updateValues.push(team2_image_url);
    }
    if (match_date !== undefined) {
      updateFields.push('match_date = ?');
      updateValues.push(match_date);
    }
    if (tournament !== undefined) {
      updateFields.push('tournament = ?');
      updateValues.push(tournament);
    }
    if (venue !== undefined) {
      updateFields.push('venue = ?');
      updateValues.push(venue);
    }
    if (matchday !== undefined) {
      updateFields.push('matchday = ?');
      updateValues.push(matchday);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE matches SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const [updatedMatches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);

    res.json({
      message: 'Match updated successfully',
      match: updatedMatches[0]
    });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete match
const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if match exists
    const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);
    if (matches.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const existingMatch = matches[0];

    // Validate ownership or admin role
    if (existingMatch.user_id !== null && existingMatch.user_id !== undefined) {
      if (existingMatch.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: 'You can only delete your own matches' });
      }
    } else {
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    await pool.query('DELETE FROM matches WHERE id = ?', [id]);

    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
};

