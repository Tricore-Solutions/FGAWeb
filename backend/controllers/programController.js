const pool = require('../config/db');

// Get all programs
const getAllPrograms = async (req, res) => {
  try {
    const [programs] = await pool.query(
      'SELECT * FROM programs ORDER BY created_at DESC'
    );
    res.json(programs);
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single program by ID
const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const [programs] = await pool.query(
      'SELECT * FROM programs WHERE id = ?',
      [id]
    );

    if (programs.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json(programs[0]);
  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create program
const createProgram = async (req, res) => {
  try {
    const { name, description, age_group, schedule, price } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO programs (name, description, age_group, schedule, price) VALUES (?, ?, ?, ?, ?)',
      [name, description, age_group, schedule, price]
    );

    res.status(201).json({
      message: 'Program created successfully',
      program: {
        id: result.insertId,
        name,
        description,
        age_group,
        schedule,
        price
      }
    });
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update program
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, age_group, schedule, price } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if program exists
    const [programs] = await pool.query('SELECT * FROM programs WHERE id = ?', [id]);
    if (programs.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const existingProgram = programs[0];

    // Validate ownership or admin role
    if (existingProgram.user_id !== undefined) {
      // If user_id field exists, check ownership
      if (existingProgram.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: 'You can only update your own programs' });
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
    if (age_group !== undefined) {
      updateFields.push('age_group = ?');
      updateValues.push(age_group);
    }
    if (schedule !== undefined) {
      updateFields.push('schedule = ?');
      updateValues.push(schedule);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }

    // If no fields to update, return error
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add id for WHERE clause
    updateValues.push(id);

    // Execute update
    await pool.query(
      `UPDATE programs SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated program
    const [updatedPrograms] = await pool.query('SELECT * FROM programs WHERE id = ?', [id]);

    res.json({
      message: 'Program updated successfully',
      program: updatedPrograms[0]
    });
  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete program
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if program exists
    const [programs] = await pool.query('SELECT * FROM programs WHERE id = ?', [id]);
    if (programs.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const existingProgram = programs[0];

    // Validate ownership or admin role
    if (existingProgram.user_id !== undefined) {
      // If user_id field exists, check ownership
      if (existingProgram.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: 'You can only delete your own programs' });
      }
    } else {
      // If no user_id field, only admin can delete
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    await pool.query('DELETE FROM programs WHERE id = ?', [id]);

    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
};

