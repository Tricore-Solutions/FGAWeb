require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db'); // Initialize database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

