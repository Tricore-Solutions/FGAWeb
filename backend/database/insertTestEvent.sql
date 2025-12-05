-- Insert test event for testing EventDetail page
-- Run this SQL script in your MySQL database

USE fgaweb;

INSERT INTO events (title, description, date, location, image_url, max_participants, registration_open) 
VALUES (
  'Summer Championship 2025',
  'Join us for the annual Summer Championship tournament featuring top athletes from across the region. This exciting competition showcases the best talent in sports with multiple categories including basketball, soccer, and track & field. Don''t miss this opportunity to compete, network, and showcase your skills!

Event Highlights:
- Multiple competition categories
- Professional coaching and support
- Awards ceremony
- Networking opportunities
- Food and refreshments provided',
  '2025-07-15 09:00:00',
  'Main Arena, Sports Complex',
  'https://via.placeholder.com/1200x600/80b3b4/ffffff?text=Summer+Championship+2025',
  200,
  TRUE
);

-- To view the created event ID:
SELECT id, title, date FROM events ORDER BY id DESC LIMIT 1;

