const pool = require('../config/db');

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!event_id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Check if event exists
    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = events[0];

    // Check if registration is open
    if (!event.registration_open) {
      return res.status(400).json({ error: 'Registration is closed for this event' });
    }

    // Check if user is already registered
    const [existingRegistrations] = await pool.query(
      'SELECT * FROM registrations WHERE user_id = ? AND event_id = ? AND status != ?',
      [userId, event_id, 'cancelled']
    );

    if (existingRegistrations.length > 0) {
      return res.status(409).json({ error: 'You are already registered for this event' });
    }

    // Check if event is full
    if (event.max_participants !== null) {
      const [registrations] = await pool.query(
        'SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status != ?',
        [event_id, 'cancelled']
      );

      const registeredCount = registrations[0].count;

      if (registeredCount >= event.max_participants) {
        return res.status(400).json({ error: 'Event Full' });
      }
    }

    // Insert registration
    const [result] = await pool.query(
      'INSERT INTO registrations (user_id, event_id, status) VALUES (?, ?, ?)',
      [userId, event_id, 'pending']
    );

    res.status(201).json({
      message: 'Registration successful',
      registration: {
        id: result.insertId,
        user_id: userId,
        event_id: event_id,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  registerForEvent
};

