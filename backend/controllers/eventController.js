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

    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO events (title, description, date, location, image_url, max_participants, registration_open) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, location, image_url, max_participants, true]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: {
        id: result.insertId,
        title,
        description,
        date,
        location,
        image_url,
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
    const { title, description, date, location, image_url, max_participants, registration_open } = req.body;

    // Check if event exists
    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update event
    await pool.query(
      'UPDATE events SET title = ?, description = ?, date = ?, location = ?, image_url = ?, max_participants = ?, registration_open = ? WHERE id = ?',
      [title, description, date, location, image_url, max_participants, registration_open, id]
    );

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
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

