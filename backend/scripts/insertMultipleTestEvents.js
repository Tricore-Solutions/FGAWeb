require('dotenv').config();
const pool = require('../config/db');

async function insertMultipleTestEvents() {
  try {
    const events = [
      {
        title: 'Summer Championship 2025',
        description: 'Join us for the annual Summer Championship tournament featuring top athletes from across the region. This exciting competition showcases the best talent in sports with multiple categories including basketball, soccer, and track & field. Don\'t miss this opportunity to compete, network, and showcase your skills!\n\nEvent Highlights:\n- Multiple competition categories\n- Professional coaching and support\n- Awards ceremony\n- Networking opportunities\n- Food and refreshments provided',
        date: '2025-07-15 09:00:00',
        location: 'Main Arena, Sports Complex',
        image_url: 'https://via.placeholder.com/1200x600/80b3b4/ffffff?text=Summer+Championship+2025',
        max_participants: 200,
        registration_open: true
      },
      {
        title: 'Youth Development Workshop',
        description: 'Interactive workshop focused on developing fundamental skills for young athletes. Learn from experienced coaches and improve your technique. Perfect for athletes aged 10-16 looking to enhance their skills and build confidence.\n\nWorkshop Topics:\n- Basic skills development\n- Team building exercises\n- Nutrition and fitness tips\n- Mental preparation techniques',
        date: '2025-08-05 10:00:00',
        location: 'Training Center, Building A',
        image_url: 'https://via.placeholder.com/1200x600/80b3b4/ffffff?text=Youth+Development+Workshop',
        max_participants: 50,
        registration_open: true
      },
      {
        title: 'Elite Training Camp',
        description: 'Intensive training camp for advanced athletes seeking to reach the next level. Focus on performance enhancement and competitive preparation. This camp is designed for serious athletes who want to take their game to the professional level.\n\nCamp Features:\n- Advanced training techniques\n- Performance analysis\n- One-on-one coaching sessions\n- Competitive scrimmages\n- Professional athlete guest speakers',
        date: '2025-09-10 08:00:00',
        location: 'Sports Complex, Main Field',
        image_url: 'https://via.placeholder.com/1200x600/80b3b4/ffffff?text=Elite+Training+Camp',
        max_participants: 75,
        registration_open: true
      },
      {
        title: 'Spring Invitational Tournament',
        description: 'Competitive invitational event bringing together elite athletes from multiple regions. High-level competition and networking opportunities. This prestigious tournament attracts top talent and provides excellent exposure for participating athletes.',
        date: '2025-04-20 08:00:00',
        location: 'Main Arena',
        image_url: 'https://via.placeholder.com/1200x600/80b3b4/ffffff?text=Spring+Invitational',
        max_participants: 150,
        registration_open: true
      }
    ];

    const insertedIds = [];

    for (const event of events) {
      const [result] = await pool.query(
        `INSERT INTO events (title, description, date, location, image_url, max_participants, registration_open) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.date,
          event.location,
          event.image_url,
          event.max_participants,
          event.registration_open
        ]
      );
      insertedIds.push(result.insertId);
    }

    console.log('✅ Successfully created', events.length, 'test events!');
    console.log('\nEvent IDs created:');
    events.forEach((event, index) => {
      console.log(`  ${insertedIds[index]}: ${event.title}`);
    });
    console.log('\nYou can now test the event detail pages at:');
    insertedIds.forEach(id => {
      console.log(`  http://localhost:5173/events/${id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test events:', error.message);
    process.exit(1);
  }
}

insertMultipleTestEvents();

