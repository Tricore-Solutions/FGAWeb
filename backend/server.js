require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db'); // Initialize database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));
// Increase payload size limit for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Event routes
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

// Program routes
const programRoutes = require('./routes/programRoutes');
app.use('/api/programs', programRoutes);

// Registration routes
const registrationRoutes = require('./routes/registrationRoutes');
app.use('/api/registrations', registrationRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Upload routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// Serve uploaded files statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

