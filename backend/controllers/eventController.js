const pool = require('../config/db');

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const [events] = await pool.query(
      'SELECT * FROM events ORDER BY date DESC'
    );
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const [events] = await pool.query(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(events[0]);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, image_url, max_participants } = req.body;
    const userId = req.user.id; // Get user ID from authenticated user

    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    // If image_url is provided, use it; otherwise use null
    const finalImageUrl = image_url || null;

    const [result] = await pool.query(
      'INSERT INTO events (title, description, date, location, image_url, max_participants, registration_open, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, location, finalImageUrl, max_participants, true, userId]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: {
        id: result.insertId,
        title,
        description,
        date,
        location,
        image_url: finalImageUrl,
        max_participants
      }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, image_url, max_participants } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if event exists
    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const existingEvent = events[0];

    // Validate ownership or admin role
    // If user_id is NULL or doesn't match, only admin can update
    if (existingEvent.user_id !== null && existingEvent.user_id !== undefined) {
      // If user_id exists and matches, allow update
      // If user_id exists but doesn't match, only admin can update
      if (existingEvent.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: 'You can only update your own events' });
      }
    } else {
      // If user_id is NULL, only admin can update
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    // Build update query dynamically - only update provided fields
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
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
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    if (max_participants !== undefined) {
      updateFields.push('max_participants = ?');
      updateValues.push(max_participants);
    }

    // If no fields to update, return error
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add id for WHERE clause
    updateValues.push(id);

    // Execute update
    await pool.query(
      `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated event
    const [updatedEvents] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);

    res.json({
      message: 'Event updated successfully',
      event: updatedEvents[0]
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if event exists
    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const existingEvent = events[0];

    // Validate ownership or admin role
    // If user_id is NULL or doesn't match, only admin can delete
    if (existingEvent.user_id !== null && existingEvent.user_id !== undefined) {
      // If user_id exists and matches, allow delete
      // If user_id exists but doesn't match, only admin can delete
      if (existingEvent.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: 'You can only delete your own events' });
      }
    } else {
      // If user_id is NULL, only admin can delete
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    await pool.query('DELETE FROM events WHERE id = ?', [id]);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};

