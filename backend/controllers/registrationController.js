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

// Register for program
const registerForProgram = async (req, res) => {
  try {
    const { program_id } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!program_id) {
      return res.status(400).json({ error: 'Program ID is required' });
    }

    // Check if program exists
    const [programs] = await pool.query('SELECT * FROM programs WHERE id = ?', [program_id]);
    if (programs.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const program = programs[0];

    // Check if program is active
    if (!program.is_active) {
      return res.status(400).json({ error: 'Program is not active' });
    }

    // Check if user is already registered
    const [existingRegistrations] = await pool.query(
      'SELECT * FROM registrations WHERE user_id = ? AND program_id = ? AND status != ?',
      [userId, program_id, 'cancelled']
    );

    if (existingRegistrations.length > 0) {
      return res.status(409).json({ error: 'You are already registered for this program' });
    }

    // Insert registration
    const [result] = await pool.query(
      'INSERT INTO registrations (user_id, program_id, status) VALUES (?, ?, ?)',
      [userId, program_id, 'pending']
    );

    res.status(201).json({
      message: 'Registration successful',
      registration: {
        id: result.insertId,
        user_id: userId,
        program_id: program_id,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Program registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all registrations for logged-in user
const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch registrations with event and program details using JOIN
    const [registrations] = await pool.query(
      `SELECT 
        r.id,
        r.user_id,
        r.event_id,
        r.program_id,
        r.status,
        r.created_at,
        e.id as event_id_detail,
        e.title as event_title,
        e.description as event_description,
        e.date as event_date,
        e.location as event_location,
        e.image_url as event_image_url,
        e.max_participants as event_max_participants,
        e.registration_open as event_registration_open,
        p.id as program_id_detail,
        p.name as program_name,
        p.description as program_description,
        p.age_group as program_age_group,
        p.schedule as program_schedule,
        p.price as program_price,
        p.is_active as program_is_active
      FROM registrations r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN programs p ON r.program_id = p.id
      WHERE r.user_id = ? AND r.status != 'cancelled'
      ORDER BY r.created_at DESC`,
      [userId]
    );

    // Format the response to include event/program details
    const formattedRegistrations = registrations.map(reg => {
      const registration = {
        id: reg.id,
        user_id: reg.user_id,
        status: reg.status,
        created_at: reg.created_at,
        type: reg.event_id ? 'event' : 'program'
      };

      if (reg.event_id) {
        registration.event = {
          id: reg.event_id_detail,
          title: reg.event_title,
          description: reg.event_description,
          date: reg.event_date,
          location: reg.event_location,
          image_url: reg.event_image_url,
          max_participants: reg.event_max_participants,
          registration_open: reg.event_registration_open
        };
      }

      if (reg.program_id) {
        registration.program = {
          id: reg.program_id_detail,
          name: reg.program_name,
          description: reg.program_description,
          age_group: reg.program_age_group,
          schedule: reg.program_schedule,
          price: reg.program_price,
          is_active: reg.program_is_active
        };
      }

      return registration;
    });

    res.json(formattedRegistrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all registrations (admin only)
const getAllRegistrations = async (req, res) => {
  try {
    // Fetch all registrations with event, program, and user details using JOIN
    const [registrations] = await pool.query(
      `SELECT 
        r.id,
        r.user_id,
        r.event_id,
        r.program_id,
        r.status,
        r.created_at,
        u.id as user_id_detail,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.email as user_email,
        e.id as event_id_detail,
        e.title as event_title,
        e.description as event_description,
        e.date as event_date,
        e.location as event_location,
        e.image_url as event_image_url,
        e.max_participants as event_max_participants,
        e.registration_open as event_registration_open,
        p.id as program_id_detail,
        p.name as program_name,
        p.description as program_description,
        p.age_group as program_age_group,
        p.schedule as program_schedule,
        p.price as program_price,
        p.is_active as program_is_active
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN programs p ON r.program_id = p.id
      ORDER BY r.created_at DESC`
    );

    // Format the response to include event/program/user details
    const formattedRegistrations = registrations.map(reg => {
      const registration = {
        id: reg.id,
        user_id: reg.user_id,
        status: reg.status,
        created_at: reg.created_at,
        type: reg.event_id ? 'event' : 'program',
        user: {
          id: reg.user_id_detail,
          first_name: reg.user_first_name,
          last_name: reg.user_last_name,
          email: reg.user_email
        }
      };

      if (reg.event_id) {
        registration.event = {
          id: reg.event_id_detail,
          title: reg.event_title,
          description: reg.event_description,
          date: reg.event_date,
          location: reg.event_location,
          image_url: reg.event_image_url,
          max_participants: reg.event_max_participants,
          registration_open: reg.event_registration_open
        };
      }

      if (reg.program_id) {
        registration.program = {
          id: reg.program_id_detail,
          name: reg.program_name,
          description: reg.program_description,
          age_group: reg.program_age_group,
          schedule: reg.program_schedule,
          price: reg.program_price,
          is_active: reg.program_is_active
        };
      }

      return registration;
    });

    res.json(formattedRegistrations);
  } catch (error) {
    console.error('Get all registrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  registerForEvent,
  registerForProgram,
  getMyRegistrations,
  getAllRegistrations
};

