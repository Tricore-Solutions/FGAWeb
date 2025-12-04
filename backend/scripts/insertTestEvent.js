require('dotenv').config();
const pool = require('../config/db');

async function insertTestEvent() {
  try {
    // Test event data
    const eventData = {
      title: 'Summer Championship 2025',
      description: 'Join us for the annual Summer Championship tournament featuring top athletes from across the region. This exciting competition showcases the best talent in sports with multiple categories including basketball, soccer, and track & field. Don\'t miss this opportunity to compete, network, and showcase your skills!\n\nEvent Highlights:\n- Multiple competition categories\n- Professional coaching and support\n- Awards ceremony\n- Networking opportunities\n- Food and refreshments provided',
      date: '2025-07-15 09:00:00',
      location: 'Main Arena, Sports Complex',
      image_url: 'https://via.placeholder.com/1200x600/80b3b4/ffffff?text=Summer+Championship+2025',
      max_participants: 200,
      registration_open: true
    };

    const [result] = await pool.query(
      `INSERT INTO events (title, description, date, location, image_url, max_participants, registration_open) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        eventData.title,
        eventData.description,
        eventData.date,
        eventData.location,
        eventData.image_url,
        eventData.max_participants,
        eventData.registration_open
      ]
    );

    console.log('✅ Test event created successfully!');
    console.log(`Event ID: ${result.insertId}`);
    console.log(`Title: ${eventData.title}`);
    console.log(`Date: ${eventData.date}`);
    console.log(`\nYou can now test the event detail page at: http://localhost:5173/events/${result.insertId}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test event:', error.message);
    process.exit(1);
  }
}

insertTestEvent();

