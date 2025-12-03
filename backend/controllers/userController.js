const pool = require('../config/db');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users (excluding password_hash for security)
    const [users] = await pool.query(
      `SELECT 
        id,
        first_name,
        last_name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC`
    );

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query(
      `SELECT 
        id,
        first_name,
        last_name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;

    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (first_name !== undefined) {
      updateFields.push('first_name = ?');
      updateValues.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push('last_name = ?');
      updateValues.push(last_name);
    }
    if (email !== undefined) {
      // Check if email already exists (excluding current user)
      const [existingUsers] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
      }
      updateFields.push('role = ?');
      updateValues.push(role);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add id for WHERE clause
    updateValues.push(id);

    // Execute update
    await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const [updatedUsers] = await pool.query(
      `SELECT 
        id,
        first_name,
        last_name,
        email,
        role,
        created_at,
        updated_at
      FROM users WHERE id = ?`,
      [id]
    );

    res.json({
      message: 'User updated successfully',
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Prevent admin from deleting themselves
    if (parseInt(id) === userId) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user (CASCADE will handle related registrations)
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

